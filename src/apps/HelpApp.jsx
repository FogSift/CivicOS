import React, { useState } from 'react';
import { BookOpen, Radar, KanbanSquare, Database, AppWindow, Monitor, Search, Settings } from 'lucide-react';

const TOPICS = [
  {
    id: 'overview',
    label: 'Welcome to CivicOS',
    Icon: Monitor,
    content: (
      <div>
        <p style={{ marginBottom: 8 }}>
          <strong>CivicOS</strong> is a civic grant management platform designed to help organizations
          discover funding, build consensus, and move leads through to submission.
        </p>
        <p style={{ marginBottom: 8 }}>
          The interface is modeled after Windows XP to make it feel immediately familiar — every feature
          is accessible through a window you can drag, resize, minimize, and close.
        </p>
        <p>Double-click any desktop icon or use the <strong>Start Menu</strong> to open an app.</p>
      </div>
    ),
  },
  {
    id: 'plaza',
    label: 'The Plaza',
    Icon: Radar,
    content: (
      <div>
        <p style={{ marginBottom: 8 }}>
          <strong>The Plaza</strong> is your discovery feed. It surfaces funding leads and lets your team
          vote on which ones are worth pursuing.
        </p>
        <ul style={{ paddingLeft: 16, lineHeight: 1.8 }}>
          <li>Vote a lead up or down using the ▲ ▼ buttons.</li>
          <li>Click <strong>Commit</strong> to move a lead into the active pipeline.</li>
          <li>Click <strong>Discard</strong> to remove a lead from the feed.</li>
          <li>Use <strong>Add a Lead</strong> to surface a new opportunity manually.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'builder',
    label: 'The Builder',
    Icon: KanbanSquare,
    content: (
      <div>
        <p style={{ marginBottom: 8 }}>
          <strong>The Builder</strong> is a Kanban board that tracks committed leads from intake to submission.
        </p>
        <ul style={{ paddingLeft: 16, lineHeight: 1.8 }}>
          <li>Columns represent stages: Intake → Drafting → Review → Submitted.</li>
          <li>Cards show the lead title, bounty amount, and deadline.</li>
          <li>Future: drag cards between columns to update status.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'vault',
    label: 'The Vault',
    Icon: Database,
    content: (
      <div>
        <p style={{ marginBottom: 8 }}>
          <strong>The Vault</strong> stores your organization's standard documents —
          master narratives, compliance records, and team bios.
        </p>
        <p>Double-click a folder to open that document category. File upload is on the roadmap.</p>
      </div>
    ),
  },
  {
    id: 'ops',
    label: 'Ops Center',
    Icon: AppWindow,
    content: (
      <div>
        <p style={{ marginBottom: 8 }}>
          <strong>Ops Center</strong> shows the CivicOS app registry — all registered apps, their
          manifest metadata, and health check status.
        </p>
        <p>Use this to diagnose which services are running and verify API endpoint health.</p>
      </div>
    ),
  },
  {
    id: 'windows',
    label: 'Working with Windows',
    Icon: Search,
    content: (
      <div>
        <ul style={{ paddingLeft: 16, lineHeight: 2 }}>
          <li><strong>Open:</strong> Double-click a desktop icon or use the Start Menu.</li>
          <li><strong>Move:</strong> Drag the title bar.</li>
          <li><strong>Minimize:</strong> Click the _ button in the title bar. Restore from the taskbar.</li>
          <li><strong>Maximize:</strong> Click the □ button to fill the screen.</li>
          <li><strong>Close:</strong> Click ✕ to close the window.</li>
          <li><strong>Focus:</strong> Click any window to bring it to the front.</li>
          <li><strong>Theme:</strong> Click the clock in the bottom-right to open the system tray panel.</li>
        </ul>
      </div>
    ),
  },
];

export default function HelpApp() {
  const [active, setActive] = useState('overview');
  const topic = TOPICS.find(t => t.id === active);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Tahoma, Arial, sans-serif' }}>
      {/* Contents panel */}
      <div style={{
        width: 200, flexShrink: 0,
        background: 'var(--color-sidebar-section)',
        borderRight: '1px solid var(--color-border-main)',
        overflowY: 'auto',
      }}>
        <div style={{
          padding: '6px 10px',
          fontSize: 11, fontWeight: 'bold',
          background: 'linear-gradient(180deg, var(--color-titlebar-from), var(--color-titlebar-to))',
          color: 'var(--color-titlebar-text)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <BookOpen size={12} />
          Contents
        </div>
        {TOPICS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              width: '100%', padding: '5px 10px', textAlign: 'left',
              background: active === id ? 'var(--color-accent-hover-bg)' : 'transparent',
              border: 'none', boxShadow: 'none',
              borderLeft: active === id ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
            }}
          >
            <Icon size={12} style={{ color: 'var(--color-accent-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-primary)' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: 'var(--color-panel-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border-main)' }}>
          {topic && <topic.Icon size={18} style={{ color: 'var(--color-accent-primary)' }} />}
          <span style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{topic?.label}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
          {topic?.content}
        </div>
      </div>
    </div>
  );
}
