# Changelog

All notable changes to CivicOS are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

_Nothing yet._

---

## [0.0.1] — 2026-02-22 · Super Early Bird Special

### Added
- XP-themed login screen with demo workspace entry
- Discovery Feed (The Radar) — upvote/downvote consensus voting on funding leads
- Active Pipeline kanban board — 4 columns (Discovery → Vetting → Drafting → Under Review)
- Asset Vault — classic folder icon view for org documents (Master Narrative, Compliance & Tax, Team Bios)
- Add Node modal — submit new funding leads with title, type, bounty, deadline, and fit score slider
- Locked Network Modules sidebar — Governance Rules, Treasury Escrow, Node Map (planned features)
- `src/version.js` — version manager module, single source of truth for release metadata
- `CHANGELOG.md`, `CONTRIBUTING.md`, `.github/` templates, `scripts/new-file.js`
- Stable `@fileId` UUID headers on all source files

### Tech
- React 19 + Vite 7 + Tailwind CSS v4 + lucide-react

---

[Unreleased]: https://github.com/FogSift/CivicOS/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/FogSift/CivicOS/releases/tag/v0.0.1
