/**
 * @fileId 264889e0-3fc6-45b8-884e-9a154c0ce681
 * @module CivicOS/components/AuthScreen
 * @description XP-style login screen. Uses xp.css window chrome for authentic look.
 */

import React from 'react';
import { Monitor, Power, Settings } from 'lucide-react';

const xpBg = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #082368 0%, #0d3dbf 20%, #1a5de6 50%, #0d3dbf 80%, #082368 100%)',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '"Pixelated MS Sans Serif", Arial, sans-serif',
};

export default function AuthScreen({ onAuth }) {
  return (
    <div style={xpBg}>

      {/* XP top bar - mimics the Welcome Screen top band */}
      <div style={{
        height: '72px',
        background: 'linear-gradient(180deg, #1f5fbf 0%, #1252b3 100%)',
        borderBottom: '2px solid #0a3a96',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            <Monitor size={16} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontSize: '22px', fontWeight: '700', fontStyle: 'italic', letterSpacing: '0.5px', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            Civic<span style={{ color: '#ff8c00' }}>OS</span>
          </span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>
          Collaborative Civic Infrastructure
        </span>
      </div>

      {/* Center content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '56px', padding: '40px 32px' }}>

        {/* Left: welcome copy */}
        <div style={{ textAlign: 'right', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '56px', maxWidth: '280px' }}>
          <p style={{ color: '#c8d8ff', fontSize: '28px', fontWeight: '700', lineHeight: '1.3', margin: '0 0 12px', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>
            To begin, click your user name.
          </p>
          <p style={{ color: 'rgba(180,200,255,0.6)', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
            After logging on, you can add or change passwords by pressing Ctrl+Alt+Delete.
          </p>
        </div>

        {/* Right: XP window chrome */}
        <div className="window" style={{ width: '320px', flexShrink: 0 }}>
          <div className="title-bar">
            <div className="title-bar-text">Log On to CivicOS</div>
            <div className="title-bar-controls">
              <button aria-label="Help" />
            </div>
          </div>

          <div className="window-body" style={{ padding: '16px' }}>
            {/* User tile */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px',
              background: '#dce6f7',
              border: '2px solid #7a9fd4',
              marginBottom: '16px',
              cursor: 'pointer',
            }}>
              <div style={{
                width: '48px', height: '48px', flexShrink: 0,
                background: '#fff',
                border: '2px solid #afc7e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Monitor size={28} color="#0054e3" />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#00008b' }}>System Administrator</div>
                <div style={{ fontSize: '11px', color: '#555' }}>Click to log on</div>
              </div>
            </div>

            {/* Email field */}
            <div className="field-row-stacked" style={{ marginBottom: '12px' }}>
              <label htmlFor="xp-email">Email address:</label>
              <input
                id="xp-email"
                type="email"
                placeholder="admin@civic-os.network"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button onClick={onAuth}>Log On</button>
              <button>Cancel</button>
            </div>

            <hr style={{ margin: '12px 0', borderColor: '#c0c0c0' }} />

            <button onClick={onAuth} style={{ width: '100%' }}>
              Enter Demo Workspace
            </button>

            {/* Status */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4cd964', flexShrink: 0 }} />
              <span style={{ fontSize: '10px', color: '#555' }}>Low-warranty peer infrastructure connected.</span>
            </div>
          </div>
        </div>
      </div>

      {/* XP bottom bar */}
      <div style={{
        height: '64px',
        background: 'linear-gradient(180deg, #1252b3 0%, #0d3dbf 100%)',
        borderTop: '2px solid #0a3a96',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <Power size={12} />
            Turn Off
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <Settings size={12} />
            Options
          </button>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
          CivicOS v0.0.1-alpha
        </span>
      </div>
    </div>
  );
}
