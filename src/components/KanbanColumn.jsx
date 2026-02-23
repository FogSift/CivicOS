/**
 * @fileId 273aecc3-96fd-4c06-9464-6be40d6ab7b8
 * @module CivicOS/components/KanbanColumn
 * @description Single column in The Builder kanban board.
 */

import React from 'react';

export default function KanbanColumn({ column, resources }) {
  const cards = resources.filter(r => r.status === column.id);

  return (
    <div className="w-72 flex-shrink-0 bg-[#ece9d8] border border-[#aca899] flex flex-col max-h-full shadow-sm rounded-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#0054e3] to-[#3a93ff] px-2 py-1 border-b border-[#aca899] flex justify-between items-center text-white">
        <h3 className="text-xs font-bold drop-shadow-sm">{column.label}</h3>
        <span className="bg-white text-[#0054e3] text-xs font-bold px-1.5 rounded-sm">
          {cards.length}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto space-y-2 bg-white m-1 border border-[#aca899] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
        {cards.map(resource => (
          <div
            key={resource.id}
            className="bg-gradient-to-b from-[#fdfdfd] to-[#f4f4f4] border border-[#aca899] p-2 cursor-pointer hover:border-[#316ac5] shadow-sm"
          >
            <h4 className="font-bold text-[#0033cc] mb-2 text-sm leading-tight hover:underline">
              {resource.title}
            </h4>
            <div className="flex items-center justify-between text-xs text-black border-t border-[#dfdfdf] pt-1">
              <span className="font-bold text-[#3aa03a]">{resource.bounty}</span>
              <span>{resource.deadline}</span>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="text-center p-4 text-[#aca899] text-xs italic">Empty folder</div>
        )}
      </div>
    </div>
  );
}
