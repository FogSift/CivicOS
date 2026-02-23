# CivicOS

> Vibe code a government.

CivicOS is an open source civic infrastructure layer for organizations that route public resources — grants, contracts, donations, and community capital — through transparent, collaborative workflows.

The interface is intentionally retro. The mission is not.

**Current release:** v0.0.1 — Super Early Bird Special · `alpha`

---

## What It Does

CivicOS gives civic orgs, nonprofits, and community groups a shared workspace to:

| Module | Status | Description |
| --- | --- | --- |
| **The Plaza** | ✅ Live | Discovery feed — surface funding leads, build consensus via voting |
| **The Builder** | ✅ Live | Kanban board — track leads from Sniff Test → Drafting → Under Review |
| **The Vault** | ✅ Live | Store org documents — narratives, compliance, team bios |
| **Governance Rules** | 🔒 Planned | Decision frameworks for multi-stakeholder orgs |
| **Node Map** | 🔒 Planned | Peer network visualization across orgs |

---

## Quickstart

```bash
git clone https://github.com/FogSift/CivicOS.git
cd CivicOS
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **Enter Demo Workspace**.

---

## Tech Stack

- [React 19](https://react.dev) — UI
- [Vite 7](https://vite.dev) — build tooling
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [lucide-react](https://lucide.dev) — icons

No backend. No database. Pure local state for now — persistence and networking are on the roadmap.

---

## Project Structure

```text
CivicOS/
├── src/
│   ├── App.jsx              # Root orchestrator — state + routing only
│   ├── constants.js         # Seed data, grant types, pipeline columns
│   ├── version.js           # Release metadata (imports version from package.json)
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind base
│   ├── hooks/
│   │   └── useResources.js  # All resource state + handlers
│   ├── components/
│   │   ├── AuthScreen.jsx   # Login screen
│   │   ├── AppChrome.jsx    # Title bar, toolbar, address bar
│   │   ├── TaskPane.jsx     # Left navigation sidebar
│   │   ├── InfoBar.jsx      # Dismissible guide bar
│   │   ├── AddNodeModal.jsx # Add new lead modal
│   │   ├── GrantCard.jsx    # Single lead card (used in PlazaView)
│   │   └── KanbanColumn.jsx # Single kanban column (used in BuilderView)
│   └── views/
│       ├── PlazaView.jsx    # The Plaza — discovery feed
│       ├── BuilderView.jsx  # The Builder — kanban board
│       └── VaultView.jsx    # The Vault — document storage
├── scripts/
│   └── new-file.js          # Scaffold new files with stable @fileId UUID
├── .github/
├── CHANGELOG.md
├── CONTRIBUTING.md
└── package.json             # Single source of truth for version number
```

---

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) first — especially the sections on **@fileId** (every file has a permanent UUID) and the **versioning workflow**.

Short version:

```bash
# New file
node scripts/new-file.js src/components/MyComponent.jsx "What it does"

# Release
npm version patch        # bumps package.json + creates git tag
# update src/version.js and CHANGELOG.md
git push origin main --tags
gh release create v{version}
```

Both human and AI contributors are welcome. The rules are the same for everyone.

---

## Versioning

`package.json` is the single source of truth for the version number. See [CHANGELOG.md](CHANGELOG.md) for the full history.

| Bump | When |
| --- | --- |
| `patch` | Bug fix, copy tweak, minor polish |
| `minor` | New feature, unlock a module |
| `major` | Breaking change, architectural shift |

---

## License

ISC © [FogSift](https://github.com/FogSift)
