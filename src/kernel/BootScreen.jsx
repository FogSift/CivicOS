/**
 * @fileId 286087bf-4a1a-4323-97f8-7f0cb259944b
 * @module CivicOS/src/kernel/BootScreen.jsx
 * @description XP-style boot splash shown while the kernel hydrates.
 */

import React from 'react';
import { Monitor } from 'lucide-react';

const screen = {
  position: 'fixed',
  inset: 0,
  background: '#000',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '48px',
  fontFamily: '"Pixelated MS Sans Serif", Arial, sans-serif',
  zIndex: 9999,
};

export default function BootScreen() {
  return (
    <div style={screen}>
      <style>{`
        @keyframes civicos-boot-slide {
          0%   { transform: translateX(-60px); }
          100% { transform: translateX(196px); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px', height: '40px',
          background: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Monitor size={20} color="#fff" />
        </div>
        <span style={{ color: '#fff', fontSize: '32px', fontWeight: '700', fontStyle: 'italic', letterSpacing: '0.5px' }}>
          Civic<span style={{ color: '#ff8c00' }}>OS</span>
        </span>
      </div>

      <div>
        <div style={{
          width: '196px', height: '16px',
          border: '2px solid #b0b0b0',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '2px', left: 0,
            display: 'flex', gap: '3px',
            animation: 'civicos-boot-slide 1.6s linear infinite',
          }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: '14px', height: '8px',
                background: 'linear-gradient(180deg, #5da8ff 0%, #1a5de6 100%)',
                borderRadius: '2px',
              }} />
            ))}
          </div>
        </div>
        <p style={{ color: '#9a9a9a', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
          Starting CivicOS&hellip;
        </p>
      </div>

      <span style={{ position: 'fixed', bottom: '24px', right: '32px', color: '#555', fontSize: '11px' }}>
        v{__APP_VERSION__}
      </span>
    </div>
  );
}
