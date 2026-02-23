/**
 * @fileId 7dc71355-84e0-460b-bc58-75d3249aa4d5
 * @module CivicOS/components/AddNodeModal
 * @description Modal dialog for submitting a new funding lead to The Plaza.
 */

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { GRANT_TYPES } from '../constants.js';

const DEFAULT_NODE = {
  title: '',
  type: 'Federal Grant',
  bounty: '',
  deadline: '',
  fitScore: 50,
};

export default function AddNodeModal({ onSave, onClose }) {
  const [node, setNode] = useState(DEFAULT_NODE);

  const handleSave = () => {
    onSave(node);
    setNode(DEFAULT_NODE);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#ece9d8] border border-[#0054e3] shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full max-w-md">

        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#0054e3] via-[#2f8cf3] to-[#0054e3] h-7 flex items-center justify-between px-2 select-none">
          <div className="flex items-center space-x-2">
            <Plus size={14} className="text-white" />
            <span className="text-white font-bold text-xs drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
              Add New Lead — CivicOS
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-b from-[#e81123] to-[#c2101e] border border-white rounded-sm w-5 h-5 flex items-center justify-center"
          >
            <X size={12} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 text-sm text-black">
          <div>
            <label className="block text-xs font-bold mb-1">
              Title <span className="text-[#e81123]">*</span>
            </label>
            <input
              type="text"
              value={node.title}
              onChange={e => setNode({ ...node, title: e.target.value })}
              placeholder="e.g. Knight Foundation — Civic Tech"
              className="w-full border border-[#7f9db9] px-2 py-1 text-sm focus:outline-none focus:border-[#316ac5] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Type</label>
            <select
              value={node.type}
              onChange={e => setNode({ ...node, type: e.target.value })}
              className="w-full border border-[#7f9db9] px-2 py-1 text-sm focus:outline-none focus:border-[#316ac5] bg-white"
            >
              {GRANT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1">Bounty ($)</label>
              <input
                type="text"
                value={node.bounty}
                onChange={e => setNode({ ...node, bounty: e.target.value })}
                placeholder="50,000"
                className="w-full border border-[#7f9db9] px-2 py-1 text-sm focus:outline-none focus:border-[#316ac5] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1">Deadline</label>
              <input
                type="date"
                value={node.deadline}
                onChange={e => setNode({ ...node, deadline: e.target.value })}
                className="w-full border border-[#7f9db9] px-2 py-1 text-sm focus:outline-none focus:border-[#316ac5] bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Fit Score: <span className="text-[#0054e3]">{node.fitScore}</span>
            </label>
            <input
              type="range"
              min="0" max="100"
              value={node.fitScore}
              onChange={e => setNode({ ...node, fitScore: e.target.value })}
              className="w-full accent-[#0054e3]"
            />
            <div className="flex justify-between text-[10px] text-[#666]">
              <span>0 — Long Shot</span>
              <span>100 — Perfect Fit</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-4 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!node.title}
            className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-4 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <Plus size={12} className="text-[#3aa03a]" />
            <span>Add to Plaza</span>
          </button>
        </div>
      </div>
    </div>
  );
}
