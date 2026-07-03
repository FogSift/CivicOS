/**
 * @fileId 8cae7f02-0020-4d33-a1c7-fd55bab3d2e2
 * @module CivicOS/src/apps/EventViewerApp.jsx
 * @description Event Viewer — browse, filter, and export the civic ledger.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ScrollText, Download } from 'lucide-react';
import { useKernel } from '../kernel/CivicProvider.jsx';
import { EVENT_TYPES } from '../kernel/events.js';

const summarize = (payload) => {
  const text = JSON.stringify(payload);
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
};

function exportEvents(events) {
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `civicos-events-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function EventViewerApp() {
  const { getEvents, eventCount, backend } = useKernel();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    getEvents().then((list) => {
      if (!cancelled) setEvents(list.reverse());
    });
    return () => { cancelled = true; };
  }, [getEvents, eventCount]);

  const visible = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.type === filter)),
    [events, filter]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: 11 }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px',
        borderBottom: '1px solid var(--color-border-main)',
        background: 'var(--color-panel-bg)',
      }}>
        <ScrollText size={14} style={{ color: 'var(--color-accent-primary)', flexShrink: 0 }} />
        <label htmlFor="event-filter" style={{ color: 'var(--color-text-primary)' }}>Show:</label>
        <select id="event-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All events</option>
          {Object.keys(EVENT_TYPES).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button onClick={() => exportEvents(visible)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Download size={11} />
          Export
        </button>
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
          {visible.length} event{visible.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Ledger table */}
      <div style={{
        flex: 1, overflow: 'auto',
        background: 'var(--color-sidebar-section)',
        border: '1px solid var(--color-border-inner)',
        margin: 6,
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ position: 'sticky', top: 0, background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)' }}>
              {['Type', 'Date/Time', 'Event', 'Details'].map((col) => (
                <th key={col} style={{
                  textAlign: 'left', padding: '3px 8px',
                  borderBottom: '1px solid var(--color-border-main)',
                  color: 'var(--color-text-link)', fontWeight: 700,
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No events{filter !== 'all' ? ' of this type' : ''} recorded yet.
                </td>
              </tr>
            )}
            {visible.map((event) => {
              const meta = EVENT_TYPES[event.type] ?? { label: 'Unknown', color: '#999' };
              return (
                <tr key={event.id} style={{ borderBottom: '1px solid var(--color-border-inner)' }}>
                  <td style={{ padding: '3px 8px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                      background: meta.color, marginRight: 5, verticalAlign: 'middle',
                    }} />
                    <span style={{ color: 'var(--color-text-primary)' }}>{meta.label}</span>
                  </td>
                  <td style={{ padding: '3px 8px', whiteSpace: 'nowrap', color: 'var(--color-text-primary)' }}>
                    {new Date(event.ts).toLocaleString()}
                  </td>
                  <td style={{ padding: '3px 8px', fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>
                    {event.type}
                  </td>
                  <td
                    style={{ padding: '3px 8px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}
                    title={JSON.stringify(event.payload, null, 2)}
                  >
                    {summarize(event.payload)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div style={{
        padding: '3px 8px',
        borderTop: '1px solid var(--color-border-main)',
        background: 'var(--color-panel-bg)',
        color: 'var(--color-text-muted)',
      }}>
        Backend: {backend === 'indexeddb' ? 'IndexedDB (persistent)' : 'memory (this session only)'}
      </div>
    </div>
  );
}
