/**
 * @fileId c4b32d6a-1a45-449a-8113-da13e4a38f7a
 * @module CivicOS/components/GrantCard
 * @description Single grant/funding lead card with voting controls and actions.
 *              Used in PlazaView. Core interactive unit of The Plaza feed.
 */

import React from 'react';
import { ChevronUp, ChevronDown, DollarSign, Calendar, Target, ArrowRight, Trash2 } from 'lucide-react';

export default function GrantCard({ resource, onVote, onCommit, onDiscard }) {
  const voteColor = resource.votes > 0 ? 'var(--color-success)' : resource.votes < 0 ? 'var(--color-error-from)' : 'var(--color-text-primary)';

  return (
    <div
      className="p-3 flex items-start shadow-sm transition-colors"
      style={{ background: 'var(--color-panel-bg)', border: '1px solid var(--color-border-main)' }}
    >
      {/* Voting — spin-button style */}
      <div className="flex flex-col items-center mr-4 w-12 shrink-0 pt-1">
        <button
          onClick={() => onVote(resource.id, 1)}
          className="w-full py-1 flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg, var(--color-btn-from), var(--color-btn-to))', border: '1px solid var(--color-border-main)', borderBottom: 'none', borderRadius: '2px 2px 0 0' }}
          title="Upvote"
        >
          <ChevronUp size={16} style={{ color: 'var(--color-text-primary)' }} />
        </button>
        <div
          className="w-full text-center py-1 font-bold text-sm"
          style={{ borderLeft: '1px solid var(--color-border-main)', borderRight: '1px solid var(--color-border-main)', background: 'var(--color-panel-bg)', color: voteColor }}
        >
          {resource.votes}
        </div>
        <button
          onClick={() => onVote(resource.id, -1)}
          className="w-full py-1 flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg, var(--color-btn-from), var(--color-btn-to))', border: '1px solid var(--color-border-main)', borderTop: 'none', borderRadius: '0 0 2px 2px' }}
          title="Downvote"
        >
          <ChevronDown size={16} style={{ color: 'var(--color-text-primary)' }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-base font-bold truncate hover:underline cursor-pointer" style={{ color: 'var(--color-text-link)' }}>
            {resource.title}
          </span>
          <span
            className="px-2 py-0.5 text-[10px] uppercase font-bold whitespace-nowrap shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
            style={{ background: 'var(--color-window-bg)', border: '1px solid var(--color-border-main)', color: 'var(--color-text-primary)' }}
          >
            {resource.type}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center font-bold" style={{ color: 'var(--color-success)' }}>
            <DollarSign size={14} className="mr-0.5" />
            {resource.bounty}
          </div>
          <div className="flex items-center" style={{ color: 'var(--color-text-primary)' }}>
            <Calendar size={14} className="mr-1" style={{ color: 'var(--color-accent-primary)' }} />
            Due: {resource.deadline}
          </div>
          <div className="flex items-center font-bold" style={{ color: 'var(--color-text-primary)' }}>
            <Target size={14} className="mr-1" style={{ color: 'var(--color-error-from)' }} />
            Fit Score: {resource.fitScore}/100
          </div>
        </div>
      </div>

      {/* Actions — plain XP.css buttons, no Tailwind gradient overrides */}
      <div className="flex flex-col space-y-1.5 pl-4 shrink-0 w-28" style={{ borderLeft: '1px solid var(--color-border-main)' }}>
        <button onClick={() => onCommit(resource.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px' }}>
          <ArrowRight size={11} style={{ color: 'var(--color-accent-primary)' }} />
          Commit
        </button>
        <button onClick={() => onDiscard(resource.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px' }}>
          <Trash2 size={11} style={{ color: 'var(--color-error-from)' }} />
          Discard
        </button>
      </div>
    </div>
  );
}
