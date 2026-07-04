/**
 * @fileId a1e1c6ca-01a1-4e0c-ab04-15611239ca26
 * @module CivicOS/apps/NotepadApp
 * @description Real File/Edit/Format/View/Help menus via the vendored os-gui
 *              MenuBar.js library (public/vendor/os-gui/), instead of a fake
 *              decorative menu bar. Persists to the kernel; live Ln/Col.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useKernel } from '../kernel/CivicProvider.jsx';

const MENU_BAR_CSS = '/vendor/os-gui/menu-bar.css';
const MENU_BAR_JS = '/vendor/os-gui/MenuBar.js';

let cssInjected = false;
function ensureMenuBarCss() {
  if (cssInjected) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = MENU_BAR_CSS;
  document.head.appendChild(link);
  cssInjected = true;
}

let scriptPromise = null;
function loadMenuBarScript() {
  if (window.MenuBar) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = MENU_BAR_JS;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load MenuBar.js'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export default function NotepadApp({ onClose }) {
  const { snapshots, saveSnapshot, logEvent } = useKernel();
  const saved = snapshots.notepad;

  const [text, setText] = useState(saved?.text ?? '');
  const [wordWrap, setWordWrap] = useState(saved?.wordWrap ?? true);
  const [statusBar, setStatusBar] = useState(saved?.statusBar ?? true);
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });
  const [aboutOpen, setAboutOpen] = useState(false);

  const textareaRef = useRef(null);
  const menuContainerRef = useRef(null);
  const menuBarRef = useRef(null);
  const textRef = useRef(text);
  const wordWrapRef = useRef(wordWrap);
  const statusBarRef = useRef(statusBar);

  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { wordWrapRef.current = wordWrap; }, [wordWrap]);
  useEffect(() => { statusBarRef.current = statusBar; }, [statusBar]);

  // Persist to the kernel (debounced — mirrors useWindowManager's window-layout save).
  useEffect(() => {
    const timer = setTimeout(() => {
      saveSnapshot('notepad', { text, wordWrap, statusBar });
    }, 400);
    return () => clearTimeout(timer);
  }, [text, wordWrap, statusBar, saveSnapshot]);

  const updateCursor = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const before = el.value.slice(0, el.selectionStart).split('\n');
    setCursor({ ln: before.length, col: before[before.length - 1].length + 1 });
  }, []);

  const handleNew = useCallback(() => {
    if (textRef.current && !window.confirm('The text in Untitled has changed.\n\nDiscard changes?')) return;
    setText('');
    logEvent('notepad.new', {});
  }, [logEvent]);

  const handleSave = useCallback(() => {
    const blob = new Blob([textRef.current], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Untitled.txt';
    link.click();
    URL.revokeObjectURL(url);
    logEvent('notepad.save', {});
  }, [logEvent]);

  const handleExit = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleSelectAll = useCallback(() => {
    textareaRef.current?.select();
    textareaRef.current?.focus();
  }, []);

  const handleCopy = useCallback(async () => {
    const el = textareaRef.current;
    if (!el) return;
    const selection = el.value.slice(el.selectionStart, el.selectionEnd);
    try { await navigator.clipboard.writeText(selection || el.value); } catch { /* clipboard unavailable */ }
  }, []);

  const hasSelection = useCallback(() => {
    const el = textareaRef.current;
    return !!el && el.selectionStart !== el.selectionEnd;
  }, []);

  const handleCut = useCallback(async () => {
    const el = textareaRef.current;
    if (!el || el.selectionStart === el.selectionEnd) return;
    const { selectionStart: start, selectionEnd: end } = el;
    try { await navigator.clipboard.writeText(el.value.slice(start, end)); } catch { /* clipboard unavailable */ }
    setText(el.value.slice(0, start) + el.value.slice(end));
  }, []);

  const canPaste = useCallback(() => !!navigator.clipboard?.readText, []);

  const handlePaste = useCallback(async () => {
    const el = textareaRef.current;
    if (!el || !navigator.clipboard?.readText) return;
    try {
      const clip = await navigator.clipboard.readText();
      const { selectionStart: start, selectionEnd: end } = el;
      setText(el.value.slice(0, start) + clip + el.value.slice(end));
    } catch { /* clipboard unavailable or permission denied */ }
  }, []);

  const toggleWordWrap = useCallback(() => setWordWrap((w) => !w), []);
  const toggleStatusBar = useCallback(() => setStatusBar((s) => !s), []);

  // Build the real menu bar once, via the vendored os-gui MenuBar.js
  // (public/vendor/os-gui/ -- see THIRD_PARTY_LICENSES.md). Checkbox items
  // read live state through refs since the library calls check()/enabled()
  // fresh each time a menu opens, rather than rebuilding the menu tree.
  useEffect(() => {
    let cancelled = false;
    ensureMenuBarCss();
    loadMenuBarScript().then(() => {
      if (cancelled || !menuContainerRef.current || menuBarRef.current) return;

      const menus = {
        '&File': [
          { label: '&New', action: handleNew, description: 'Creates a new document.' },
          { label: '&Save', action: handleSave, description: 'Saves the active document.' },
          window.MENU_DIVIDER,
          { label: 'E&xit', action: handleExit, description: 'Closes Notepad.' },
        ],
        '&Edit': [
          { label: '&Select All', action: handleSelectAll, description: 'Selects all text.' },
          { label: '&Copy', action: handleCopy, description: 'Copies the selection to the clipboard.' },
          { label: 'Cu&t', action: handleCut, enabled: hasSelection, description: 'Cuts the selection to the clipboard.' },
          { label: '&Paste', action: handlePaste, enabled: canPaste, description: 'Inserts the clipboard contents.' },
        ],
        '&Format': [
          {
            label: '&Word Wrap',
            checkbox: { toggle: toggleWordWrap, check: () => wordWrapRef.current },
            description: 'Wraps text to fit the window.',
          },
        ],
        '&View': [
          {
            label: '&Status Bar',
            checkbox: { toggle: toggleStatusBar, check: () => statusBarRef.current },
            description: 'Shows or hides the status bar.',
          },
        ],
        '&Help': [
          { label: '&About Notepad', action: () => setAboutOpen(true), description: 'Displays program information.' },
        ],
      };

      // MenuBar.js exposes no destroy/cleanup for the window-level listeners
      // it attaches (focus/resize/keydown/click-outside). Since only one
      // Notepad window can exist at a time (see useWindowManager), this is a
      // small, bounded, documented cost per open/close cycle -- not a
      // per-frame or unbounded leak.
      const bar = window.MenuBar(menus);
      menuBarRef.current = bar;
      menuContainerRef.current.appendChild(bar.element);
    }).catch((error) => {
      console.error('Notepad: failed to load menu bar', error);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={menuContainerRef} style={{ flexShrink: 0 }} />

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={updateCursor}
        onKeyUp={updateCursor}
        onSelect={updateCursor}
        spellCheck={false}
        wrap={wordWrap ? 'soft' : 'off'}
        style={{
          flex: 1,
          resize: 'none',
          border: '1px solid var(--color-border-main)',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13,
          padding: 4,
          outline: 'none',
          background: '#fff',
          color: '#000',
          lineHeight: 1.5,
          overflowX: wordWrap ? 'hidden' : 'auto',
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
        }}
        placeholder="Type here..."
      />

      {statusBar && (
        <div style={{ borderTop: '1px solid var(--color-border-main)', fontSize: 10, padding: '2px 4px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Ln {cursor.ln}, Col {cursor.col}</span>
          <span>{text.length} characters</span>
        </div>
      )}

      {aboutOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="window" style={{ width: 320 }}>
            <div className="title-bar">
              <div className="title-bar-text">About Notepad</div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={() => setAboutOpen(false)} />
              </div>
            </div>
            <div className="window-body" style={{ padding: 16, textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', marginBottom: 4 }}>CivicOS Notepad</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
                Version {__APP_VERSION__}
              </p>
              <button onClick={() => setAboutOpen(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
