import React from 'react';
import { Radar, KanbanSquare, Database, AppWindow, FileText, Monitor } from 'lucide-react';

const DRIVES = [
  { id: 'plaza',    label: 'The Plaza (C:)',      Icon: Radar,        sub: 'Civic Discovery Feed' },
  { id: 'builder',  label: 'The Builder (D:)',    Icon: KanbanSquare, sub: 'Grant Pipeline Board' },
  { id: 'vault',    label: 'The Vault (E:)',      Icon: Database,     sub: 'Document Storage' },
  { id: 'ops',      label: 'Ops Center (F:)',     Icon: AppWindow,    sub: 'System Registry' },
  { id: 'notepad',  label: 'Notepad.exe',         Icon: FileText,     sub: 'Text Editor' },
  { id: 'computer', label: 'My Computer',         Icon: Monitor,      sub: 'This Computer' },
];

export default function MyComputerApp({ onOpenApp }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* XP sidebar + content layout */}
      <div style={{ display: 'flex', height: '100%', gap: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 160,
          flexShrink: 0,
          background: 'linear-gradient(180deg, var(--color-sidebar-from), var(--color-sidebar-to))',
          borderRight: '1px solid var(--color-border-main)',
          padding: '8px 0',
        }}>
          <div style={{ padding: '2px 8px 6px', fontSize: 10, fontWeight: 'bold', color: 'var(--color-titlebar-text)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            System Tasks
          </div>
          {['View system info', 'Add or remove programs', 'Change a setting'].map(t => (
            <div key={t} style={{ padding: '2px 12px', fontSize: 11, color: 'var(--color-text-link)', cursor: 'pointer', textDecoration: 'underline' }}>{t}</div>
          ))}
          <div style={{ margin: '8px 0 4px', borderTop: '1px solid var(--color-border-main)' }} />
          <div style={{ padding: '2px 8px 6px', fontSize: 10, fontWeight: 'bold', color: 'var(--color-titlebar-text)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Other Places
          </div>
          {['Network Places', 'My Documents', 'Shared Documents', 'Control Panel'].map(t => (
            <div key={t} style={{ padding: '2px 12px', fontSize: 11, color: 'var(--color-text-link)', cursor: 'pointer', textDecoration: 'underline' }}>{t}</div>
          ))}
        </div>

        {/* Drive icons */}
        <div style={{ flex: 1, padding: 12, background: 'var(--color-panel-bg)' }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: 8, borderBottom: '1px solid var(--color-border-main)', paddingBottom: 4 }}>
            Hard Disk Drives
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DRIVES.map(({ id, label, Icon, sub }) => (
              <button
                key={id}
                onDoubleClick={() => onOpenApp?.(id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 90,
                  padding: '6px 4px',
                  background: 'transparent',
                  border: '1px solid transparent',
                  boxShadow: 'none',
                  cursor: 'default',
                  gap: 4,
                  textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                {/* Drive icon */}
                <div style={{
                  width: 40, height: 32,
                  background: 'linear-gradient(180deg, #b8d0f0 0%, #6090d0 100%)',
                  border: '1px solid #5080c0',
                  borderRadius: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <Icon size={18} style={{ color: '#1a3a8a' }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{label}</span>
                <span style={{ fontSize: 9, color: 'var(--color-text-muted)', lineHeight: 1.2 }}>{sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
