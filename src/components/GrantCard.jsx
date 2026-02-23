/**
 * @fileId c4b32d6a-1a45-449a-8113-da13e4a38f7a
 * @module CivicOS/components/GrantCard
 * @description Single grant/funding lead card with voting controls and actions.
 *              Used in PlazaView. Core interactive unit of The Plaza feed.
 */

import React from 'react';
import { ChevronUp, ChevronDown, DollarSign, Calendar, Target, ArrowRight, Trash2 } from 'lucide-react';

export default function GrantCard({ resource, onVote, onCommit, onDiscard }) {
  return (
    <div className="bg-white border border-[#aca899] p-3 flex items-start shadow-sm hover:bg-[#f8f9fa] transition-colors">

      {/* Voting — spin-button style */}
      <div className="flex flex-col items-center mr-4 w-12 shrink-0 pt-1">
        <button
          onClick={() => onVote(resource.id, 1)}
          className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] w-full py-1 flex items-center justify-center hover:bg-[#e0e0e0] active:shadow-[inset_1px_1px_2px_gray] rounded-t-sm"
          title="Upvote"
        >
          <ChevronUp size={16} className="text-black" />
        </button>
        <div className="w-full border-x border-[#aca899] bg-white text-center py-1 font-bold text-sm">
          <span className={
            resource.votes > 0 ? 'text-[#3aa03a]' :
            resource.votes < 0 ? 'text-[#e81123]' :
            'text-black'
          }>
            {resource.votes}
          </span>
        </div>
        <button
          onClick={() => onVote(resource.id, -1)}
          className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] w-full py-1 flex items-center justify-center hover:bg-[#e0e0e0] active:shadow-[inset_1px_1px_2px_gray] rounded-b-sm"
          title="Downvote"
        >
          <ChevronDown size={16} className="text-black" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center space-x-3 mb-2">
          <h4 className="text-base font-bold text-[#0033cc] truncate hover:underline cursor-pointer">
            {resource.title}
          </h4>
          <span className="bg-[#ece9d8] border border-[#aca899] px-2 py-0.5 text-[10px] uppercase font-bold text-[#333] whitespace-nowrap shadow-[inset_1px_1px_0_white]">
            {resource.type}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-[#333]">
          <div className="flex items-center font-bold text-[#3aa03a]">
            <DollarSign size={14} className="mr-0.5" />
            {resource.bounty}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1 text-[#0054e3]" />
            Due: {resource.deadline}
          </div>
          <div className="flex items-center font-bold">
            <Target size={14} className="mr-1 text-[#e81123]" />
            Fit Score: {resource.fitScore}/100
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-2 border-l border-[#aca899] pl-4 shrink-0 w-32">
        <button
          onClick={() => onCommit(resource.id)}
          className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-2 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray] active:bg-[#e0e0e0] flex items-center justify-center space-x-1"
        >
          <ArrowRight size={12} className="text-[#0054e3]" />
          <span>Commit</span>
        </button>
        <button
          onClick={() => onDiscard(resource.id)}
          className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-2 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray] active:bg-[#e0e0e0] flex items-center justify-center space-x-1"
        >
          <Trash2 size={12} className="text-[#e81123]" />
          <span>Discard</span>
        </button>
      </div>
    </div>
  );
}
