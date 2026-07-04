/**
 * @fileId 60be1925-5f42-48af-95c2-49d79f7f6e57
 * @module CivicOS/views/PlazaView
 * @description The Plaza — discovery feed for funding leads.
 *              Formerly "The Radar". Core social surface: vote, commit, discard.
 */

import React from 'react';
import { Radar, Plus } from 'lucide-react';
import GrantCard from '../components/GrantCard.jsx';
import StatusBar from '../components/StatusBar.jsx';

export default function PlazaView({ resources, onVote, onCommit, onDiscard, onAddLead }) {
  const leads = resources
    .filter(r => r.status === 'discovery')
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0 max-w-4xl space-y-4">
        <div className="pb-2 mb-4" style={{ borderBottom: '1px solid var(--color-border-main)' }}>
          <p className="text-xl font-bold flex items-center" style={{ color: 'var(--color-text-primary)' }}>
            <Radar size={20} className="mr-2" style={{ color: 'var(--color-accent-primary)' }} />
            The Plaza
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Surface leads, build consensus.</p>
        </div>

        {leads.length === 0 ? (
          <div className="text-center p-12 text-[#666]">
            <Radar size={32} className="mx-auto text-[#aca899] mb-3" />
            <p>No active signals. The Plaza is quiet.</p>
            <button
              onClick={onAddLead}
              className="mt-4 bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-4 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] flex items-center space-x-1 mx-auto"
            >
              <Plus size={12} className="text-[#3aa03a]" />
              <span>Add a Lead</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {leads.map(resource => (
              <GrantCard
                key={resource.id}
                resource={resource}
                onVote={onVote}
                onCommit={onCommit}
                onDiscard={onDiscard}
              />
            ))}
          </div>
        )}
      </div>
      <StatusBar nodeCount={leads.length} />
    </div>
  );
}
