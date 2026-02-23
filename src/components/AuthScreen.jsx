/**
 * @fileId 264889e0-3fc6-45b8-884e-9a154c0ce681
 * @module CivicOS/components/AuthScreen
 * @description XP-style login screen. Shown before authentication.
 */

import React from 'react';
import { Monitor, ArrowRight, ShieldCheck, Settings } from 'lucide-react';

export default function AuthScreen({ onAuth }) {
  return (
    <div className="min-h-screen bg-[#0033cc] flex flex-col relative font-sans selection:bg-[#316ac5] selection:text-white">
      <div className="h-16 bg-[#0033cc] border-b-2 border-white/20"></div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#0033cc] via-[#5a7edc] to-[#0033cc]">
        <div className="max-w-3xl w-full flex items-center bg-transparent p-8">

          {/* Branding */}
          <div className="w-1/2 pr-8 text-right border-r border-white/30 flex flex-col items-end">
            <h1 className="text-4xl font-bold text-white italic tracking-wider mb-2 drop-shadow-md">
              Civic<span className="text-[#ff8c00]">OS</span>
            </h1>
            <p className="text-[#c1d3ff] text-sm max-w-xs text-right drop-shadow">
              To begin, enter your credentials. Collaborative routing system securely initialized.
            </p>
          </div>

          {/* Login Box */}
          <div className="w-1/2 pl-8 flex flex-col space-y-6">
            <div className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm shadow-xl">
              <div className="h-16 w-16 bg-white rounded shadow-md border-2 border-white overflow-hidden shrink-0 flex items-center justify-center">
                <Monitor size={32} className="text-[#0054e3]" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg mb-2 drop-shadow-sm">System Administrator</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="admin@civic-os.network"
                      className="w-full bg-white border border-[#7f9db9] px-2 py-1 text-sm text-black focus:outline-none focus:border-[#316ac5] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
                    />
                    <button
                      onClick={onAuth}
                      className="w-full bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#003c74] text-black font-medium text-sm py-1 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_gray] active:bg-[#e0e0e0] flex items-center justify-center space-x-2"
                    >
                      <span>Log On</span>
                      <ArrowRight size={14} className="text-[#0054e3]" />
                    </button>
                  </div>
                  <div className="border-t border-white/30 pt-4">
                    <button
                      onClick={onAuth}
                      className="w-full bg-[#0054e3] hover:bg-[#2f8cf3] border border-[#003c74] text-white font-medium text-sm py-1.5 rounded-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4),1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Monitor size={14} />
                      <span>Enter Demo Workspace</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[#c1d3ff] text-xs pl-2">
              <ShieldCheck size={14} className="text-[#4cd964]" />
              <span>Low-warranty peer infrastructure connected.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 bg-[#0033cc] border-t-2 border-white/20 flex items-center justify-end px-8">
        <button className="flex items-center space-x-2 bg-[#0054e3] hover:bg-[#2f8cf3] text-white border border-white/30 px-4 py-1.5 rounded-sm shadow-md transition-colors text-sm font-medium">
          <Settings size={14} />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
}
