/**
 * @fileId 4b569e05-f60b-4916-93a8-d3d5b1cbe186
 * @module CivicOS/src/components/ThemeSwitcher.jsx
 * @description XP-style dropdown to switch between Classic XP and Creme-XP themes
 */

import React, { useState, useEffect, useRef } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';

const THEME_LABELS = {
  classic: 'Classic XP',
  creme:   'Creme-XP',
};

export default function ThemeSwitcher({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center space-x-1 hover:bg-[var(--color-accent-hover-bg)] hover:border-[var(--color-accent-selected)] border border-transparent px-2 py-0.5 rounded btn-press text-black"
      >
        <Palette size={14} className="text-[var(--color-accent-primary)]" />
        <span>{theme === 'classic' ? 'XP' : 'Creme'}</span>
        <ChevronDown size={10} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-0.5 z-50 bg-[var(--color-window-bg)] border border-[var(--color-border-main)] shadow-[2px_2px_4px_rgba(0,0,0,0.3)] min-w-[120px] py-0.5">
          {Object.entries(THEME_LABELS).map(([id, label]) => (
            <button
              key={id}
              onClick={() => { setTheme(id); setOpen(false); }}
              className="w-full flex items-center space-x-2 px-3 py-1.5 text-left text-xs cursor-default hover:bg-[var(--color-accent-selected)] hover:text-white text-[var(--color-text-primary)]"
            >
              {theme === id
                ? <Check size={10} className="shrink-0" />
                : <span className="w-[10px] shrink-0" />
              }
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
