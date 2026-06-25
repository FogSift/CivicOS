import React, { useRef, useCallback, useEffect } from 'react';

export default function OsWindow({
  win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children,
}) {
  const dragState = useRef(null);

  const onTitleBarMouseDown = useCallback((e) => {
    if (win.maximized) return;
    if (e.target.closest('.title-bar-controls')) return;
    e.preventDefault();
    onFocus(win.id);
    dragState.current = { startX: e.clientX - win.x, startY: e.clientY - win.y };

    const onMouseMove = (e2) => {
      if (!dragState.current) return;
      const newX = Math.max(0, e2.clientX - dragState.current.startX);
      const newY = Math.max(0, e2.clientY - dragState.current.startY);
      onMove(win.id, newX, newY);
    };
    const onMouseUp = () => {
      dragState.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [win, onFocus, onMove]);

  useEffect(() => () => { dragState.current = null; }, []);

  if (win.minimized) return null;

  const style = win.maximized
    ? {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: 'calc(100vh - 40px)',
        zIndex: win.z,
      }
    : {
        position: 'absolute',
        top:    win.y,
        left:   win.x,
        width:  win.w,
        height: win.h,
        zIndex: win.z,
      };

  return (
    <div
      className="window"
      style={{ ...style, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      onMouseDown={() => onFocus(win.id)}
    >
      <div
        className="title-bar"
        style={{ cursor: win.maximized ? 'default' : 'move', flexShrink: 0 }}
        onMouseDown={onTitleBarMouseDown}
      >
        <div className="title-bar-text">{win.title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }} />
          <button aria-label="Maximize" onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }} />
          <button aria-label="Close"    onClick={(e) => { e.stopPropagation(); onClose(win.id);    }} />
        </div>
      </div>
      <div className="window-body" style={{ flex: 1, overflow: 'auto', margin: 0, padding: '8px' }}>
        {children}
      </div>
    </div>
  );
}
