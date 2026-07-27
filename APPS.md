# CivicOS — The Complete App Catalog

**Status:** Planning document · v0.0.1 · 2026-07-02
**Companion to:** `VISION.md` (the ten steps) · Ops Center app registry

Every app CivicOS could want, organized as an OS ships software: system layer
first, then the programs. Each app is a **civic executable** — a manifest the
Ops Center can install, with declared health checks (VISION step 6). Every app
must pass the one-line test: *does it make something invisible about collective
action visible on the desktop?*

**Sizing:** S = days, M = weeks, L = a season.
**Unlocks:** the VISION.md step that makes the app possible (1 Kernel, 2 Identity,
3 Ledger, 4 Trust, 5 Grants, 6 Executables, 7 Drivers, 8 Mesh, 9 Federation, 10 Distro).

---

## Infrastructure Prerequisites (not apps — the sockets apps plug into)

| Service | What it provides | Port | You already own |
| --- | --- | --- | --- |
| FogSift adapter | `/api/*` namespaces, app registry | 5051 | ✅ running today |
| **AI Gateway** | OpenAI-compatible local LLM endpoint | 5052 | ✅ `~/Code/llama.cpp` + models (~5GB); `fogsift-crash-course` installer |
| **Knowledge server** | Kiwix ZIM content (`kiwix-serve`) | 5053 | ZIM files are a download; server is one binary |
| Transcription | whisper.cpp streaming endpoint | 5054 | llama.cpp sibling project, same build chain |
| Search | Self-hosted AI search | 5055 | ✅ `~/Code/active/Perplexica` |
| Print pipeline | Markdown → themed PDF | — | ✅ WAFT `generate_classified_leak.py` pattern (pandoc) |
| In-browser AI fallback | WebLLM / transformers.js small models | none | Works offline, zero install — Sneakernet-compatible |

Rule: every AI feature runs **local-first**. Cloud APIs are an opt-in adapter,
never a dependency. Zero marginal token cost is a feature of the OS.

---

## Tier 0 — The Shell (exists)

Desktop, window manager, Taskbar, Start Menu, System Tray, themes — shipped in
the June 2026 rebuild. Plus five working accessory apps: **Search**, **Control
Panel**, **Help**, **Notepad**, **My Computer**, and the **Ops Center**.

Also shipped: **NovaSystem**, the Nova Process on the desktop. Type a decision,
three 8-bit agents run it through UNPACK, ANALYZE, SYNTHESIZE, and you get back
a list of asks with an owner on each. It runs entirely locally with no model
call, which makes it the honest first half of the AI Gateway story: the phases,
the lenses, and the output shape are already in place, so wiring port 5052 in
later is a swap of one function, not a new app. Runs pass into the ledger as
`nova.run` events.

---

## Tier 1 — Civic Core (the institution itself)

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **The Plaza** | — | Discovery feed + consensus voting on funding leads and proposals | — | — | ✅ exists (seed data) |
| 2 | **The Builder** | — | Kanban pipeline: Discovery → Vetting → Drafting → Review | — | — | ✅ exists |
| 3 | **The Vault** | My Documents | Real file storage: upload, version, link docs to grants/tasks, provenance from ledger | M | 1, 3 | 🔶 static today |
| 4 | **Town Hall** | — | Formal governance: proposals with quorum rules, binding votes, terms, minutes attached | M | 2, 3 | idea |
| 5 | **Event Viewer** | Event Viewer | Ledger explorer: every signed action, filterable, exportable — the audit trail as a first-class app | S | 3 | ✅ shipped (unsigned events; signatures land at step 2) |
| 6 | **Address Book** | Address Book | Member directory: people, roles, Paper Key fingerprints, capacity points, skills | S | 2 | idea |
| 7 | **The Charter** | Control Panel section | Bylaws as settings: quorum %, roles, voting windows — governance you open and adjust | M | 2 | ControlPanelApp seed |

## Tier 2 — Knowledge (the offline library)

The sovereignty play: a community that loses the internet keeps its knowledge.
All content ships as **ZIM files** served by kiwix-serve — Wikipedia (~100GB full,
~10GB no-pictures), WikiHow, iFixit, WikiMed, Project Gutenberg, StackExchange
dumps. ZIMs pass hand-to-hand on USB: the Sneakernet library.

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 8 | **Encyclopedia** | Encarta | Offline Wikipedia + WikiHow + iFixit reader (kiwix-serve adapter); search, bookmarks, cite-into-Vault | M | 6 | idea |
| 9 | **The Atlas** | MapPoint | Offline maps (OSM/PMTiles): community asset layers — gardens, tool depots, shelters, water | L | 6, 7 | idea |
| 10 | **The Library** | — | Org reading room: Vault docs + Gutenberg books, reading lists, study circles | S | 3 | idea |
| 11 | **Field Manual** | Help | First aid, disaster prep, repair guides: curated ZIMs + the org's own SOPs, offline always | S | 6 | HelpApp seed |
| 12 | **The Archive** | — | Community memory: oral histories, photos, timelines, each entry provenance-signed | M | 3 | idea |

## Tier 3 — Intelligence (local AI)

Two-engine design: **WebLLM/transformers.js in-browser** for small always-available
tasks (works offline, nothing to install, survives Sneakernet), and the **AI
Gateway (llama.cpp, port 5052)** for heavier models when the node has hardware.
Apps degrade gracefully between engines. No cloud key required, ever.

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 13 | **The Advisor** | Clippy, redeemed | Desktop-wide local assistant: Q&A over the Vault (local RAG), explains any screen, drafts anything | M | 1, 6 | idea |
| 14 | **Grant Scribe** | Office Wizard | AI-assisted grant drafting: org profile + Vault evidence + funder requirements → draft sections; human approves every word | M | 3, 5 | idea — **first revenue app** |
| 15 | **The Stenographer** | Sound Recorder | Meeting transcription (whisper.cpp) → structured minutes → signed into the ledger; decisions auto-link to Town Hall | M | 3 | idea — highest nonprofit demand |
| 16 | **Babel** | — | Local translation of Plaza/Notice Board content; multilingual membership without a cloud | M | 6 | idea |
| 17 | **Research Radar** | Active Desktop | Standing feeds: grants (grants.py), news, arXiv (arxiv-paper-pulse pattern), Perplexica search — filtered to org mission | M | 5 | ✅ parts exist in your repos |

## Tier 4 — Resources (the material base · Johnny Autoseed's home)

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 18 | **Harvest** | Task Manager for calories | Yield ledger from gardens; the **Runway gauge** (days of food sovereignty) in the system tray | M | 7 | Feb 2026 spec exists |
| 19 | **Seed Bank** | — | Seed library: catalog, germination rates, checkout/return, season planner | S | 7 | idea — Johnny Autoseed |
| 20 | **Tool Depot** | — | Tool library: checkout with capacity-point deposits, maintenance logs, waitlists | S | 4 | idea |
| 21 | **The Grid** | Power Options | Energy/water dashboards: solar, rain catchment, battery state via device drivers | L | 7 | idea |
| 22 | **Pantry** | — | Food inventory + distribution: stock, expiry radar, fair-share allocation runs | M | 4, 7 | idea |

## Tier 5 — Coordination (people and time)

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 23 | **Calendar** | Outlook Calendar | Org events, room/resource booking, ICS import/export | M | 1 | idea |
| 24 | **Muster** | — | Volunteer shifts: signups, hour logging → capacity points, reliability streaks | M | 4 | idea |
| 25 | **Mutual Aid Board** | Classifieds | Needs ↔ offers matching; fulfillment confirmed by handshake, decay-protected | M | 4 | idea |
| 26 | **Beacon** | — | Emergency mode: OS-wide HIGH_ALERT (from Feb spec) — check-ins, resource status, mesh priority, battery-saver UI | L | 8 | Feb 2026 tripwire spec |
| 27 | **Dispatch** | — | Routes passed Town Hall decisions into Builder tasks and Muster shifts automatically | S | 6 | idea |

## Tier 6 — Communication

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 28 | **Messenger** | MSN Messenger | E2E chat between Paper Keys; LAN/mesh-first, internet optional; nudges included | L | 2, 8 | idea |
| 29 | **Notice Board** | — | Public announcements with expiry; feeds the Print Shop for physical flyers | S | 1 | idea |
| 30 | **The Wire** | Windows Media radio | RSS + podcast reader + community radio streams (Teleport Massive Radio as first station) | S | 6 | idea |
| 31 | **Post Office** | Outlook Express | Newsletter/email bridge for members outside the OS (email-funnel playbook) | M | 5 | ✅ playbook exists |

## Tier 7 — Records & Money

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 32 | **Bookkeeper** | Money | Fund accounting: budget envelopes, grant fund tracking, restricted vs unrestricted — plain double-entry, **not** the cut Treasury Escrow, no chain | L | 3 | idea |
| 33 | **Forms** | — | Form builder: intake, applications, surveys → responses land in Vault with provenance | M | 3 | idea |
| 34 | **Compliance Cabinet** | — | 990s, insurance, filings: deadline radar, document checklist, renewal alarms | S | 3, 5 | idea |
| 35 | **The Print Shop** | Print Shop Deluxe | Flyers, newsletters, door hangers, zines: markdown → themed PDF (WAFT pandoc pipeline) | S | 6 | ✅ pipeline pattern exists |
| 36 | **Sign Here** | — | Document signing with Paper Keys: Ed25519 signatures on Vault docs — DocuSign without the landlord | S | 2, 3 | idea |

## Tier 8 — Utilities & Culture

XP without Solitaire isn't XP. Culture apps are onboarding: people learn the
desktop by playing in it before they govern in it.

| # | App | XP analog | What it does | Size | Unlocks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 37 | **Calculator** | Calculator | It's a calculator. With a fund-split mode | S | — | idea |
| 38 | **Paint** | MS Paint | Drawing + flyer doodles; kids' first app; exports to Print Shop | M | — | idea |
| 39 | **Media Player** | Winamp/WMP | Plays Vault audio/video: meeting recordings, oral histories, radio archive | S | — | idea |
| 40 | **Terminal** | Command Prompt | Power-user console: run app health checks, query the ledger, drive the OS from text | M | 6 | idea |
| 41 | **The Arcade** | Solitaire/Minesweeper | Solitaire, Minesweeper, and a trust-economy training game; AI-DnD as the marquee cabinet | M | — | ✅ AI-DnD exists |
| 42 | **The Museum** | Welcome tour | The org's story as a walkable exhibit; doubles as new-member onboarding | S | 3 | idea |

---

## Phasing — what to build in what order

| Phase | Theme | Apps | Why first |
| --- | --- | --- | --- |
| **v0.1 — The Tool** | A nonprofit pays for this | Vault upgrade (3), Event Viewer (5), Research Radar (17), Grant Scribe (14), Compliance Cabinet (34) | Rides VISION steps 1–5; every app here shortens the path from "found grant" to "submitted application" |
| **v0.2 — The Office** | Daily driver | Stenographer (15), Calendar (23), Forms (33), Notice Board (29), Print Shop (35), Address Book (6) | The org stops needing Google Workspace for core ops |
| **v0.3 — The Library** | Sovereignty dividend | Encyclopedia (8), Field Manual (11), The Advisor (13), The Library (10), The Wire (30) | Local AI + offline knowledge: the OS is now useful with the internet unplugged |
| **v0.4 — The Commons** | Trust economy live | Town Hall (4), Muster (24), Mutual Aid Board (25), Tool Depot (20), Charter (7), Sign Here (36) | Rides VISION step 4; governance and reciprocity become daily-use software |
| **v0.5 — The Homestead** | Material base | Harvest (18), Seed Bank (19), Pantry (22), Atlas (9), Bookkeeper (32) | Johnny Autoseed integration; Runway in the system tray |
| **v0.6 — The Network** | Many desktops, one town | Messenger (28), Beacon (26), Dispatch (27), Babel (16), The Grid (21) | Rides VISION steps 8–9: mesh, emergency, federation |
| **Always** | Culture | Calculator, Paint, Media Player, Arcade, Museum, Terminal | Ship one per phase as the treat |

## The Local AI Plan in one paragraph

One **AI Gateway** service (llama.cpp server, OpenAI-compatible, port 5052) that
every app calls through a single `useLocalAI()` hook; a WebLLM in-browser fallback
so a bare Sneakernet install still has a working Advisor; whisper.cpp beside it
for the Stenographer; all models declared in app manifests like any other
dependency, with Ops Center health checks showing which engines are loaded. Your
existing `llama.cpp` checkout and `fogsift-crash-course` installer are the
literal implementation — CivicOS just gives them a desktop.

## The Wikipedia Plan in one paragraph

One **Knowledge server** (kiwix-serve, port 5053) hosting ZIM files; the
Encyclopedia app is a themed reader over its HTTP API with search, bookmarks, and
"cite into Vault." Start with Simple English Wikipedia (~250MB) so it ships in
the default distro, offer full Wikipedia/WikiHow/iFixit/WikiMed as Ops
Center-installable content packs. ZIMs travel by USB — the library that
federates by sneaker.

---

*42 apps. Six phases. Every one manifest-installed, health-checked in Ops Center,
local-first, and pointed at the same test: make collective action visible on the
desktop.*
