# CivicOS — Session Checkpoint

**Date:** 2026-02-22
**Version:** v0.0.1
**Status:** Building ✓ — Deployed to GitHub with full open-source infrastructure

---

## What Is CivicOS?

A React web app styled as a Windows XP desktop interface for nonprofit/civic organizations to discover, vet, and track funding opportunities (grants, foundations, government programs).

**Tagline:** *"Vibe code a government."*
**GitHub:** <https://github.com/FogSift/CivicOS>
**Product vocab:** The Plaza / The Builder / The Vault (no blockchain, no Treasury)

---

## What We Built This Session

### 1. Full Project Scaffold

Started from a nearly empty GitHub repo (just LICENSE + README). Built:

- `npm init` → installed vite, react, react-dom, lucide-react, tailwindcss, xp.css
- `vite.config.js` with `__APP_VERSION__` build-time define
- `index.html`, `src/main.jsx`, `src/index.css`

### 2. Decomposed 633-line App.jsx → 12 focused files

**Before:** One monolithic component
**After:** Thin orchestrator + hook + constants + 7 components + 3 views

| File | @fileId | Purpose |
| --- | --- | --- |
| `src/App.jsx` | d0b9371e | ~75-line orchestrator |
| `src/constants.js` | 455d9f34 | Seed data + column definitions |
| `src/hooks/useResources.js` | 45bdc4b8 | All resource state + handlers |
| `src/components/AuthScreen.jsx` | 264889e0 | XP login screen |
| `src/components/AppChrome.jsx` | 58b87fd2 | Title bar + toolbar + address bar |
| `src/components/TaskPane.jsx` | cd9afea1 | Left nav sidebar |
| `src/components/InfoBar.jsx` | 46c41fb0 | Dismissible yellow IE-style guide bar |
| `src/components/AddNodeModal.jsx` | 7dc71355 | Add new funding lead modal |
| `src/components/GrantCard.jsx` | c4b32d6a | Single voting card |
| `src/components/KanbanColumn.jsx` | 273aecc3 | Single kanban column |
| `src/views/PlazaView.jsx` | 60be1925 | Discovery feed (The Plaza) |
| `src/views/BuilderView.jsx` | 5efdf478 | Kanban board (The Builder) |
| `src/views/VaultView.jsx` | 13132db4 | Document vault (The Vault) |

### 3. Version System

- `package.json` = single source of truth for version number
- `src/version.js` imports from `../package.json` — no hardcoding
- `__APP_VERSION__` available as global at build time
- Tagged `v0.0.1`, created GitHub release

### 4. Open Source Infrastructure

- `CONTRIBUTING.md` — @fileId rules, Tailwind vs XP.css styling guide, AI contributor notes
- `CHANGELOG.md` — Keep a Changelog format
- `scripts/new-file.js` — scaffold script: generates UUID + file header boilerplate
- `.github/CODEOWNERS` — gates package.json, version.js, CHANGELOG.md to @ctavolazzi
- `.github/ISSUE_TEMPLATE/` — bug report + feature request templates
- `.github/pull_request_template.md`
- `.markdownlint.json`
- Full `README.md`

### 5. XP.css Integration

- `npm install xp.css`
- Added `@import "xp.css/dist/XP.css"` to `src/index.css` after Tailwind
- **Rule:** Tailwind for layout/spacing; XP.css for new component chrome. Never mix on same element.
- **No refactoring** of existing Tailwind components — additive only
- Build passes with 4 harmless warnings (XP.css internal pseudo-element selectors)

### 6. Product Decisions Made

- Removed Treasury Escrow entirely (from sidebar, README, CHANGELOG, issue templates)
- Removed Lock + Network icon imports
- Renamed tabs: The Radar → **The Plaza**, Active Pipeline → **The Builder**, Asset Vault → **The Vault**
- Named components after function (AppChrome, TaskPane), not aesthetic (XPChrome, XPSidebar)

---

## Build Status

```bash
npm run build   ✓ passes
```

4 warnings from XP.css's own CSS (`:not([value]):before:not([value])`). Harmless.
**Fix available** (not yet applied): add `build: { cssMinify: 'esbuild' }` to `vite.config.js`

---

## Tech Stack

| Layer | Tool |
| --- | --- |
| Framework | React 19 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 + XP.css |
| Icons | lucide-react |
| Version | Semantic Versioning via package.json |

---

## Immediate Next Steps

- [ ] Silence build warnings: add `build: { cssMinify: 'esbuild' }` to `vite.config.js`
- [ ] Add XP.css status bar component at bottom of app window (version + node count)
- [ ] Right-click context menus on GrantCard (Commit / Discard / View Details)
- [ ] Threaded comments per grant card
- [ ] Grants.gov API integration (replace seed data with real grants)
- [ ] Draggable windows (pop grant cards into movable XP-style windows)

---

## Known Debt

- No tests
- No CI pipeline
- Seed data only (no real backend/API)
- VaultView is static (file upload on roadmap)
- `src/version.js` `release.date` needs manual update on each release

---

## Key Rules to Remember

1. Every new `src/` file needs a `@fileId` UUID header — use `node scripts/new-file.js`
2. Version lives in `package.json` only — never hardcode it elsewhere
3. New components use XP.css for chrome; existing components keep Tailwind — don't mix
4. Don't commit unless explicitly asked
5. Update `CHANGELOG.md` under `[Unreleased]` for any user-visible change
