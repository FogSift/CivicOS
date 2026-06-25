import React, { useEffect } from 'react';
import { Wifi, Volume2, Sun, Moon, Monitor } from 'lucide-react';

export default function SystemTrayPanel({ onClose, theme, setTheme, windowCount, onLogOff }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#system-tray-panel')) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const row = (icon, label, value, control) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '5px 10px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ color: '#90b8f0', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: '#aac8f8', lineHeight: 1 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#fff', marginTop: 1 }}>{value}</div>
      </div>
      {control}
    </div>
  );

  return (
    <div
      id="system-tray-panel"
      style={{
        position: 'absolute',
        bottom: 44,
        right: 0,
        width: 240,
        background: 'linear-gradient(180deg, #1a3a8a 0%, #0e2470 100%)',
        border: '1px solid #4a7adc',
        borderBottom: 'none',
        boxShadow: '-4px -4px 12px rgba(0,0,0,0.5)',
        zIndex: 9999,
        fontFamily: 'Tahoma, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #2a5cce, #1a3e9a)',
        padding: '8px 10px',
        borderBottom: '1px solid #4a7adc',
      }}>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{timeStr}</div>
        <div style={{ color: '#90b8f0', fontSize: 10, marginTop: 2 }}>{dateStr}</div>
      </div>

      {/* Status rows */}
      {row(<Wifi size={14} />, 'Network', 'Connected', (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50', boxShadow: '0 0 4px #4caf50' }} />
      ))}
      {row(<Volume2 size={14} />, 'Volume', '75%', (
        <input
          type="range" min={0} max={100} defaultValue={75}
          style={{ width: 60, accentColor: '#5090e8' }}
          onClick={e => e.stopPropagation()}
        />
      ))}
      {row(<Monitor size={14} />, 'Open Windows', `${windowCount} running`, null)}

      {/* Theme switcher */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 10, color: '#aac8f8', marginBottom: 5 }}>Display Theme</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setTheme('classic')}
            style={{
              flex: 1, padding: '4px 0', fontSize: 10,
              background: theme === 'classic' ? '#316ac5' : 'rgba(255,255,255,0.1)',
              border: theme === 'classic' ? '1px solid #6090e8' : '1px solid rgba(255,255,255,0.2)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            <Sun size={10} /> Classic XP
          </button>
          <button
            onClick={() => setTheme('creme')}
            style={{
              flex: 1, padding: '4px 0', fontSize: 10,
              background: theme === 'creme' ? '#316ac5' : 'rgba(255,255,255,0.1)',
              border: theme === 'creme' ? '1px solid #6090e8' : '1px solid rgba(255,255,255,0.2)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            <Moon size={10} /> Crème XP
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '6px 10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onLogOff}
          style={{
            fontSize: 10, padding: '3px 10px',
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
          }}
        >
          Log Off
        </button>
      </div>
    </div>
  );
}
