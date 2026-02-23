/**
 * @fileId d0b9371e-cfe6-4e43-b1d5-ff04bd840a86
 * @module CivicOS/App
 * @description Root orchestrator — manages top-level state and routes between views.
 *              All UI lives in components/ and views/. Keep this file thin.
 */

import React, { useState } from 'react';
import { useResources } from './hooks/useResources.js';
import { useTheme }     from './hooks/useTheme.js';
import AuthScreen    from './components/AuthScreen.jsx';
import AppChrome     from './components/AppChrome.jsx';
import TaskPane      from './components/TaskPane.jsx';
import InfoBar       from './components/InfoBar.jsx';
import AddNodeModal  from './components/AddNodeModal.jsx';
import StatusBar     from './components/StatusBar.jsx';
import PlazaView     from './views/PlazaView.jsx';
import BuilderView   from './views/BuilderView.jsx';
import VaultView     from './views/VaultView.jsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab]             = useState('plaza');
  const [showGuide, setShowGuide]             = useState(true);
  const [isAddModalOpen, setIsAddModalOpen]   = useState(false);

  // Hooks must be called unconditionally (before any early return)
  const { theme, setTheme } = useTheme();
  const { resources, handleVote, commitLead, discardLead, handleSaveNode } = useResources();

  const discoveryCount = resources.filter(r => r.status === 'discovery').length;

  if (!isAuthenticated) {
    return <AuthScreen onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[var(--color-desktop-bg)] p-2 md:p-6 font-sans selection:bg-[var(--color-accent-selected)] selection:text-white">

      {isAddModalOpen && (
        <AddNodeModal
          onSave={(node) => handleSaveNode(node, () => {
            setIsAddModalOpen(false);
            setActiveTab('plaza');
          })}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Application Window */}
      <div className="w-full h-full flex flex-col bg-[var(--color-window-bg)] border border-[var(--color-window-border)] rounded-t-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">

        <AppChrome
          activeTab={activeTab}
          onLogOff={() => setIsAuthenticated(false)}
          onAddLead={() => setIsAddModalOpen(true)}
          onToggleGuide={() => setShowGuide(v => !v)}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="flex-1 flex overflow-hidden">
          <TaskPane
            activeTab={activeTab}
            onTabChange={setActiveTab}
            discoveryCount={discoveryCount}
          />

          <main className="flex-1 bg-[var(--color-panel-bg)] overflow-y-auto p-4 md:p-6 text-[var(--color-text-primary)] relative shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]">
            {showGuide && <InfoBar onDismiss={() => setShowGuide(false)} />}

            {activeTab === 'plaza' && (
              <PlazaView
                resources={resources}
                onVote={handleVote}
                onCommit={commitLead}
                onDiscard={discardLead}
                onAddLead={() => setIsAddModalOpen(true)}
              />
            )}
            {activeTab === 'builder' && (
              <BuilderView resources={resources} />
            )}
            {activeTab === 'vault' && (
              <VaultView />
            )}
          </main>
        </div>

        <StatusBar nodeCount={resources.length} />
      </div>
    </div>
  );
}
