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
import { useSettings }       from './hooks/useSettings.js';
import { playOpenBeep, playCloseBeep } from './os/sounds.js';
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
import NovaSystemApp    from './apps/NovaSystemApp.jsx';
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
  nova:        { title: 'NovaSystem: Nova Process',   appId: 'nova'       },
  help:        { title: 'Help and Support',           appId: 'help'       },
  solitaire:   { title: 'Solitaire',                  appId: 'solitaire'  },
  minesweeper: { title: 'Minesweeper',                appId: 'minesweeper'},
  paint:       { title: 'Paint',                      appId: 'paint'      },
  cognitive:   { title: 'Cognitive Diagnostics',       appId: 'cognitive'  },
  doom:        { title: 'DOOM',                       appId: 'doom'       },
};

const SESSION_USER = 'System Administrator';

export default function App() {
  const { snapshots, saveSnapshot, logEvent } = useKernel();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => snapshots.session?.authenticated ?? false
  );
  const [user, setUser] = useState(() => snapshots.session?.user ?? SESSION_USER);
  const [isAddModalOpen, setIsAddModalOpen]   = useState(false);

  // A bare onClick={onAuth} would pass a MouseEvent as nextUser -- guard for that.
  const handleLogon = useCallback((nextUser) => {
    const resolvedUser = (typeof nextUser === 'string' && nextUser.trim()) ? nextUser.trim() : SESSION_USER;
    setUser(resolvedUser);
    setIsAuthenticated(true);
    saveSnapshot('session', { authenticated: true, user: resolvedUser });
    logEvent('session.logon', { user: resolvedUser });
  }, [saveSnapshot, logEvent]);

  const handleLogoff = useCallback(() => {
    setIsAuthenticated(false);
    saveSnapshot('session', { authenticated: false, user });
    logEvent('session.logoff', {});
  }, [saveSnapshot, logEvent, user]);

  const handleRenameUser = useCallback((nextName) => {
    const trimmed = nextName.trim();
    if (!trimmed || trimmed === user) return;
    logEvent('user.rename', { from: user, to: trimmed });
    setUser(trimmed);
    saveSnapshot('session', { authenticated: true, user: trimmed });
  }, [user, logEvent, saveSnapshot]);

  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { resources, handleVote, commitLead, discardLead, moveLead, handleSaveNode } = useResources();
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
    if (settings.uiSounds) playOpenBeep(settings.volume);
  }, [openWindow, settings]);

  const handleCloseWindow = useCallback((id) => {
    if (settings.uiSounds) playCloseBeep(settings.volume);
    closeWindow(id);
  }, [closeWindow, settings]);

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
        return <BuilderView resources={resources} onMoveLead={moveLead} />;
      case 'vault':
        return <VaultView />;
      case 'ops':
        return <OpsCenterView />;
      case 'notepad':
        return <NotepadApp onClose={() => handleCloseWindow(win.id)} />;
      case 'computer':
        return <MyComputerApp onOpenApp={openApp} />;
      case 'search':
        return <SearchApp onOpenApp={openApp} />;
      case 'settings':
        return (
          <ControlPanelApp
            theme={theme}
            setTheme={setTheme}
            settings={settings}
            updateSettings={updateSettings}
            user={user}
            onRenameUser={handleRenameUser}
          />
        );
      case 'events':
        return <EventViewerApp />;
      case 'nova':
        return <NovaSystemApp />;
      case 'help':
        return <HelpApp />;
      case 'solitaire':
        return <IframeApp src="/apps/solitaire/index.html" title="Solitaire" />;
      case 'minesweeper':
        return <IframeApp src="/apps/minesweeper/index.html" title="Minesweeper" />;
      case 'paint':
        return <IframeApp src="/apps/jspaint/index.html" title="Paint" />;
      case 'cognitive':
        return <IframeApp src="/workflow-engine?cognitive=1" title="Cognitive Diagnostics" />;
      case 'doom':
        return <IframeApp src="/apps/doom/index.html" title="DOOM" />;
      default:
        return <div style={{ padding: 8 }}>Unknown app: {win.appId}</div>;
    }
  }, [resources, handleVote, commitLead, discardLead, moveLead, openApp, theme, setTheme, handleCloseWindow, settings, updateSettings, user, handleRenameUser]);

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
        onCloseWindow={handleCloseWindow}
        onMinimizeWindow={minimize}
        onMaximizeWindow={maximize}
        onFocusWindow={focusWindow}
        onMoveWindow={moveWindow}
        onRestoreWindow={restore}
        onLogOff={handleLogoff}
        renderApp={renderApp}
        theme={theme}
        setTheme={setTheme}
        username={user}
        settings={settings}
        updateSettings={updateSettings}
      />
    </>
  );
}
