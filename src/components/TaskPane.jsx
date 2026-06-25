/**
 * @fileId cd9afea1-9479-44aa-aa89-46cacc97f332
 * @module CivicOS/components/TaskPane
 * @description Left sidebar — navigation and status panel.
 *              Named after the Windows XP "Task Pane" pattern.
 */

import React from 'react';
import { Radar, KanbanSquare, Database, AppWindow } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'plaza',   label: 'The Plaza',   Icon: Radar },
  { id: 'builder', label: 'The Builder', Icon: KanbanSquare },
  { id: 'vault',   label: 'The Vault',   Icon: Database },
  { id: 'ops',     label: 'Ops Center',  Icon: AppWindow },
];

export default function TaskPane({ activeTab, onTabChange, discoveryCount }) {
  return (
    <div
      className="w-56 border-r p-3 flex flex-col overflow-y-auto overflow-x-hidden shrink-0"
      style={{ background: 'linear-gradient(180deg, var(--color-sidebar-from) 0%, var(--color-sidebar-to) 100%)', borderColor: 'var(--color-border-main)' }}
    >
      {/* Navigation */}
      <div className="mb-4 rounded-sm overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-border-inner)', background: 'var(--color-panel-bg)' }}>
        <div className="px-3 py-1.5 cursor-default" style={{ background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)' }}>
          <span className="font-bold text-xs tracking-wide" style={{ color: 'var(--color-text-link)' }}>System Tasks</span>
        </div>
        <ul className="p-2 space-y-1 text-xs" style={{ background: 'var(--color-sidebar-section)' }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                onClick={() => onTabChange(id)}
                className="w-full flex items-center text-left px-2 py-1.5 hover:underline"
                style={{ color: activeTab === id ? 'var(--color-text-primary)' : 'var(--color-text-link)', fontWeight: activeTab === id ? '700' : '400' }}
              >
                <Icon size={14} className="mr-2" style={{ color: activeTab === id ? 'var(--color-text-primary)' : 'var(--color-accent-primary)' }} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Details */}
      <div className="mb-4 rounded-sm overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-border-inner)', background: 'var(--color-panel-bg)' }}>
        <div className="px-3 py-1.5 cursor-default" style={{ background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)' }}>
          <span className="font-bold text-xs tracking-wide" style={{ color: 'var(--color-text-link)' }}>Details</span>
        </div>
        <div className="p-3 text-xs space-y-2" style={{ background: 'var(--color-sidebar-section)', color: 'var(--color-text-primary)' }}>
          <p className="font-bold">Active Signals</p>
          <p>{discoveryCount} node{discoveryCount !== 1 ? 's' : ''} await consensus.</p>
          <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--color-border-main)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>System operates strictly as is.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
