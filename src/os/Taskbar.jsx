import React, { useState, useEffect } from 'react';
import { Monitor, Wifi, WifiOff, Volume2, VolumeX } from 'lucide-react';
import StartMenu from './StartMenu.jsx';
import SystemTrayPanel from './SystemTrayPanel.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';

function Clock({ onClick }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0 10px',
        fontSize: 11,
        color: '#fff',
        fontFamily: 'Tahoma, Arial, sans-serif',
        borderLeft: '1px solid rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', height: '100%',
        whiteSpace: 'nowrap',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        cursor: 'default',
      }}
    >
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </button>
  );
}

export default function Taskbar({ windows, onRestoreWindow, onFocusWindow, onOpenApp, onLogOff, theme, setTheme, username, settings, updateSettings }) {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [trayOpen,  setTrayOpen]  = useState(false);
  const online = useOnlineStatus();
  const muted = !settings?.uiSounds || settings?.volume === 0;

  const handleStartClick = (e) => {
    e.stopPropagation();
    setTrayOpen(false);
    setMenuOpen(v => !v);
  };

  const handleTrayClick = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    setTrayOpen(v => !v);
  };

  const handleOpenApp = (id) => {
    setMenuOpen(false);
    onOpenApp(id);
  };

  // Close both panels on desktop click
  useEffect(() => {
    const close = () => { setMenuOpen(false); setTrayOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: 40,
        background: 'linear-gradient(180deg, #2a5cce 0%, #1a3e9a 50%, #1232a0 51%, #0e2a8c 100%)',
        borderTop: '2px solid #6090e8',
        display: 'flex',
        alignItems: 'center',
        zIndex: 9000,
        padding: '0 4px',
        gap: 4,
        userSelect: 'none',
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      {/* Start menu overlay */}
      {menuOpen && (
        <StartMenu
          onOpenApp={handleOpenApp}
          onLogOff={onLogOff}
          username={username}
        />
      )}

      {/* Start button */}
      <button
        onClick={handleStartClick}
        style={{
          height: 32,
          padding: '0 12px 0 8px',
          background: menuOpen
            ? 'linear-gradient(180deg, #1a7a2a, #148020)'
            : 'linear-gradient(180deg, #3ea040, #1a8030)',
          border: '1px solid rgba(0,0,0,0.4)',
          borderRadius: '0 12px 12px 0',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'Tahoma, Arial, sans-serif',
          letterSpacing: '0.03em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: menuOpen
            ? 'inset 1px 1px 3px rgba(0,0,0,0.4)'
            : '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
          cursor: 'default',
          flexShrink: 0,
        }}
      >
        <Monitor size={16} />
        start
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />

      {/* Window buttons */}
      <div style={{ flex: 1, display: 'flex', gap: 2, overflow: 'hidden' }}>
        {windows.map(win => (
          <button
            key={win.id}
            onClick={() => {
              if (win.minimized) onRestoreWindow(win.id);
              else onFocusWindow(win.id);
            }}
            title={win.title}
            style={{
              height: 28,
              maxWidth: 160,
              padding: '0 8px',
              background: win.minimized
                ? 'linear-gradient(180deg, #6090e8, #3060c0)'
                : 'linear-gradient(180deg, #3060c0, #5080e0)',
              border: '1px solid rgba(0,0,40,0.4)',
              color: '#fff',
              fontSize: 11,
              fontFamily: 'Tahoma, Arial, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'default',
              boxShadow: win.minimized
                ? 'inset 1px 1px 2px rgba(0,0,0,0.3)'
                : '0 1px 2px rgba(0,0,0,0.3)',
              flexShrink: 0,
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{win.title}</span>
          </button>
        ))}
      </div>

      {/* System tray */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          background: trayOpen
            ? 'rgba(255,255,255,0.1)'
            : 'linear-gradient(180deg, #1232a0, #0e28a0)',
          borderLeft: '1px solid rgba(255,255,255,0.15)',
          paddingLeft: 6,
          gap: 4,
        }}
      >
        {/* Tray icons */}
        <button
          onClick={handleTrayClick}
          title={online ? 'Connected' : 'Offline'}
          style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0, display: 'flex', cursor: 'default' }}
        >
          {online
            ? <Wifi size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
            : <WifiOff size={12} style={{ color: 'rgba(255,120,120,0.85)' }} />}
        </button>
        <button
          onClick={handleTrayClick}
          title={muted ? 'Muted' : `Volume ${settings?.volume ?? 75}%`}
          style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0, display: 'flex', cursor: 'default' }}
        >
          {muted
            ? <VolumeX size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
            : <Volume2 size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />}
        </button>

        {/* Clickable clock */}
        <Clock onClick={handleTrayClick} />

        {/* Tray panel popup */}
        {trayOpen && (
          <SystemTrayPanel
            onClose={() => setTrayOpen(false)}
            theme={theme}
            setTheme={setTheme}
            windowCount={windows.filter(w => !w.minimized).length}
            onLogOff={onLogOff}
            settings={settings}
            updateSettings={updateSettings}
          />
        )}
      </div>
    </div>
  );
}
