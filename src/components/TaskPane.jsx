/**
 * @fileId cd9afea1-9479-44aa-aa89-46cacc97f332
 * @module CivicOS/components/TaskPane
 * @description Left sidebar — navigation and status panel.
 *              Named after the Windows XP "Task Pane" pattern.
 */

import React from 'react';
import { Radar, KanbanSquare, Database } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'plaza',   label: 'The Plaza',   Icon: Radar },
  { id: 'builder', label: 'The Builder', Icon: KanbanSquare },
  { id: 'vault',   label: 'The Vault',   Icon: Database },
];

export default function TaskPane({ activeTab, onTabChange, discoveryCount }) {
  return (
    <div className="w-56 bg-gradient-to-b from-[#7ba2e7] to-[#638ce0] border-r border-[#aca899] p-3 flex flex-col overflow-y-auto overflow-x-hidden shrink-0">

      {/* Navigation */}
      <div className="mb-4 bg-white border border-[#ffffff] rounded-sm overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] px-3 py-1.5 cursor-default">
          <span className="text-[#0033cc] font-bold text-xs tracking-wide">System Tasks</span>
        </div>
        <ul className="p-2 space-y-1 bg-[#d6dff7] text-xs">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                onClick={() => onTabChange(id)}
                className={`w-full flex items-center text-left px-2 py-1.5 hover:underline ${activeTab === id ? 'text-black font-bold' : 'text-[#0033cc]'}`}
              >
                <Icon size={14} className={`mr-2 ${activeTab === id ? 'text-black' : 'text-[#0054e3]'}`} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Details */}
      <div className="mb-4 bg-white border border-[#ffffff] rounded-sm overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] px-3 py-1.5 cursor-default">
          <span className="text-[#0033cc] font-bold text-xs tracking-wide">Details</span>
        </div>
        <div className="p-3 bg-[#d6dff7] text-xs text-black space-y-2">
          <h4 className="font-bold">Active Signals</h4>
          <p>{discoveryCount} node{discoveryCount !== 1 ? 's' : ''} await consensus.</p>
          <div className="border-t border-[#aca899] pt-2 mt-2">
            <p className="text-[#666] italic">System operates strictly as is.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
