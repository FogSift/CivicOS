/**
 * @fileId d0b9371e-cfe6-4e43-b1d5-ff04bd840a86
 * @module CivicOS/App
 * @description Root orchestrator — full browser OS built on XP.css chrome.
 *              Auth → Desktop with draggable windows.
 */

import React, { useState, useCallback } from 'react';
import { useKernel }         from './kernel/CivicProvider.jsx';
import { useResources }      from './hooks/useResources.js';
import { useTheme }          from './hooks/useTheme.js';
import { useWindowManager }  from './hooks/useWindowManager.js';
import AuthScreen            from './components/AuthScreen.jsx';
import AddNodeModal          from './components/AddNodeModal.jsx';
import Desktop               from './os/Desktop.jsx';

// App views
import PlazaView        from './views/PlazaView.jsx';
import BuilderView      from './views/BuilderView.jsx';
import VaultView        from './views/VaultView.jsx';
import OpsCenterView    from './views/OpsCenterView.jsx';

// Standalone apps
import NotepadApp       from './apps/NotepadApp.jsx';
import MyComputerApp    from './apps/MyComputerApp.jsx';
import SearchApp        from './apps/SearchApp.jsx';
import ControlPanelApp  from './apps/ControlPanelApp.jsx';
import HelpApp          from './apps/HelpApp.jsx';
import EventViewerApp   from './apps/EventViewerApp.jsx';
import IframeApp        from './apps/IframeApp.jsx';

const APP_META = {
  plaza:       { title: 'The Plaza — CivicOS',       appId: 'plaza'       },
  builder:     { title: 'The Builder — CivicOS',     appId: 'builder'     },
  vault:       { title: 'The Vault — CivicOS',        appId: 'vault'       },
  ops:         { title: 'Ops Center — CivicOS',       appId: 'ops'         },
  notepad:     { title: 'Notepad',                    appId: 'notepad'     },
  computer:    { title: 'My Computer',                appId: 'computer'   },
  search:      { title: 'Search Results',             appId: 'search'     },
  settings:    { title: 'Control Panel',              appId: 'settings'   },
  events:      { title: 'Event Viewer',               appId: 'events'     },
  help:        { title: 'Help and Support',           appId: 'help'       },
  solitaire:   { title: 'Solitaire',                  appId: 'solitaire'  },
  minesweeper: { title: 'Minesweeper',                appId: 'minesweeper'},
  paint:       { title: 'Paint',                      appId: 'paint'      },
};

const SESSION_USER = 'System Administrator';

export default function App() {
  const { snapshots, saveSnapshot, logEvent } = useKernel();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => snapshots.session?.authenticated ?? false
  );
  const [isAddModalOpen, setIsAddModalOpen]   = useState(false);

  const handleLogon = useCallback(() => {
    setIsAuthenticated(true);
    saveSnapshot('session', { authenticated: true, user: SESSION_USER });
    logEvent('session.logon', { user: SESSION_USER });
  }, [saveSnapshot, logEvent]);

  const handleLogoff = useCallback(() => {
    setIsAuthenticated(false);
    saveSnapshot('session', { authenticated: false, user: SESSION_USER });
    logEvent('session.logoff', {});
  }, [saveSnapshot, logEvent]);

  const { theme, setTheme } = useTheme();
  const { resources, handleVote, commitLead, discardLead, handleSaveNode } = useResources();
  const {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimize,
    restore,
    maximize,
    moveWindow,
  } = useWindowManager();

  const openApp = useCallback((appId) => {
    const meta = APP_META[appId];
    if (!meta) return;
    openWindow(appId, meta.appId, meta.title);
  }, [openWindow]);

  const renderApp = useCallback((win) => {
    switch (win.appId) {
      case 'plaza':
        return (
          <PlazaView
            resources={resources}
            onVote={handleVote}
            onCommit={commitLead}
            onDiscard={discardLead}
            onAddLead={() => setIsAddModalOpen(true)}
          />
        );
      case 'builder':
        return <BuilderView resources={resources} />;
      case 'vault':
        return <VaultView />;
      case 'ops':
        return <OpsCenterView />;
      case 'notepad':
        return <NotepadApp />;
      case 'computer':
        return <MyComputerApp onOpenApp={openApp} />;
      case 'search':
        return <SearchApp onOpenApp={openApp} />;
      case 'settings':
        return <ControlPanelApp theme={theme} setTheme={setTheme} />;
      case 'events':
        return <EventViewerApp />;
      case 'help':
        return <HelpApp />;
      case 'solitaire':
        return <IframeApp src="/apps/solitaire/index.html" title="Solitaire" />;
      case 'minesweeper':
        return <IframeApp src="/apps/minesweeper/index.html" title="Minesweeper" />;
      case 'paint':
        return <IframeApp src="/apps/jspaint/index.html" title="Paint" />;
      default:
        return <div style={{ padding: 8 }}>Unknown app: {win.appId}</div>;
    }
  }, [resources, handleVote, commitLead, discardLead, openApp, theme, setTheme]);

  if (!isAuthenticated) {
    return <AuthScreen onAuth={handleLogon} />;
  }

  return (
    <>
      {isAddModalOpen && (
        <AddNodeModal
          onSave={(node) => handleSaveNode(node, () => setIsAddModalOpen(false))}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      <Desktop
        windows={windows}
        onOpenApp={openApp}
        onCloseWindow={closeWindow}
        onMinimizeWindow={minimize}
        onMaximizeWindow={maximize}
        onFocusWindow={focusWindow}
        onMoveWindow={moveWindow}
        onRestoreWindow={restore}
        onLogOff={handleLogoff}
        renderApp={renderApp}
        theme={theme}
        setTheme={setTheme}
      />
    </>
  );
}
