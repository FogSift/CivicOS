/**
 * @fileId 30c3e3d8-a46d-48ac-ae7d-afccf344aa1e
 * @module CivicOS/hooks/useWindowManager
 * @description Window state reducer — open/close/focus/minimize/maximize/drag
 *              with z-index management. Layout persists via the kernel.
 */

import { useReducer, useCallback, useEffect, useRef } from 'react';
import { useKernel } from '../kernel/CivicProvider.jsx';

const DEFAULT_SIZES = {
  plaza:     { w: 860, h: 580 },
  builder:   { w: 980, h: 620 },
  vault:     { w: 700, h: 480 },
  ops:       { w: 760, h: 540 },
  notepad:   { w: 560, h: 420 },
  computer:  { w: 640, h: 460 },
  addlead:   { w: 480, h: 400 },
  events:    { w: 760, h: 500 },
};

// Drag emits MOVE per mousemove — debounce writes so IndexedDB isn't hammered.
const PERSIST_DEBOUNCE_MS = 300;

const isValidLayout = (s) =>
  s && Array.isArray(s.windows) && typeof s.openCount === 'number';

function cascade(id, openCount) {
  const offset = (openCount % 8) * 28;
  return { x: 80 + offset, y: 60 + offset };
}

function nextZ(windows) {
  return windows.length === 0 ? 10 : Math.max(...windows.map(w => w.z)) + 1;
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows.find(w => w.id === action.id);
      if (existing) {
        // Bring to front and restore if minimized
        return {
          ...state,
          windows: state.windows.map(w =>
            w.id === action.id
              ? { ...w, minimized: false, z: nextZ(state.windows) }
              : w
          ),
        };
      }
      const size = DEFAULT_SIZES[action.appId] ?? { w: 720, h: 500 };
      const pos  = cascade(action.id, state.openCount);
      return {
        windows: [
          ...state.windows,
          {
            id:        action.id,
            appId:     action.appId,
            title:     action.title,
            x:         pos.x,
            y:         pos.y,
            w:         size.w,
            h:         size.h,
            z:         nextZ(state.windows),
            minimized: false,
            maximized: false,
          },
        ],
        openCount: state.openCount + 1,
      };
    }
    case 'CLOSE':
      return { ...state, windows: state.windows.filter(w => w.id !== action.id) };

    case 'FOCUS':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, z: nextZ(state.windows) } : w
        ),
      };

    case 'MINIMIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, minimized: true } : w
        ),
      };

    case 'RESTORE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id
            ? { ...w, minimized: false, z: nextZ(state.windows) }
            : w
        ),
      };

    case 'MAXIMIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, maximized: !w.maximized, minimized: false } : w
        ),
      };

    case 'MOVE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w
        ),
      };

    default:
      return state;
  }
}

export function useWindowManager() {
  const { snapshots, saveSnapshot, logEvent } = useKernel();
  const [state, dispatch] = useReducer(
    reducer,
    isValidLayout(snapshots.windows) ? snapshots.windows : { windows: [], openCount: 0 }
  );

  // Ref lets open/close callbacks inspect current windows without dep churn.
  const windowsRef = useRef(state.windows);
  windowsRef.current = state.windows;

  useEffect(() => {
    const timer = setTimeout(() => saveSnapshot('windows', state), PERSIST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state, saveSnapshot]);

  const openWindow  = useCallback((id, appId, title) => {
    if (!windowsRef.current.some(w => w.id === id)) logEvent('window.open', { appId, title });
    dispatch({ type: 'OPEN', id, appId, title });
  }, [logEvent]);
  const closeWindow = useCallback((id) => {
    const win = windowsRef.current.find(w => w.id === id);
    if (win) logEvent('window.close', { appId: win.appId });
    dispatch({ type: 'CLOSE', id });
  }, [logEvent]);
  const focusWindow = useCallback((id)                => dispatch({ type: 'FOCUS',    id }),               []);
  const minimize    = useCallback((id)                => dispatch({ type: 'MINIMIZE', id }),               []);
  const restore     = useCallback((id)                => dispatch({ type: 'RESTORE',  id }),               []);
  const maximize    = useCallback((id)                => dispatch({ type: 'MAXIMIZE', id }),               []);
  const moveWindow  = useCallback((id, x, y)          => dispatch({ type: 'MOVE',     id, x, y }),         []);

  return {
    windows: state.windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimize,
    restore,
    maximize,
    moveWindow,
  };
}
