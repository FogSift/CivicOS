import React from 'react';
import { Radar, KanbanSquare, Database, AppWindow, FileText, Monitor, Spade, Bomb, Paintbrush } from 'lucide-react';
import OsWindow from './OsWindow.jsx';
import Taskbar from './Taskbar.jsx';

const DESKTOP_ICONS = [
  { id: 'computer',    label: 'My Computer',   Icon: Monitor },
  { id: 'plaza',       label: 'The Plaza',      Icon: Radar },
  { id: 'builder',     label: 'The Builder',    Icon: KanbanSquare },
  { id: 'vault',       label: 'The Vault',      Icon: Database },
  { id: 'ops',         label: 'Ops Center',     Icon: AppWindow },
  { id: 'notepad',     label: 'Notepad',        Icon: FileText },
  { id: 'solitaire',   label: 'Solitaire',      Icon: Spade },
  { id: 'minesweeper', label: 'Minesweeper',    Icon: Bomb },
  { id: 'paint',       label: 'Paint',          Icon: Paintbrush },
];

function DesktopIcon({ id, label, Icon, onDoubleClick }) {
  return (
    <button
      onDoubleClick={() => onDoubleClick(id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 72,
        padding: '4px',
        background: 'transparent',
        border: '1px solid transparent',
        boxShadow: 'none',
        gap: 4,
        cursor: 'default',
        color: '#fff',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(49,106,197,0.5)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {/* Icon shell */}
      <div style={{
        width: 36, height: 36,
        background: 'linear-gradient(135deg, #b0c8f0 0%, #5080d0 100%)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '1px 2px 4px rgba(0,0,0,0.4)',
      }}>
        <Icon size={20} style={{ color: '#1a2a6a' }} />
      </div>
      <span style={{
        fontSize: 10,
        fontFamily: 'Tahoma, Arial, sans-serif',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        textAlign: 'center',
        lineHeight: 1.2,
        color: '#fff',
      }}>
        {label}
      </span>
    </button>
  );
}

export default function Desktop({
  windows,
  onOpenApp,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onFocusWindow,
  onMoveWindow,
  onRestoreWindow,
  onLogOff,
  renderApp,
  theme,
  setTheme,
  username,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        // XP "Bliss" gradient: green hills, blue sky
        background: 'linear-gradient(180deg, #3a8edc 0%, #5ab0f0 30%, #4aa8e8 45%, #6ac040 46%, #58b030 55%, #3a9020 70%, #2a7818 100%)',
        overflow: 'hidden',
        paddingBottom: 40,
      }}
    >
      {/* Desktop icons column on the left */}
      <div style={{
        position: 'absolute',
        top: 8,
        left: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        zIndex: 1,
      }}>
        {DESKTOP_ICONS.map(({ id, label, Icon }) => (
          <DesktopIcon
            key={id}
            id={id}
            label={label}
            Icon={Icon}
            onDoubleClick={onOpenApp}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map(win => (
        <OsWindow
          key={win.id}
          win={win}
          onClose={onCloseWindow}
          onMinimize={onMinimizeWindow}
          onMaximize={onMaximizeWindow}
          onFocus={onFocusWindow}
          onMove={onMoveWindow}
        >
          {renderApp(win)}
        </OsWindow>
      ))}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onRestoreWindow={onRestoreWindow}
        onFocusWindow={onFocusWindow}
        onOpenApp={onOpenApp}
        onLogOff={onLogOff}
        theme={theme}
        setTheme={setTheme}
        username={username}
      />
    </div>
  );
}
