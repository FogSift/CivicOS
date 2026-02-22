# CivicOS — Session Recap
**Date:** 2026-02-22

---

## What Is This?

**CivicOS** is a React web app themed as a Windows XP-style desktop interface for nonprofit/civic organizations to discover, vet, and track funding opportunities (grants, foundations, government programs).

Tagline: *"Vibe code a government."*

GitHub: https://github.com/FogSift/CivicOS

---

## Two Versions Were Built

### Version 1 — ResourceOS
- XP-style login screen with blue gradient + "Log On" button
- Main dashboard with Windows XP chrome (title bar, toolbar, address bar, sidebar)
- **Three tabs:**
  - **The Radar** — Discovery feed with upvote/downvote spin buttons, Commit/Discard actions
  - **Active Pipeline** — Kanban board with 4 columns (Discovery → Vetting → Drafting → Under Review)
  - **Asset Vault** — Classic folder icon view (Master Narrative, Compliance & Tax, Team Bios)
- Branding: "ResourceOS"

### Version 2 — CivicOS (current)
Everything from V1, plus:
- Renamed to **CivicOS** throughout
- **Add Node modal** — users can add new funding leads (title, type, bounty, deadline, fit score)
- **Locked Network Modules** in sidebar (grayed out, with lock icons):
  - Governance Rules
  - Treasury Escrow
  - Node Map
- **Disabled "Sync Network" toolbar button** (planned feature placeholder)
- Login email placeholder updated to `admin@civic-os.network`
- `Lock` and `Network` icons added from lucide-react

---

## Current State of the Repo

The GitHub repo (`FogSift/CivicOS`) was just created and is **nearly empty** — only a `LICENSE` and `README.md`. No code has been pushed yet.

The full CivicOS component (V2) exists only in the chat session so far.

---

## Next Steps (To Do)

- [ ] Scaffold a React/Vite project in the repo
- [ ] Drop in the CivicOS V2 component as `src/App.jsx`
- [ ] Add Tailwind CSS + lucide-react dependencies
- [ ] Push initial working build to GitHub
- [ ] Unlock and build out Network Modules (Governance, Treasury, Node Map)
- [ ] Wire up real data / backend

---

## Tech Stack

- React (useState)
- Tailwind CSS (utility classes, custom XP colors)
- lucide-react (icons)
- Vite (assumed build tool)

---

## Key Design Decisions

- **Windows XP aesthetic** — intentional retro-civic feel, inset shadows, gradient title bars, beige/cream backgrounds
- **"Fit Score"** — 0–100 rating for how well a grant matches the org
- **Consensus voting** — team upvotes/downvotes signals before committing to pipeline
- **Locked modules** signal future roadmap without breaking the current UI
