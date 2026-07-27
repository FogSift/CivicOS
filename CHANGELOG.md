# Changelog

All notable changes to CivicOS are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **NovaSystem**: the Nova Process as a desktop app (desktop icon + Start
  Menu). Type a decision, watch three 8-bit agents work it through UNPACK,
  ANALYZE, SYNTHESIZE, and get back a list of asks with an owner on each.
  - **DCE** reads scope and sequence, **CAE** reads what breaks, **SME** reads
    what the work needs. Each speaks in turn on a CRT stage.
  - The reasoning is in `src/apps/nova/novaProcess.js` as pure functions:
    it sorts your text into requirements, unknowns, risks, timing, cost, and
    stakeholders, then runs three fixed lenses over that structure. Same input
    always gives the same output.
  - **No model call and no network.** The status line says so rather than
    implying an agent is thinking. `runNovaProcess` is the seam for the local
    AI gateway in APPS.md when it exists.
  - The specification score measures how completely the problem is *stated*,
    not how good the answer is, and the UI says that too. A high score on a
    bad idea is still a bad idea.
  - **Save to ledger** writes a `nova.run` event, so a Nova run shows up in the
    Event Viewer alongside every other civic action.
  - **Agent journal bridge** (`src/apps/nova/journalBridge.js`). SimpleAgentOS
    and NovaSystem share one PocketBase collection so either can ask what the
    other learned; CivicOS was the one system with no way in, which is why a
    cross-project view of that journal only ever showed two projects. Saving a
    run now also mirrors it there, and the view shows three.
    - **Off unless `VITE_NOVA_JOURNAL=1`.** A civic desktop should not quietly
      POST what a user typed to a local service they did not ask to run.
    - Strictly after the ledger write, never awaited, and it cannot throw. The
      ledger stays the record; the journal is an index onto it. If the mirror
      fails the status line says so rather than hiding it, because a silent
      mirror failure is how a memory ends up with a hole nobody notices.
    - The status line no longer claims "no network" when the bridge is on. It
      still says there is no model call, because there still isn't one.
  - Agent sprites are 4-frame idle loops generated with pixellab.ai, played by
    stepping `background-position-x`. If a spritesheet is missing the app falls
    back to a CSS drawn avatar, so a missing asset never breaks the window.
    All motion is disabled under `prefers-reduced-motion`.

- **DOOM** — playable from the desktop (icon + Start Menu), single-player,
  no network required. Vendored [cloudflare/doom-wasm](https://github.com/cloudflare/doom-wasm)
  (Chocolate Doom compiled to WebAssembly, GPL) with the id Software
  shareware WAD; the compiled `.wasm`/`.js` were taken from Cloudflare's own
  live demo rather than compiling locally, so this needs no Emscripten,
  Docker, or any other tooling to build. Boots straight into E1M1.

### Fixed

- Cognitive Diagnostics: `theme-init.js`, `white-rabbit.js`, and `favicon.png`
  were 404ing (or silently served CivicOS's own SPA HTML instead) because
  Vite's `/workflow-engine` proxy rule is a prefix match — it coincidentally
  swept up `workflow-engine.js`/`workflow-engine-styles.css` by name
  collision but not these sibling assets. Added explicit proxy rules for
  each.

### Added

- **Cognitive Diagnostics** app (desktop icon + Start Menu) — first-class
  CivicOS window for FogSift's Workflow Engine running in cognitive mode
  (`/workflow-engine?cognitive=1`), the Empirica cognitive-suite playback
  and Oracle recommendation surface already registered in the CivicOS app
  manifest registry (`cognitive-diagnostics.json`) but previously reachable
  only as a buried link inside the generic Ops Center list. No new external
  code — the Workflow Engine is FogSift's own app, already proxied through
  the existing `/workflow-engine` route.

- **Builder pipeline is now interactive** — right-click a card to Advance
  or Send back through Discovery → Vetting → Drafting → Submitted (disabled
  at either end); previously the kanban board was display-only. Sending a
  vetting card back correctly returns it to the Plaza feed.
- **Plaza status bar and card menu** — the Plaza now shows a live status
  bar (version, lead count); grant cards gained a right-click Commit/
  Discard menu alongside the existing buttons (the February roadmap item)
- **Vault folder navigation** — double-clicking a folder now opens it (Back
  and breadcrumb) and lists kernel-backed documents, with an honest "This
  folder is empty" state (nothing writes documents yet — upload stays out
  of scope, but any future writer surfaces here for free)
- **Search is now submit-driven** — typing alone no longer changes results;
  pressing Enter or clicking Search runs it, making the button (previously
  vestigial) do real work; category sidebar links show an honest disabled
  state instead of looking clickable
- **My Computer sidebar** — tasks now open real windows (Change a setting →
  Control Panel, Network Places → Ops Center, My Documents → Vault) or show
  an honest disabled state (Add/remove programs, Shared Documents); "View
  system info" opens a real System Properties dialog (version, storage
  backend, event count, browser)
- **Control Panel: five real panels** — Sounds (bound to the same settings
  as the tray), Network (live connection status + FogSift adapter health
  check with a Refresh button), User Accounts (rename, reflected in the
  Start Menu), Security Center (storage backend, event count, session
  user), and Appearance (aliases Display — no duplicate panel). Sidebar
  links and Apply buttons that did nothing now show honest disabled states;
  OK returns to the category grid.
- **Live network and volume tray** — Wifi/WifiOff and Volume2/VolumeX icons
  now reflect real `navigator.onLine` state and the real volume setting;
  system tray clock now ticks every second instead of freezing at open
  time; volume slider and mute state persist via a new `useSettings` hook
  and drive real WebAudio open/close beeps on every window
- **AuthScreen logon identity** — the email field now drives who you log on
  as (Start Menu header, ledger `session.logon`/`user.rename` events);
  clicking the user tile logs on as System Administrator; Cancel clears the
  field; Turn Off shows a real XP shutdown screen and logs `session.logoff`
- Kernel snapshot keys `settings` and `vault`, and ledger event types
  `resource.move`, `settings.change`, `user.rename` — registered ahead of
  the packages that use them
- `ContextMenu` now supports `item.disabled` (muted, inert, `aria-disabled`)

- **Solitaire and Minesweeper** — vendored from open source
  ([jhatzimalis/solitaire](https://github.com/jhatzimalis/solitaire) MIT,
  [sylhare/Minesweeper](https://github.com/sylhare/Minesweeper) GPL-3.0),
  served as static apps under `public/apps/` and mounted via a new generic
  `IframeApp` component; desktop icons + Start Menu entries. Source audited
  in full before vendoring (see `THIRD_PARTY_LICENSES.md`).
- **Paint** — vendored [1j01/jspaint](https://github.com/1j01/jspaint) (MIT),
  scoped to just its browser app (Electron build, Discord Activity, and
  tests excluded); desktop icon + Start Menu entry.
- **Notepad now has real menus** — File (New/Save/Exit), Edit (Select All/
  Copy/Cut/Paste), Format (Word Wrap), View (Status Bar), Help (About), via
  the vendored `os-gui` MenuBar.js library rather than a decorative fake
  menu bar. Live Ln/Col tracking. Content persists to the kernel.

### Fixed

- Kernel snapshot cache staleness: `saveSnapshot` now refreshes the
  in-memory snapshot cache, so closing and reopening a window (e.g.
  Notepad) in the same session reflects the latest saved state instead of
  the stale boot-time snapshot.

- **Kernel v0** (`src/kernel/`) — storage adapter with hand-rolled IndexedDB
  backend (`civicos-kernel` DB: `kv` snapshots + append-only `events` ledger)
  and in-memory fallback; the adapter interface is the contract for a future
  PGLite backend
- **CivicProvider** — boot sequence (BOOTING → READY) with XP-style boot
  screen; hydrates persisted state before the desktop mounts; `useKernel()`
  context hook
- **Civic event ledger** — append-only log of resource votes/commits/
  discards/adds, window open/close, theme changes, logon/logoff, and kernel
  boots
- **Persistence** — resources, logon session, and window layout now survive
  reload; the OS remembers
- **Event Viewer** app (Start Menu → System) — filter by type, live count,
  JSON export, storage-backend status bar
- **Full browser OS rebuild** — replaced the single-window tab UI with a complete
  Windows XP-style desktop:
  - `useWindowManager` hook — open/close/minimize/maximize/focus/drag with z-index
  - `OsWindow` — draggable windows with XP.css chrome
  - `Desktop` — Bliss-style wallpaper, desktop icon grid, renders all windows
  - `Taskbar` — Start button, per-window taskbar buttons, live clock system tray
  - `StartMenu` — two-column XP layout (pinned apps + system tools)
  - `SystemTrayPanel` — theme switcher, volume, network status from clock click
  - Built-in apps: Search, Control Panel, Help, Notepad, My Computer
- **Theme system** — `useTheme` hook + `ThemeSwitcher`; all components theme-aware
  via CSS variables (Classic XP and Crème XP)
- **StatusBar** and **ContextMenu** components
- **Ops Center** (`OpsCenterView`) — loads the CivicOS app registry and manifests
  from `/api/apps/*` and reports per-app namespace health checks
- **5050-first adapter mode** — dev server pinned to `localhost:5050` (strict),
  proxying `/api` and `/workflow-engine` to a FogSift adapter
  (`FOGSIFT_API_ORIGIN`, default `localhost:5051`)
- `npm run check:5050` — validates required API namespaces are reachable
  through CivicOS (`scripts/check-5050-namespaces.mjs`)

### Changed

- **Decomposed monolithic App.jsx** into focused components and views.
  App.jsx is now a thin orchestrator (~70 lines).
- **Renamed modules** to canonical product vocabulary:
  - The Radar → **The Plaza** (tab id: `plaza`)
  - Active Pipeline → **The Builder** (tab id: `builder`)
  - Asset Vault → **The Vault**
  - "Add Node" → **"Add Lead"**
- **New file structure**: `src/hooks/`, `src/components/`, `src/views/`
- All resource state and handlers extracted to `src/hooks/useResources.js`
- Seed data and constants extracted to `src/constants.js`
- Component naming: `XPChrome` → `AppChrome`, `XPSidebar` → `TaskPane`
  (naming by function, not aesthetic inspiration)

### Removed

- Treasury Escrow cut from roadmap — no blockchain, no token economy, no escrow.
  Governance Rules and Node Map remain as planned future modules.
- "Sync Network" disabled toolbar button removed from UI
- Locked Network Modules sidebar section removed — nav is now
  strictly The Radar, Active Pipeline, Asset Vault
- Orphaned pre-OS-shell components (`AppChrome`, `TaskPane`, `InfoBar`,
  `ThemeSwitcher`) — superseded by the browser-OS rebuild; theme switching
  lives in Control Panel → Display and the system tray; never imported
  since the rebuild

---

## [0.0.1] — 2026-02-22 · Super Early Bird Special

### Added

- XP-themed login screen with demo workspace entry
- Discovery Feed (The Radar) — upvote/downvote consensus voting on funding leads
- Active Pipeline kanban board — 4 columns
  (Discovery → Vetting → Drafting → Under Review)
- Asset Vault — classic folder icon view for org documents
  (Master Narrative, Compliance & Tax, Team Bios)
- Add Node modal — submit new funding leads with title, type, bounty,
  deadline, and fit score slider
- `src/version.js` — version manager, imports version from package.json
- `CHANGELOG.md`, `CONTRIBUTING.md`, `.github/` templates, `scripts/new-file.js`
- Stable `@fileId` UUID headers on all source files

### Tech

- React 19 + Vite 7 + Tailwind CSS v4 + lucide-react

---

[Unreleased]: https://github.com/FogSift/CivicOS/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/FogSift/CivicOS/releases/tag/v0.0.1
