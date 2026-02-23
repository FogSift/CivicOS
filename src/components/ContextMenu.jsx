/**
 * @fileId b6b6b598-b163-4239-ae98-9e9d4fd2f75c
 * @module CivicOS/src/components/ContextMenu.jsx
 * @description Viewport-safe right-click context menu rendered via createPortal
 */

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ContextMenu({ x: initialX, y: initialY, onClose, items }) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ x: initialX, y: initialY });

  // Adjust position after first paint to avoid viewport overflow
  useLayoutEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    let x = initialX;
    let y = initialY;
    if (x + rect.width  > window.innerWidth  - 8) x = window.innerWidth  - rect.width  - 8;
    if (y + rect.height > window.innerHeight - 8) y = window.innerHeight - rect.height - 8;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    setPos({ x, y });
  }, [initialX, initialY]);

  // Close on outside click or Escape
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: 'fixed', left: pos.x, top: pos.y }}
      className="z-[9999] bg-[var(--color-window-bg)] border border-[var(--color-border-main)] shadow-[2px_2px_4px_rgba(0,0,0,0.35)] min-w-[148px] py-0.5"
    >
      {items.map((item, i) =>
        item.separator ? (
          <div key={i} className="border-t border-[var(--color-border-main)] my-0.5" />
        ) : (
          <button
            key={i}
            onClick={() => { item.onClick(); onClose(); }}
            className={`w-full flex items-center space-x-2 px-4 py-1.5 text-xs text-left cursor-default hover:bg-[var(--color-accent-selected)] hover:text-white ${item.danger ? 'text-[var(--color-error-from)]' : 'text-[var(--color-text-primary)]'}`}
          >
            {item.icon && <span className="w-3 h-3 flex items-center justify-center">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        )
      )}
    </div>,
    document.body
  );
}
