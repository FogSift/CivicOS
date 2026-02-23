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
      <div className="border-b border-[#aca899] pb-2 mb-4">
        <h2 className="text-xl font-bold text-black flex items-center">
          <Database size={20} className="mr-2 text-[#0054e3]" />
          The Vault
        </h2>
        <p className="text-sm text-[#666]">Standard narratives and compliance documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VAULT_ITEMS.map(({ label, Icon }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center p-4 hover:bg-[#ebf3fd] border border-transparent hover:border-[#316ac5] rounded-sm group focus:outline-none focus:bg-[#c1d2ee]"
          >
            <div className="w-16 h-16 mb-2 bg-gradient-to-b from-[#ffdb58] to-[#e6b800] rounded-sm relative shadow-sm border border-[#cc9900] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-1/3 h-2 bg-[#ffdb58] border-t border-l border-r border-[#cc9900] -mt-2 rounded-t-sm"></div>
              <Icon size={24} className="text-[#997300]" />
            </div>
            <span className="text-sm text-black group-hover:bg-[#316ac5] group-hover:text-white px-1">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
