import React, { useState, useMemo } from 'react';
import { Search, FileText, Radar, KanbanSquare, Database, AppWindow } from 'lucide-react';

const ALL_ITEMS = [
  { id: 'plaza',   label: 'The Plaza',    desc: 'Civic discovery feed — surface leads, build consensus.',    Icon: Radar,        appId: 'plaza'   },
  { id: 'builder', label: 'The Builder',  desc: 'Kanban board for tracking leads through the pipeline.',     Icon: KanbanSquare, appId: 'builder' },
  { id: 'vault',   label: 'The Vault',    desc: 'Org document storage — narratives, compliance, bios.',      Icon: Database,     appId: 'vault'   },
  { id: 'ops',     label: 'Ops Center',   desc: 'CivicOS app registry and namespace health dashboard.',      Icon: AppWindow,    appId: 'ops'     },
  { id: 'notepad', label: 'Notepad',      desc: 'Plain text editor.',                                        Icon: FileText,     appId: 'notepad' },
];

export default function SearchApp({ onOpenApp }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_ITEMS.filter(
      item => item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Tahoma, Arial, sans-serif' }}>
      {/* Left panel */}
      <div style={{
        width: 160, flexShrink: 0,
        background: 'linear-gradient(180deg, var(--color-sidebar-from), var(--color-sidebar-to))',
        borderRight: '1px solid var(--color-border-main)',
        padding: 12,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        {/* XP search dog mascot stand-in */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #f0d080, #c09030)',
          border: '2px solid #a07020',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          🔍
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-primary)', textAlign: 'center', lineHeight: 1.4 }}>
          What do you want to search for?
        </div>
        <div style={{ width: '100%', borderTop: '1px solid var(--color-border-main)', paddingTop: 8 }}>
          {['Applications', 'Documents', 'Settings'].map(cat => (
            <div key={cat} style={{
              fontSize: 11, color: 'var(--color-text-link)',
              textDecoration: 'underline', cursor: 'default',
              padding: '2px 0',
            }}>{cat}</div>
          ))}
        </div>
      </div>

      {/* Right: search area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-panel-bg)' }}>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-main)' }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Search for:</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="field-row" style={{ flex: 1, margin: 0 }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type to search..."
                autoFocus
                style={{ flex: 1, width: '100%' }}
              />
            </div>
            <button style={{ padding: '2px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Search size={12} />
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {query === '' && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12 }}>
              Enter a search term to find apps and features.
            </div>
          )}
          {query !== '' && results.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12 }}>
              No results for "{query}".
            </div>
          )}
          {results.map(({ id, label, desc, Icon, appId }) => (
            <button
              key={id}
              onDoubleClick={() => onOpenApp?.(appId)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '6px 8px', textAlign: 'left',
                background: 'transparent', border: '1px solid transparent', boxShadow: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                background: 'linear-gradient(135deg, #e0ecff, #a0c0f0)',
                border: '1px solid #8090c0', borderRadius: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} style={{ color: '#1a3a8a' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{label}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{desc}</div>
              </div>
            </button>
          ))}
          {results.length > 0 && (
            <div style={{ padding: '6px 8px', fontSize: 10, color: 'var(--color-text-muted)' }}>
              Double-click to open.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
