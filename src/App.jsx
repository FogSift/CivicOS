/**
 * @fileId d0b9371e-cfe6-4e43-b1d5-ff04bd840a86
 * @module CivicOS/App
 * @description Root application component — XP-themed grant discovery dashboard.
 *              Login screen, sidebar nav, Discovery Feed, Pipeline kanban, Asset Vault.
 */

import React, { useState } from 'react';
import {
  Radar,
  KanbanSquare,
  Database,
  Settings,
  ChevronUp,
  ChevronDown,
  Plus,
  ArrowRight,
  Calendar,
  Target,
  DollarSign,
  Trash2,
  User,
  Info,
  X,
  ShieldCheck,
  Monitor,
} from 'lucide-react';

const initialResources = [
  {
    id: 1,
    title: "NSF Civic Innovation Challenge",
    type: "Federal Grant",
    bounty: "$1,000,000",
    deadline: "2026-04-15",
    fitScore: 92,
    votes: 14,
    status: "discovery",
    tags: ["Infrastructure", "High ROI"]
  },
  {
    id: 2,
    title: "Mozilla Data Futures Lab",
    type: "Foundation",
    bounty: "$50,000",
    deadline: "2026-03-30",
    fitScore: 85,
    votes: 8,
    status: "vetting",
    tags: ["Tech", "Quick Win"]
  },
  {
    id: 3,
    title: "Ford Foundation: Future of Work",
    type: "Foundation",
    bounty: "$250,000",
    deadline: "2026-05-01",
    fitScore: 60,
    votes: -2,
    status: "discovery",
    tags: ["Long Shot", "High Overhead"]
  },
  {
    id: 4,
    title: "State Digital Equity Capacity Grant",
    type: "State Grant",
    bounty: "$100,000",
    deadline: "2026-03-15",
    fitScore: 95,
    votes: 21,
    status: "drafting",
    tags: ["Local", "Strong Relationship"]
  }
];

const GRANT_TYPES = [
  "Federal Grant",
  "State Grant",
  "Foundation",
  "Corporate",
  "Individual Donor",
  "Other"
];

const PipelineColumns = [
  { id: 'discovery', label: 'Discovery Feed' },
  { id: 'vetting', label: 'Vetting / Sniff Test' },
  { id: 'drafting', label: 'Active Drafting' },
  { id: 'submitted', label: 'Under Review' }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('radar');
  const [resources, setResources] = useState(initialResources);
  const [showGuide, setShowGuide] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNode, setNewNode] = useState({
    title: "",
    type: "Federal Grant",
    bounty: "",
    deadline: "",
    fitScore: 50,
  });

  const handleVote = (id, increment) => {
    setResources(resources.map(res =>
      res.id === id ? { ...res, votes: res.votes + increment } : res
    ));
  };

  const commitLead = (id) => {
    setResources(resources.map(res =>
      res.id === id ? { ...res, status: 'vetting' } : res
    ));
  };

  const discardLead = (id) => {
    setResources(resources.filter(res => res.id !== id));
  };

  const handleSaveNode = () => {
    if (!newNode.title) return;
    const nextId = Math.max(...resources.map(r => r.id)) + 1;
    const newResource = {
      id: nextId,
      title: newNode.title,
      type: newNode.type,
      bounty: newNode.bounty
        ? newNode.bounty.startsWith('$') ? newNode.bounty : `$${newNode.bounty}`
        : "TBD",
      deadline: newNode.deadline || "TBD",
      fitScore: parseInt(newNode.fitScore),
      votes: 0,
      status: 'discovery',
      tags: ["New Lead", "Unvetted"]
    };
    setResources([...resources, newResource]);
    setIsAddModalOpen(false);
    setNewNode({ title: "", type: "Federal Grant", bounty: "", deadline: "", fitScore: 50 });
    setActiveTab('radar');
  };

  // ==========================================
  // VIEW: XP LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
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
                        onClick={() => setIsAuthenticated(true)}
                        className="w-full bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#003c74] text-black font-medium text-sm py-1 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_gray] active:bg-[#e0e0e0] flex items-center justify-center space-x-2"
                      >
                        <span>Log On</span>
                        <ArrowRight size={14} className="text-[#0054e3]" />
                      </button>
                    </div>
                    <div className="border-t border-white/30 pt-4">
                      <button
                        onClick={() => setIsAuthenticated(true)}
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

  // ==========================================
  // VIEW: XP MAIN DASHBOARD
  // ==========================================
  return (
    <div className="flex h-screen bg-[#3a6ea5] p-2 md:p-6 font-sans selection:bg-[#316ac5] selection:text-white">

      {/* Add Node Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#ece9d8] border border-[#0054e3] shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full max-w-md">
            {/* Modal Title Bar */}
            <div className="bg-gradient-to-r from-[#0054e3] via-[#2f8cf3] to-[#0054e3] h-7 flex items-center justify-between px-2 select-none">
              <div className="flex items-center space-x-2">
                <Plus size={14} className="text-white" />
                <span className="text-white font-bold text-xs drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">Add New Node — CivicOS</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gradient-to-b from-[#e81123] to-[#c2101e] border border-white rounded-sm w-5 h-5 flex items-center justify-center"
              >
                <X size={12} className="text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3 text-sm text-black">
              <div>
                <label className="block text-xs font-bold mb-1">Title <span className="text-[#e81123]">*</span></label>
                <input
                  type="text"
                  value={newNode.title}
                  onChange={e => setNewNode({ ...newNode, title: e.target.value })}
                  placeholder="e.g. Knight Foundation — Civic Tech"
                  className="w-full border border-[#7f9db9] px-2 py-1 text-sm focus:outline-none focus:border-[#316ac5] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Type</label>
                <select
                  value={newNode.type}
                  onChange={e => setNewNode({ ...newNode, type: e.target.value })}
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
                    value={newNode.bounty}
                    onChange={e => setNewNode({ ...newNode, bounty: e.target.value })}
                    placeholder="50,000"
                    className="w-full border border-[#7f9db9] px-2 py-1 text-sm focus:outline-none focus:border-[#316ac5] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">Deadline</label>
                  <input
                    type="date"
                    value={newNode.deadline}
                    onChange={e => setNewNode({ ...newNode, deadline: e.target.value })}
                    className="w-full border border-[#7f9db9] px-2 py-1 text-sm focus:outline-none focus:border-[#316ac5] bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Fit Score: <span className="text-[#0054e3]">{newNode.fitScore}</span></label>
                <input
                  type="range"
                  min="0" max="100"
                  value={newNode.fitScore}
                  onChange={e => setNewNode({ ...newNode, fitScore: e.target.value })}
                  className="w-full accent-[#0054e3]"
                />
                <div className="flex justify-between text-[10px] text-[#666]">
                  <span>0 — Long Shot</span>
                  <span>100 — Perfect Fit</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 pb-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-4 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNode}
                disabled={!newNode.title}
                className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-4 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <Plus size={12} className="text-[#3aa03a]" />
                <span>Add to Radar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Window */}
      <div className="w-full h-full flex flex-col bg-[#ece9d8] border border-[#0054e3] rounded-t-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">

        {/* Title Bar */}
        <header className="bg-gradient-to-r from-[#0054e3] via-[#2f8cf3] to-[#0054e3] h-8 flex items-center justify-between px-2 shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <Database size={16} className="text-white drop-shadow-md" />
            <h1 className="text-white font-bold text-sm drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">CivicOS — Discovery System</h1>
          </div>
          <div className="flex items-center space-x-1">
            <button className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-white rounded-sm w-5 h-5 flex items-center justify-center shadow-[1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_gray]">
              <div className="w-2.5 h-0.5 bg-black mt-2"></div>
            </button>
            <button className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-white rounded-sm w-5 h-5 flex items-center justify-center shadow-[1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_gray]">
              <div className="w-2.5 h-2.5 border border-black border-t-2"></div>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
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
              <button key={item} className="px-2 py-1 hover:bg-[#c1d2ee] hover:border-[#316ac5] border border-transparent rounded cursor-default text-black">{item}</button>
            ))}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-2 py-1 hover:bg-[#c1d2ee] hover:border-[#316ac5] border border-transparent rounded cursor-default text-black"
            >
              Help
            </button>
          </div>
          <div className="flex items-center space-x-3 text-black">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1 hover:bg-[#c1d2ee] border border-transparent hover:border-[#316ac5] px-2 py-0.5 rounded"
            >
              <Plus size={14} className="text-[#3aa03a]" />
              <span>Add Node</span>
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
            <Monitor size={14} className="text-[#0054e3] mr-2" />
            <span>
              My Computer \ CivicOS \ {activeTab === 'radar' ? 'Discovery Feed' : activeTab === 'pipeline' ? 'Pipeline' : 'Asset Vault'}
            </span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">

          {/* XP Sidebar */}
          <div className="w-56 bg-gradient-to-b from-[#7ba2e7] to-[#638ce0] border-r border-[#aca899] p-3 flex flex-col overflow-y-auto overflow-x-hidden shrink-0">

            {/* System Tasks */}
            <div className="mb-4 bg-white border border-[#ffffff] rounded-sm overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] px-3 py-1.5 cursor-default">
                <span className="text-[#0033cc] font-bold text-xs tracking-wide">System Tasks</span>
              </div>
              <ul className="p-2 space-y-1 bg-[#d6dff7] text-xs">
                {[
                  { id: 'radar', label: 'The Radar', Icon: Radar },
                  { id: 'pipeline', label: 'Active Pipeline', Icon: KanbanSquare },
                  { id: 'vault', label: 'Asset Vault', Icon: Database },
                ].map(({ id, label, Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => setActiveTab(id)}
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
                <p>{resources.filter(r => r.status === 'discovery').length} nodes await consensus.</p>
                <div className="border-t border-[#aca899] pt-2 mt-2">
                  <p className="text-[#666] italic">System operates strictly as is.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <main className="flex-1 bg-white overflow-y-auto p-4 md:p-6 text-black relative shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]">

            {/* Info Bar */}
            {showGuide && (
              <div className="bg-[#ffffe1] border-b border-[#aca899] p-3 shadow-sm flex items-start -mx-4 md:-mx-6 -mt-4 md:-mt-6 px-4 md:px-6 mb-6">
                <Info size={16} className="text-[#0033cc] mr-3 mt-0.5 shrink-0" />
                <div className="flex-1 text-sm">
                  <h3 className="font-bold mb-1">Information Bar</h3>
                  <p>This workspace helps you find and route funding. Review the "Fit Score", build consensus using the arrows, and click "Commit" to save a lead to your pipeline.</p>
                </div>
                <button onClick={() => setShowGuide(false)} className="text-black hover:text-[#0033cc] p-1">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* ============================== */}
            {/* TAB: THE RADAR                 */}
            {/* ============================== */}
            {activeTab === 'radar' && (
              <div className="max-w-4xl space-y-4">
                <div className="border-b border-[#aca899] pb-2 mb-4">
                  <h2 className="text-xl font-bold text-black flex items-center">
                    <Radar size={20} className="mr-2 text-[#0054e3]" />
                    Discovery Feed
                  </h2>
                  <p className="text-sm text-[#666]">Review active signals and build consensus.</p>
                </div>

                {resources.filter(r => r.status === 'discovery').length === 0 ? (
                  <div className="text-center p-12 text-[#666]">
                    <Radar size={32} className="mx-auto text-[#aca899] mb-3" />
                    <p>No active signals. The radar is clear.</p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-4 bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-4 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] flex items-center space-x-1 mx-auto"
                    >
                      <Plus size={12} className="text-[#3aa03a]" />
                      <span>Add a Node</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {resources
                      .filter(r => r.status === 'discovery')
                      .sort((a, b) => b.votes - a.votes)
                      .map(resource => (
                        <div key={resource.id} className="bg-white border border-[#aca899] p-3 flex items-start shadow-sm hover:bg-[#f8f9fa] transition-colors">

                          {/* Voting */}
                          <div className="flex flex-col items-center mr-4 w-12 shrink-0 pt-1">
                            <button
                              onClick={() => handleVote(resource.id, 1)}
                              className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] w-full py-1 flex items-center justify-center hover:bg-[#e0e0e0] active:shadow-[inset_1px_1px_2px_gray] rounded-t-sm"
                            >
                              <ChevronUp size={16} className="text-black" />
                            </button>
                            <div className="w-full border-x border-[#aca899] bg-white text-center py-1 font-bold text-sm">
                              <span className={resource.votes > 0 ? 'text-[#3aa03a]' : resource.votes < 0 ? 'text-[#e81123]' : 'text-black'}>
                                {resource.votes}
                              </span>
                            </div>
                            <button
                              onClick={() => handleVote(resource.id, -1)}
                              className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] w-full py-1 flex items-center justify-center hover:bg-[#e0e0e0] active:shadow-[inset_1px_1px_2px_gray] rounded-b-sm"
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
                              onClick={() => commitLead(resource.id)}
                              className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-2 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray] active:bg-[#e0e0e0] flex items-center justify-center space-x-1"
                            >
                              <ArrowRight size={12} className="text-[#0054e3]" />
                              <span>Commit</span>
                            </button>
                            <button
                              onClick={() => discardLead(resource.id)}
                              className="bg-gradient-to-b from-[#f3f3f3] to-[#ebebeb] border border-[#aca899] text-black font-medium text-xs py-1.5 px-2 rounded-sm shadow-[inset_1px_1px_0_white,1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_1px_1px_2px_gray] active:bg-[#e0e0e0] flex items-center justify-center space-x-1"
                            >
                              <Trash2 size={12} className="text-[#e81123]" />
                              <span>Discard</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ============================== */}
            {/* TAB: PIPELINE                  */}
            {/* ============================== */}
            {activeTab === 'pipeline' && (
              <div className="h-full flex flex-col">
                <div className="border-b border-[#aca899] pb-2 mb-4 shrink-0">
                  <h2 className="text-xl font-bold text-black flex items-center">
                    <KanbanSquare size={20} className="mr-2 text-[#0054e3]" />
                    Active Pipeline
                  </h2>
                </div>
                <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 items-start">
                  {PipelineColumns.map(col => (
                    <div key={col.id} className="w-72 flex-shrink-0 bg-[#ece9d8] border border-[#aca899] flex flex-col max-h-full shadow-sm rounded-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-[#0054e3] to-[#3a93ff] px-2 py-1 border-b border-[#aca899] flex justify-between items-center text-white">
                        <h3 className="text-xs font-bold drop-shadow-sm">{col.label}</h3>
                        <span className="bg-white text-[#0054e3] text-xs font-bold px-1.5 rounded-sm">
                          {resources.filter(r => r.status === col.id).length}
                        </span>
                      </div>
                      <div className="flex-1 p-2 overflow-y-auto space-y-2 bg-white m-1 border border-[#aca899] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
                        {resources.filter(r => r.status === col.id).map(resource => (
                          <div key={resource.id} className="bg-gradient-to-b from-[#fdfdfd] to-[#f4f4f4] border border-[#aca899] p-2 cursor-pointer hover:border-[#316ac5] shadow-sm">
                            <h4 className="font-bold text-[#0033cc] mb-2 text-sm leading-tight hover:underline">
                              {resource.title}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-black border-t border-[#dfdfdf] pt-1">
                              <span className="font-bold text-[#3aa03a]">{resource.bounty}</span>
                              <span>{resource.deadline}</span>
                            </div>
                          </div>
                        ))}
                        {resources.filter(r => r.status === col.id).length === 0 && (
                          <div className="text-center p-4 text-[#aca899] text-xs italic">Empty folder</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================== */}
            {/* TAB: VAULT                     */}
            {/* ============================== */}
            {activeTab === 'vault' && (
              <div className="max-w-4xl space-y-4">
                <div className="border-b border-[#aca899] pb-2 mb-4">
                  <h2 className="text-xl font-bold text-black flex items-center">
                    <Database size={20} className="mr-2 text-[#0054e3]" />
                    Asset Vault
                  </h2>
                  <p className="text-sm text-[#666]">Standard narratives and compliance documents.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Master Narrative', Icon: Database },
                    { label: 'Compliance & Tax', Icon: ShieldCheck },
                    { label: 'Team Bios', Icon: User },
                  ].map(({ label, Icon }) => (
                    <button
                      key={label}
                      className="flex flex-col items-center justify-center p-4 hover:bg-[#ebf3fd] border border-transparent hover:border-[#316ac5] rounded-sm group focus:outline-none focus:bg-[#c1d2ee]"
                    >
                      <div className="w-16 h-16 mb-2 bg-gradient-to-b from-[#ffdb58] to-[#e6b800] rounded-sm relative shadow-sm border border-[#cc9900] flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-1/3 h-2 bg-[#ffdb58] border-t border-l border-r border-[#cc9900] -mt-2 rounded-t-sm"></div>
                        <Icon size={24} className="text-[#997300]" />
                      </div>
                      <span className="text-sm text-black group-hover:bg-[#316ac5] group-hover:text-white px-1">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
