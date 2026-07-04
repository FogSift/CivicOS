import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Palette, Globe, Shield, Volume2, User, RefreshCw } from 'lucide-react';
import { useKernel } from '../kernel/CivicProvider.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { playOpenBeep } from '../os/sounds.js';

const CATEGORIES = [
  { id: 'display',    label: 'Display',          Icon: Monitor,  desc: 'Themes, resolution, appearance' },
  { id: 'sound',      label: 'Sounds & Audio',   Icon: Volume2,  desc: 'Volume, audio devices'          },
  { id: 'network',    label: 'Network',           Icon: Globe,    desc: 'Internet, network connections'  },
  { id: 'accounts',   label: 'User Accounts',    Icon: User,     desc: 'Passwords, account settings'    },
  { id: 'security',   label: 'Security Center',  Icon: Shield,   desc: 'Firewall, updates, antivirus'   },
  { id: 'appearance', label: 'Appearance',        Icon: Palette,  desc: 'Opens Display settings'         },
];

const ApplyRow = ({ onDone }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Changes apply immediately.</span>
    <button disabled aria-disabled="true">Apply</button>
    <button onClick={onDone}>OK</button>
  </div>
);

function DisplayPanel({ theme, setTheme, onDone }) {
  return (
    <div style={{ padding: 12 }}>
      <div className="window" style={{ marginBottom: 12 }}>
        <div className="title-bar"><div className="title-bar-text">Themes</div></div>
        <div className="window-body" style={{ padding: 10 }}>
          <p style={{ fontSize: 11, marginBottom: 8, color: 'var(--color-text-muted)' }}>
            A theme is a background plus a set of sounds, icons, and other elements to help you personalize your computer.
          </p>
          <div className="field-row-stacked" style={{ gap: 8 }}>
            <label style={{ fontSize: 11 }}>Current theme:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setTheme('classic')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '8px 12px',
                  background: theme === 'classic' ? 'var(--color-accent-hover-bg)' : 'transparent',
                  border: theme === 'classic' ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border-main)',
                  boxShadow: 'none',
                }}
              >
                <div style={{
                  width: 64, height: 40, borderRadius: 2,
                  background: 'linear-gradient(180deg, #3a8edc 0%, #5ab0f0 40%, #6ac040 41%, #3a9020 100%)',
                  border: '1px solid #aaa',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'flex-end',
                }}>
                  <div style={{ width: '100%', height: 8, background: 'linear-gradient(180deg, #2a5cce, #0e2a8c)', borderTop: '1px solid #6090e8' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10 }}>
                  <Sun size={10} /> Classic XP
                </div>
              </button>
              <button
                onClick={() => setTheme('creme')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '8px 12px',
                  background: theme === 'creme' ? 'var(--color-accent-hover-bg)' : 'transparent',
                  border: theme === 'creme' ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border-main)',
                  boxShadow: 'none',
                }}
              >
                <div style={{
                  width: 64, height: 40, borderRadius: 2,
                  background: 'linear-gradient(180deg, #c4b59a 0%, #d4c5a9 40%, #8a9a5a 41%, #607040 100%)',
                  border: '1px solid #aaa',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'flex-end',
                }}>
                  <div style={{ width: '100%', height: 8, background: 'linear-gradient(180deg, #7a6a58, #4a3c2c)', borderTop: '1px solid #9a8a70' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10 }}>
                  <Moon size={10} /> Crème XP
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ApplyRow onDone={onDone} />
    </div>
  );
}

function SoundPanel({ settings, updateSettings, onDone }) {
  return (
    <div style={{ padding: 12 }}>
      <div className="window" style={{ marginBottom: 12 }}>
        <div className="title-bar"><div className="title-bar-text">Sounds</div></div>
        <div className="window-body" style={{ padding: 10 }}>
          <div className="field-row" style={{ marginBottom: 10 }}>
            <input
              id="ui-sounds"
              type="checkbox"
              checked={settings.uiSounds}
              onChange={(e) => {
                updateSettings({ uiSounds: e.target.checked });
                if (e.target.checked) playOpenBeep(settings.volume);
              }}
            />
            <label htmlFor="ui-sounds" style={{ fontSize: 11 }}>Play sounds for window events</label>
          </div>
          <div className="field-row-stacked" style={{ gap: 6 }}>
            <label style={{ fontSize: 11 }}>Volume: {settings.volume}%</label>
            <input
              type="range" min={0} max={100} value={settings.volume}
              onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--color-accent-primary)' }}
            />
          </div>
        </div>
      </div>
      <ApplyRow onDone={onDone} />
    </div>
  );
}

function NetworkPanel({ onDone }) {
  const online = useOnlineStatus();
  const [adapterStatus, setAdapterStatus] = useState('checking');

  const checkAdapter = () => {
    setAdapterStatus('checking');
    fetch('/api/meta.json', { cache: 'no-store' })
      .then((res) => setAdapterStatus(res.ok ? 'connected' : `error-${res.status}`))
      .catch(() => setAdapterStatus('unreachable'));
  };

  useEffect(() => { checkAdapter(); }, []);

  return (
    <div style={{ padding: 12 }}>
      <div className="window" style={{ marginBottom: 12 }}>
        <div className="title-bar"><div className="title-bar-text">Network Connections</div></div>
        <div className="window-body" style={{ padding: 10, fontSize: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: online ? '#4caf50' : '#e81123' }} />
            <span>Local Area Connection: {online ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: adapterStatus === 'connected' ? '#4caf50' : adapterStatus === 'checking' ? '#aaa' : '#e81123',
            }} />
            <span>
              FogSift Adapter: {adapterStatus === 'connected' ? 'Connected (HTTP 200)' : adapterStatus === 'checking' ? 'Checking…' : 'Unreachable'}
            </span>
            <button onClick={checkAdapter} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, marginLeft: 'auto' }}>
              <RefreshCw size={10} /> Refresh
            </button>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>
            Origin: {window.location.origin}<br />
            API route: /api → FogSift adapter (via Vite proxy)
          </p>
        </div>
      </div>
      <ApplyRow onDone={onDone} />
    </div>
  );
}

function AccountsPanel({ user, onRenameUser, onDone }) {
  const [name, setName] = useState(user);
  return (
    <div style={{ padding: 12 }}>
      <div className="window" style={{ marginBottom: 12 }}>
        <div className="title-bar"><div className="title-bar-text">User Accounts</div></div>
        <div className="window-body" style={{ padding: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 2,
              background: 'linear-gradient(135deg, #7cb8f0, #2060c0)',
              border: '2px solid rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#fff', fontWeight: 'bold',
            }}>
              {user[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 'bold' }}>{user}</span>
          </div>
          <div className="field-row-stacked" style={{ gap: 6, marginBottom: 8 }}>
            <label htmlFor="rename-user" style={{ fontSize: 11 }}>Change your name:</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input id="rename-user" type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1 }} />
              <button disabled={!name.trim() || name.trim() === user} onClick={() => onRenameUser(name)}>
                Change Name
              </button>
            </div>
          </div>
          <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Passwords are not used in this build.</p>
        </div>
      </div>
      <ApplyRow onDone={onDone} />
    </div>
  );
}

function SecurityPanel({ user, onDone }) {
  const { backend, eventCount } = useKernel();
  return (
    <div style={{ padding: 12 }}>
      <div className="window" style={{ marginBottom: 12 }}>
        <div className="title-bar"><div className="title-bar-text">Security Center</div></div>
        <div className="window-body" style={{ padding: 10, fontSize: 11 }}>
          <p style={{ marginBottom: 6 }}>
            <strong>Storage backend</strong> — {backend === 'indexeddb' ? 'IndexedDB (persistent) ● ON' : 'Memory (session only) ● LIMITED'}
          </p>
          <p style={{ marginBottom: 6 }}><strong>Event ledger</strong> — {eventCount} events recorded</p>
          <p><strong>Session</strong> — logged on as {user}</p>
        </div>
      </div>
      <ApplyRow onDone={onDone} />
    </div>
  );
}

export default function ControlPanelApp({ theme, setTheme, settings, updateSettings, user, onRenameUser }) {
  const [active, setActive] = useState(null);

  const openCategory = (id) => setActive(id === 'appearance' ? 'display' : id);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Tahoma, Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: 160, flexShrink: 0,
        background: 'linear-gradient(180deg, var(--color-sidebar-from), var(--color-sidebar-to))',
        borderRight: '1px solid var(--color-border-main)',
        padding: '8px 0',
      }}>
        <div style={{ padding: '2px 8px 6px', fontSize: 10, fontWeight: 'bold', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Control Panel
        </div>
        <div style={{ borderTop: '1px solid var(--color-border-main)', margin: '4px 0' }} />
        {['Switch to Category View', 'See Also', 'Troubleshooters'].map(t => (
          <div key={t} aria-disabled="true" style={{ padding: '2px 12px', fontSize: 11, color: 'var(--color-text-muted)', cursor: 'default' }}>{t}</div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-panel-bg)' }}>
        {!active ? (
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10, borderBottom: '1px solid var(--color-border-main)', paddingBottom: 6 }}>
              Pick a category
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CATEGORIES.map(({ id, label, Icon, desc }) => (
                <button
                  key={id}
                  onClick={() => openCategory(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', textAlign: 'left',
                    background: 'var(--color-window-bg)',
                    border: '1px solid var(--color-border-main)',
                    boxShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-window-bg)'; e.currentTarget.style.borderColor = 'var(--color-border-main)'; }}
                >
                  <div style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 2,
                    background: 'linear-gradient(135deg, #d0e4ff, #90b8f0)',
                    border: '1px solid #80a8e0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} style={{ color: '#1a3a8a' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-text-link)' }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--color-border-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setActive(null)} style={{ fontSize: 10, padding: '1px 8px' }}>← Back</button>
              <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                {CATEGORIES.find(c => c.id === active)?.label}
              </span>
            </div>
            {active === 'display' && <DisplayPanel theme={theme} setTheme={setTheme} onDone={() => setActive(null)} />}
            {active === 'sound' && <SoundPanel settings={settings} updateSettings={updateSettings} onDone={() => setActive(null)} />}
            {active === 'network' && <NetworkPanel onDone={() => setActive(null)} />}
            {active === 'accounts' && <AccountsPanel user={user} onRenameUser={onRenameUser} onDone={() => setActive(null)} />}
            {active === 'security' && <SecurityPanel user={user} onDone={() => setActive(null)} />}
          </div>
        )}
      </div>
    </div>
  );
}
