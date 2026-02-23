/**
 * @fileId 46c41fb0-2c69-4e7e-ae30-5bef69cc2045
 * @module CivicOS/components/InfoBar
 * @description Dismissible yellow information bar (IE-style guide prompt).
 */

import React from 'react';
import { Info, X } from 'lucide-react';

export default function InfoBar({ onDismiss }) {
  return (
    <div className="bg-[#ffffe1] border-b border-[#aca899] p-3 shadow-sm flex items-start -mx-4 md:-mx-6 -mt-4 md:-mt-6 px-4 md:px-6 mb-6">
      <Info size={16} className="text-[#0033cc] mr-3 mt-0.5 shrink-0" />
      <div className="flex-1 text-sm">
        <h3 className="font-bold mb-1">Information Bar</h3>
        <p>
          Welcome to The Plaza. Review the &quot;Fit Score&quot;, build consensus using
          the arrows, and click &quot;Commit&quot; to move a lead into The Builder.
        </p>
      </div>
      <button onClick={onDismiss} className="text-black hover:text-[#0033cc] p-1">
        <X size={14} />
      </button>
    </div>
  );
}
