/**
 * @fileId 273aecc3-96fd-4c06-9464-6be40d6ab7b8
 * @module CivicOS/components/KanbanColumn
 * @description Single column in The Builder kanban board.
 */

import React from 'react';

export default function KanbanColumn({ column, resources }) {
  const cards = resources.filter(r => r.status === column.id);

  return (
    <div
      className="w-72 flex-shrink-0 flex flex-col max-h-full shadow-sm overflow-hidden"
      style={{ background: 'var(--color-window-bg)', border: '1px solid var(--color-border-main)' }}
    >
      {/* Column header uses title-bar style via CSS vars */}
      <div
        className="px-2 py-1.5 flex justify-between items-center"
        style={{
          background: 'linear-gradient(180deg, var(--color-titlebar-from) 0%, var(--color-titlebar-via) 50%, var(--color-titlebar-to) 100%)',
          borderBottom: '1px solid var(--color-border-main)',
          color: 'var(--color-titlebar-text)',
        }}
      >
        <span className="text-xs font-bold drop-shadow-sm">{column.label}</span>
        <span
          className="text-xs font-bold px-1.5"
          style={{ background: 'var(--color-panel-bg)', color: 'var(--color-accent-primary)', borderRadius: '2px' }}
        >
          {cards.length}
        </span>
      </div>

      <div
        className="flex-1 p-2 overflow-y-auto space-y-2 m-1 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
        style={{ background: 'var(--color-panel-bg)', border: '1px solid var(--color-border-main)' }}
      >
        {cards.map(resource => (
          <div
            key={resource.id}
            className="p-2 cursor-pointer shadow-sm"
            style={{
              background: 'linear-gradient(180deg, var(--color-btn-from), var(--color-btn-to))',
              border: '1px solid var(--color-border-main)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-main)'; }}
          >
            <span className="font-bold text-sm leading-tight hover:underline block mb-2" style={{ color: 'var(--color-text-link)' }}>
              {resource.title}
            </span>
            <div className="flex items-center justify-between text-xs pt-1" style={{ borderTop: '1px solid var(--color-border-main)', color: 'var(--color-text-primary)' }}>
              <span className="font-bold" style={{ color: 'var(--color-success)' }}>{resource.bounty}</span>
              <span>{resource.deadline}</span>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="text-center p-4 text-xs italic" style={{ color: 'var(--color-border-main)' }}>Empty folder</div>
        )}
      </div>
    </div>
  );
}
