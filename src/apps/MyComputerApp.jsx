import React, { useState } from 'react';
import { Radar, KanbanSquare, Database, AppWindow, FileText, Monitor } from 'lucide-react';
import { useKernel } from '../kernel/CivicProvider.jsx';
import { release } from '../version.js';

const DRIVES = [
  { id: 'plaza',    label: 'The Plaza (C:)',      Icon: Radar,        sub: 'Civic Discovery Feed' },
  { id: 'builder',  label: 'The Builder (D:)',    Icon: KanbanSquare, sub: 'Grant Pipeline Board' },
  { id: 'vault',    label: 'The Vault (E:)',      Icon: Database,     sub: 'Document Storage' },
  { id: 'ops',      label: 'Ops Center (F:)',     Icon: AppWindow,    sub: 'System Registry' },
  { id: 'notepad',  label: 'Notepad.exe',         Icon: FileText,     sub: 'Text Editor' },
  { id: 'computer', label: 'My Computer',         Icon: Monitor,      sub: 'This Computer' },
];

function SidebarLink({ label, onClick, disabled }) {
  return (
    <div
      role={disabled ? undefined : 'button'}
      aria-disabled={disabled ? 'true' : undefined}
      onClick={disabled ? undefined : onClick}
      style={{
        padding: '2px 12px', fontSize: 11, cursor: 'default',
        color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-link)',
        textDecoration: disabled ? 'none' : 'underline',
      }}
    >
      {label}
    </div>
  );
}

export default function MyComputerApp({ onOpenApp }) {
  const { backend, eventCount } = useKernel();
  const [sysInfoOpen, setSysInfoOpen] = useState(false);

  const systemTasks = [
    { label: 'View system info', onClick: () => setSysInfoOpen(true) },
    { label: 'Add or remove programs', disabled: true },
    { label: 'Change a setting', onClick: () => onOpenApp?.('settings') },
  ];

  const otherPlaces = [
    { label: 'Network Places', onClick: () => onOpenApp?.('ops') },
    { label: 'My Documents', onClick: () => onOpenApp?.('vault') },
    { label: 'Shared Documents', disabled: true },
    { label: 'Control Panel', onClick: () => onOpenApp?.('settings') },
  ];

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
          {systemTasks.map((t) => <SidebarLink key={t.label} {...t} />)}
          <div style={{ margin: '8px 0 4px', borderTop: '1px solid var(--color-border-main)' }} />
          <div style={{ padding: '2px 8px 6px', fontSize: 10, fontWeight: 'bold', color: 'var(--color-titlebar-text)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Other Places
          </div>
          {otherPlaces.map((t) => <SidebarLink key={t.label} {...t} />)}
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

      {sysInfoOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="window" style={{ width: 360 }}>
            <div className="title-bar">
              <div className="title-bar-text">System Properties</div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={() => setSysInfoOpen(false)} />
              </div>
            </div>
            <div className="window-body" style={{ padding: 16, fontSize: 11 }}>
              <p style={{ marginBottom: 6 }}>
                <strong>CivicOS {release.tag}</strong> — {release.channel} ({release.label})
              </p>
              <p style={{ marginBottom: 6 }}>
                <strong>Storage backend:</strong> {backend}
              </p>
              <p style={{ marginBottom: 6 }}>
                <strong>Events logged:</strong> {eventCount}
              </p>
              <p style={{ marginBottom: 12, wordBreak: 'break-word', color: 'var(--color-text-muted)', fontSize: 10 }}>
                <strong>Browser:</strong> {navigator.userAgent}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSysInfoOpen(false)}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
