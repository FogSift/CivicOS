/**
 * @fileId 46c41fb0-2c69-4e7e-ae30-5bef69cc2045
 * @module CivicOS/components/InfoBar
 * @description Dismissible yellow information bar (IE-style guide prompt).
 */

import React from 'react';
import { Info, X } from 'lucide-react';

export default function InfoBar({ onDismiss }) {
  return (
    <div
      className="border-b p-3 shadow-sm flex items-start -mx-4 md:-mx-6 -mt-4 md:-mt-6 px-4 md:px-6 mb-6"
      style={{ background: 'var(--color-infobar-bg)', borderColor: 'var(--color-border-main)' }}
    >
      <Info size={16} className="mr-3 mt-0.5 shrink-0" style={{ color: 'var(--color-text-link)' }} />
      <div className="flex-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>
        <p className="font-bold mb-1">Information Bar</p>
        <p>
          Welcome to The Plaza. Review the &quot;Fit Score&quot;, build consensus using
          the arrows, and click &quot;Commit&quot; to move a lead into The Builder.
        </p>
      </div>
      <button onClick={onDismiss} className="p-1" style={{ color: 'var(--color-text-primary)' }}>
        <X size={14} />
      </button>
    </div>
  );
}
