# Changelog

All notable changes to CivicOS are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

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
