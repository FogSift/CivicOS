/**
 * @fileId 13132db4-372b-4c9b-8923-8e8f925e0b8b
 * @module CivicOS/views/VaultView
 * @description The Vault — org document storage (narratives, compliance, bios).
 *              Formerly "Asset Vault". Static for now; file upload on roadmap.
 */

import React from 'react';
import { Database, ShieldCheck, User } from 'lucide-react';

const VAULT_ITEMS = [
  { label: 'Master Narrative', Icon: Database },
  { label: 'Compliance & Tax', Icon: ShieldCheck },
  { label: 'Team Bios',        Icon: User },
];

export default function VaultView() {
  return (
    <div className="max-w-4xl space-y-4">
      <div className="pb-2 mb-4" style={{ borderBottom: '1px solid var(--color-border-main)' }}>
        <p className="text-xl font-bold flex items-center" style={{ color: 'var(--color-text-primary)' }}>
          <Database size={20} className="mr-2" style={{ color: 'var(--color-accent-primary)' }} />
          The Vault
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Standard narratives and compliance documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VAULT_ITEMS.map(({ label, Icon }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center p-4 border border-transparent group focus:outline-none"
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            {/* XP folder icon */}
            <div className="w-16 h-16 mb-2 relative flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, #ffdb58, #e6b800)', border: '1px solid #cc9900', borderRadius: '2px', boxShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
            >
              <div className="absolute top-0 left-0 w-5 h-2" style={{ background: '#ffdb58', border: '1px solid #cc9900', borderBottom: 'none', borderRadius: '2px 2px 0 0', marginTop: '-8px' }} />
              <Icon size={24} style={{ color: '#7a5c00' }} />
            </div>
            <span
              className="text-sm px-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
