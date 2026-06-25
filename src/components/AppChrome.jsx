/**
 * @fileId 58b87fd2-4d7d-486c-9250-ba5b063bb062
 * @module CivicOS/components/AppChrome
 * @description Window chrome — title bar, toolbar, and address bar.
 */

import React from 'react';
import { Database, Plus, User } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher.jsx';

const TAB_LABELS = {
  plaza:   'The Plaza',
  builder: 'The Builder',
  vault:   'The Vault',
  ops:     'Ops Center',
};

export default function AppChrome({ activeTab, onLogOff, onAddLead, onToggleGuide, theme, setTheme }) {
  return (
    <>
      {/* Title Bar — XP.css .title-bar + our CSS-variable override in index.css */}
      <div className="title-bar shrink-0 select-none">
        <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} style={{ opacity: 0.85 }} />
          CivicOS &mdash; {TAB_LABELS[activeTab] ?? activeTab}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" onClick={onLogOff} title="Log Off" />
        </div>
      </div>

      {/* Menu bar */}
      <div
        className="border-b px-2 py-1 flex items-center justify-between shrink-0 text-xs"
        style={{ background: 'var(--color-window-bg)', borderColor: 'var(--color-border-main)', color: 'var(--color-text-primary)' }}
      >
        <div className="flex items-center space-x-1">
          {['File', 'Edit', 'View'].map(item => (
            <button
              key={item}
              className="px-2 py-0.5 border border-transparent cursor-default"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              {item}
            </button>
          ))}
          <button
            onClick={onToggleGuide}
            className="px-2 py-0.5 border border-transparent cursor-default"
            style={{ color: 'var(--color-text-primary)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            Help
          </button>
        </div>

        <div className="flex items-center space-x-2" style={{ color: 'var(--color-text-primary)' }}>
          <button
            onClick={onAddLead}
            className="flex items-center space-x-1 border border-transparent px-2 py-0.5"
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            <Plus size={13} style={{ color: 'var(--color-success)' }} />
            <span>Add Lead</span>
          </button>
          <div className="w-px h-4" style={{ background: 'var(--color-border-main)' }} />
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <div className="w-px h-4" style={{ background: 'var(--color-border-main)' }} />
          <div className="flex items-center space-x-1 cursor-default">
            <User size={13} style={{ color: 'var(--color-accent-primary)' }} />
            <span>demo@civic-os</span>
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <div
        className="border-b px-2 py-1 flex items-center space-x-2 shrink-0 text-xs"
        style={{ background: 'var(--color-window-bg)', borderColor: 'var(--color-border-main)' }}
      >
        <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Address</span>
        <div
          className="flex-1 px-2 py-0.5 flex items-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]"
          style={{ background: 'var(--color-panel-bg)', border: '1px solid var(--color-input-border)', color: 'var(--color-text-primary)' }}
        >
          <Database size={12} style={{ color: 'var(--color-accent-primary)', marginRight: '6px', flexShrink: 0 }} />
          <span>My Computer \ CivicOS \ {TAB_LABELS[activeTab] ?? activeTab}</span>
        </div>
      </div>
    </>
  );
}
