/**
 * @fileId 13132db4-372b-4c9b-8923-8e8f925e0b8b
 * @module CivicOS/views/VaultView
 * @description The Vault — org document storage (narratives, compliance, bios).
 *              Formerly "Asset Vault". Folder navigation over kernel-backed
 *              listings; file upload on roadmap (nothing writes docs yet).
 */

import React, { useState } from 'react';
import { Database, ShieldCheck, User, FileText, ArrowLeft } from 'lucide-react';
import { useKernel } from '../kernel/CivicProvider.jsx';

const VAULT_ITEMS = [
  { id: 'master-narrative', label: 'Master Narrative', Icon: Database },
  { id: 'compliance-tax',   label: 'Compliance & Tax', Icon: ShieldCheck },
  { id: 'team-bios',        label: 'Team Bios',        Icon: User },
];

function FolderView({ folder, onBack }) {
  const { snapshots } = useKernel();
  const docs = snapshots.vault?.folders?.[folder.id] ?? [];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 pb-2 mb-4" style={{ borderBottom: '1px solid var(--color-border-main)' }}>
        <button onClick={onBack} className="flex items-center gap-1 text-xs" style={{ padding: '2px 8px' }}>
          <ArrowLeft size={12} /> Back
        </button>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          The Vault &#9656; {folder.label}
        </span>
      </div>

      {docs.length === 0 ? (
        <p className="text-sm italic text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
          (This folder is empty)
        </p>
      ) : (
        <div className="space-y-1">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>
              <FileText size={14} style={{ color: 'var(--color-text-muted)' }} />
              {doc.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VaultView() {
  const [openFolder, setOpenFolder] = useState(null);

  if (openFolder) {
    return <FolderView folder={openFolder} onBack={() => setOpenFolder(null)} />;
  }

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
        {VAULT_ITEMS.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center justify-center p-4 border border-transparent group focus:outline-none"
            onDoubleClick={() => setOpenFolder(item)}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover-bg)'; e.currentTarget.style.borderColor = 'var(--color-accent-selected)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            {/* XP folder icon */}
            <div className="w-16 h-16 mb-2 relative flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, #ffdb58, #e6b800)', border: '1px solid #cc9900', borderRadius: '2px', boxShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
            >
              <div className="absolute top-0 left-0 w-5 h-2" style={{ background: '#ffdb58', border: '1px solid #cc9900', borderBottom: 'none', borderRadius: '2px 2px 0 0', marginTop: '-8px' }} />
              <item.Icon size={24} style={{ color: '#7a5c00' }} />
            </div>
            <span
              className="text-sm px-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
