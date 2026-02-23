/**
 * @fileId 28ed03c3-306c-44cd-8432-e72e52477f1a
 * @module CivicOS/src/components/StatusBar.jsx
 * @description XP-style status bar showing version string and node count
 */

import React from 'react';
import { release } from '../version.js';

export default function StatusBar({ nodeCount }) {
  return (
    <div className="h-5 flex items-stretch bg-[var(--color-window-bg)] border-t border-[var(--color-border-main)] shrink-0 select-none overflow-hidden">
      <span className="px-3 text-[10px] text-[var(--color-text-muted)] border-r border-[var(--color-border-main)] shadow-[inset_1px_1px_0_var(--color-border-inner)] flex items-center whitespace-nowrap">
        v{release.version} {release.channel}
      </span>
      <span className="px-3 text-[10px] text-[var(--color-text-muted)] border-r border-[var(--color-border-main)] shadow-[inset_1px_1px_0_var(--color-border-inner)] flex items-center whitespace-nowrap">
        {nodeCount} node{nodeCount !== 1 ? 's' : ''}
      </span>
      <span className="px-3 text-[10px] text-[var(--color-text-muted)] flex items-center flex-1 whitespace-nowrap">
        {release.label ?? ''}
      </span>
    </div>
  );
}
