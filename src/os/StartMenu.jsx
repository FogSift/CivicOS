import React from 'react';
import { Radar, KanbanSquare, Database, AppWindow, FileText, Monitor, LogOut, Settings, HelpCircle, Search, ScrollText, Spade, Bomb, Paintbrush } from 'lucide-react';

const PINNED_APPS = [
  { id: 'plaza',       label: 'The Plaza',    sub: 'Civic Discovery',  Icon: Radar },
  { id: 'builder',     label: 'The Builder',  sub: 'Grant Pipeline',   Icon: KanbanSquare },
  { id: 'vault',       label: 'The Vault',    sub: 'Documents',        Icon: Database },
  { id: 'ops',         label: 'Ops Center',   sub: 'System Registry',  Icon: AppWindow },
  { id: 'notepad',     label: 'Notepad',      sub: 'Text Editor',      Icon: FileText },
  { id: 'solitaire',   label: 'Solitaire',    sub: 'Card Game',        Icon: Spade },
  { id: 'minesweeper', label: 'Minesweeper',  sub: 'Puzzle Game',      Icon: Bomb },
  { id: 'paint',       label: 'Paint',        sub: 'Image Editor',     Icon: Paintbrush },
];

const SYSTEM_ITEMS = [
  { id: 'computer', label: 'My Computer',      Icon: Monitor },
  { id: 'search',   label: 'Search',           Icon: Search },
  { id: 'settings', label: 'Control Panel',    Icon: Settings },
  { id: 'events',   label: 'Event Viewer',     Icon: ScrollText },
  { id: 'help',     label: 'Help and Support', Icon: HelpCircle },
];

export default function StartMenu({ onOpenApp, onLogOff, username = 'Civic User' }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        width: 380,
        background: '#fff',
        border: '2px solid #0a246a',
        borderBottom: 'none',
        boxShadow: '4px 0 8px rgba(0,0,0,0.4), 0 -4px 8px rgba(0,0,0,0.2)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Tahoma, Arial, sans-serif',
      }}
    >
      {/* Header: user tile */}
      <div style={{
        background: 'linear-gradient(180deg, #2a5cce 0%, #1a3e9a 100%)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 2,
          background: 'linear-gradient(135deg, #7cb8f0, #2060c0)',
          border: '2px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: '#fff', fontWeight: 'bold',
        }}>
          {username[0].toUpperCase()}
        </div>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{username}</span>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left: pinned apps */}
        <div style={{ flex: 1, borderRight: '1px solid #d0d8f0', padding: '4px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 'bold', color: '#7a7a7a', padding: '2px 8px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Applications
          </div>
          {PINNED_APPS.map(({ id, label, sub, Icon }) => (
            <button
              key={id}
              onClick={() => onOpenApp(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '5px 8px',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                gap: 8,
                textAlign: 'left',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#316ac5'; e.currentTarget.querySelectorAll('span').forEach(s => s.style.color = '#fff'); }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelectorAll('span').forEach(s => s.style.color = ''); }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 2, flexShrink: 0,
                background: 'linear-gradient(135deg, #f0f4ff, #c0d0f0)',
                border: '1px solid #8090c0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} style={{ color: '#1a3a8a' }} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 12, fontWeight: 'bold', color: '#000', lineHeight: 1.2 }}>{label}</span>
                <span style={{ display: 'block', fontSize: 10, color: '#666', lineHeight: 1.2 }}>{sub}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: system items */}
        <div style={{ width: 160, background: '#dce4f5', padding: '4px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 'bold', color: '#4a5a8a', padding: '2px 8px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            System
          </div>
          {SYSTEM_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onOpenApp(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '4px 8px',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                gap: 6,
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#316ac5'; e.currentTarget.querySelector('span').style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('span').style.color = ''; }}
            >
              <Icon size={14} style={{ color: '#1a3a8a', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#000' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer: Log Off */}
      <div style={{
        background: 'linear-gradient(180deg, #2a5cce 0%, #1a3e9a 100%)',
        padding: '6px 10px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 6,
      }}>
        <button
          onClick={onLogOff}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'linear-gradient(180deg, #3a70e0, #1a50b8)',
            border: '1px solid #0a246a',
            color: '#fff',
            fontSize: 11,
            padding: '3px 10px',
            cursor: 'default',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <LogOut size={12} />
          Log Off
        </button>
      </div>
    </div>
  );
}
