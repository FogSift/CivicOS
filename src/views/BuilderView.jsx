/**
 * @fileId 5efdf478-22f7-492a-83d0-d4b18e235815
 * @module CivicOS/views/BuilderView
 * @description The Builder — kanban board for tracking leads through the pipeline.
 *              Formerly "Active Pipeline". Future: public-facing per-project boards.
 */

import React from 'react';
import { KanbanSquare } from 'lucide-react';
import KanbanColumn from '../components/KanbanColumn.jsx';
import { PipelineColumns } from '../constants.js';

export default function BuilderView({ resources }) {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[#aca899] pb-2 mb-4 shrink-0">
        <h2 className="text-xl font-bold text-black flex items-center">
          <KanbanSquare size={20} className="mr-2 text-[#0054e3]" />
          The Builder
        </h2>
        <p className="text-sm text-[#666]">Track committed leads through to submission.</p>
      </div>

      <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 items-start">
        {PipelineColumns.map(col => (
          <KanbanColumn key={col.id} column={col} resources={resources} />
        ))}
      </div>
    </div>
  );
}
