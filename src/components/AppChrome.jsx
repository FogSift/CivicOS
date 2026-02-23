/**
 * @fileId 58b87fd2-4d7d-486c-9250-ba5b063bb062
 * @module CivicOS/components/AppChrome
 * @description Window chrome — title bar, toolbar, and address bar.
 *              Wraps the main application window frame.
 */

import React from 'react';
import { Database, Plus, User, X } from 'lucide-react';

const TAB_LABELS = {
  plaza:   'The Plaza',
  builder: 'The Builder',
  vault:   'The Vault',
};

export default function AppChrome({ activeTab, onLogOff, onAddLead, onToggleGuide }) {
  return (
    <>
      {/* Title Bar */}
      <header className="bg-gradient-to-r from-[#0054e3] via-[#2f8cf3] to-[#0054e3] h-8 flex items-center justify-between px-2 shrink-0 select-none">
        <div className="flex items-center space-x-2">
          <Database size={16} className="text-white drop-shadow-md" />
          <h1 className="text-white font-bold text-sm drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
            CivicOS — Discovery System
          </h1>
        </div>
        <div className="flex items-center space-x-1">
          <button className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-white rounded-sm w-5 h-5 flex items-center justify-center shadow-[1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_gray]">
            <div className="w-2.5 h-0.5 bg-black mt-2"></div>
          </button>
          <button className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-white rounded-sm w-5 h-5 flex items-center justify-center shadow-[1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_gray]">
            <div className="w-2.5 h-2.5 border border-black border-t-2"></div>
          </button>
          <button
            onClick={onLogOff}
            className="bg-gradient-to-b from-[#e81123] to-[#c2101e] border border-white rounded-sm w-5 h-5 flex items-center justify-center shadow-[1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_#800000]"
            title="Log Off"
          >
            <X size={14} className="text-white font-bold" />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#aca899] px-2 py-1 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center space-x-1">
          {['File', 'Edit', 'View'].map(item => (
            <button key={item} className="px-2 py-1 hover:bg-[#c1d2ee] hover:border-[#316ac5] border border-transparent rounded cursor-default text-black">
              {item}
            </button>
          ))}
          <button
            onClick={onToggleGuide}
            className="px-2 py-1 hover:bg-[#c1d2ee] hover:border-[#316ac5] border border-transparent rounded cursor-default text-black"
          >
            Help
          </button>
        </div>
        <div className="flex items-center space-x-3 text-black">
          <button
            onClick={onAddLead}
            className="flex items-center space-x-1 hover:bg-[#c1d2ee] border border-transparent hover:border-[#316ac5] px-2 py-0.5 rounded"
          >
            <Plus size={14} className="text-[#3aa03a]" />
            <span>Add Lead</span>
          </button>
          <div className="w-px h-4 bg-[#aca899]"></div>
          <div className="flex items-center space-x-1 cursor-default">
            <User size={14} className="text-[#0054e3]" />
            <span>demo@civic-os</span>
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#aca899] px-2 py-1 flex items-center space-x-2 shrink-0 text-xs">
        <span className="text-black font-medium">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] px-2 py-1 text-black flex items-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]">
          <Database size={14} className="text-[#0054e3] mr-2" />
          <span>My Computer \ CivicOS \ {TAB_LABELS[activeTab] ?? activeTab}</span>
        </div>
      </div>
    </>
  );
}
