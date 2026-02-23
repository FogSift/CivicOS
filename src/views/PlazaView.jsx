/**
 * @fileId 60be1925-5f42-48af-95c2-49d79f7f6e57
 * @module CivicOS/views/PlazaView
 * @description The Plaza — discovery feed for funding leads.
 *              Formerly "The Radar". Core social surface: vote, commit, discard.
 */

import React from 'react';
import { Radar, Plus } from 'lucide-react';
import GrantCard from '../components/GrantCard.jsx';

export default function PlazaView({ resources, onVote, onCommit, onDiscard, onAddLead }) {
  const leads = resources
    .filter(r => r.status === 'discovery')
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="max-w-4xl space-y-4">
      <div className="border-b border-[#aca899] pb-2 mb-4">
        <h2 className="text-xl font-bold text-black flex items-center">
          <Radar size={20} className="mr-2 text-[#0054e3]" />
          The Plaza
        </h2>
        <p className="text-sm text-[#666]">Surface leads, build consensus.</p>
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
  );
}
