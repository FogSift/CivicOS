# CivicOS — What This Is and What It Becomes

**Status:** Living document · v0.0.1 · 2026-07-02
**Thesis:** CivicOS is an operating system for communities the way Windows XP was an
operating system for a machine. It makes collective capacity — trust, labor, food,
money, decisions — legible, operable, and locally owned.

---

## Why Windows XP

The skin is not nostalgia. XP was the last mass-computing artifact people felt they
*owned*: pre-cloud, pre-surveillance, when "My Computer" meant *my* computer. Every
pixel of that chrome says: **this runs here, you can see all of it, nothing leaves
without you knowing.** That is precisely the trust posture civic infrastructure
needs and never has.

The last computer people trusted becomes the first institution people can trust.

## The OS Metaphor Is Load-Bearing

An operating system manages resources: processes, users, files, devices, network,
uptime. Every one of those has a civic analog — and most already have a seed in
this repo:

| OS concept | Civic analog | Seed in repo today |
| --- | --- | --- |
| Bootloader / BIOS | Sovereign boot: identity + local DB before first pixel | `CivicProvider` spec (Feb 2026 docs, unbuilt) |
| Processes | Projects and tasks moving through a pipeline | The Builder (kanban) |
| Users / permissions | Members, roles, governance rules | AuthScreen, Control Panel app |
| Filesystem | Institutional records with provenance | The Vault |
| Package manager | Installable civic apps with declared health checks | App registry + manifests (Ops Center) |
| Device drivers | Adapters to real-world systems: grant APIs, garden robots, sensors | `/api` proxy to FogSift; grants.py scanner (Johnny Autoseed) |
| Network stack | Mesh sync between neighbors; federation between neighborhoods | Mesh-relay tripwire spec (Feb 2026 docs, unbuilt) |
| Task manager | Live operational health of every subsystem | Ops Center |
| Uptime | **Runway: days of food sovereignty** | Harvest Protocol spec (Feb 2026 docs, unbuilt) |
| Control Panel | Bylaws as settings — governance you can open and adjust | ControlPanelApp |

The February 2026 design sessions ("Sovereign Bootloader Integration", "Velocity
Decay Engine") specified the kernel. The June 2026 rebuild shipped the shell. The
work ahead is wiring the shell to the kernel.

## The Founding Constraint: The 5050 Hard Gate

FogSift already runs under one CivicOS law: *no implementation task starts until it
has a representation on `localhost:5050`.* Represent → execute → verify → log.

Generalized, that is the whole product: **work must be visible before it is real.**
An organization running on CivicOS gets legible operations for free — every task on
a desktop, every decision voted in the Plaza, every artifact in the Vault, every
outcome in the ledger. CivicOS is Empirica's epistemic discipline applied to
institutions instead of AI sessions.

---

## The Ten Steps

Sequenced deliberately: steps 1–5 make a product a nonprofit would pay for
(income-shaped, near-term). Steps 6–10 make an institution a community can run on
(sovereignty-shaped, built on the paying base). Each step converts something
invisible into something you can see on a desktop and double-click.

### 1. The Kernel — persistence and the sovereign boot
Implement `CivicProvider` from the February spec: local-first database (PGLite or
IndexedDB), state hydration on boot, BOOTING → READY lifecycle with a real boot
screen. The OS *remembers*. Close the app, come back, your desktop is where you
left it. Everything else stacks on this.

### 2. Identity — the Paper Key
The Log On screen becomes real: generate or import an Ed25519 keypair. Every user
is a key; every action is signed. No accounts, no server, no password reset flow —
a printable paper key you own. Identity without a landlord.

### 3. The Ledger — append-only institutional memory
Every vote, task transition, vouch, and upload becomes a signed, append-only event.
The Vault gains provenance: every document traceable to who, when, why. Exportable
as a single file. A nonprofit can hand its funder the entire audit trail —
**radical transparency as a product feature.** (The Turtle Principle, applied to
institutions: every claim traces to a source.)

### 4. The Trust Economy — capacity points with velocity decay
Implement the anti-collusion engine already specified: verification handshakes
between members earn capacity points; repeated vouches between the same pair decay
1.0 → 0.5 → 0.1 → 0.0 within 72 hours. The math forces the network outward — you
cannot farm trust in a closed loop; you have to go fix someone else's fence.
**Not crypto:** points are non-transferable reputation on a local signed log. No
chain, no token, no speculation — the repo's "no blockchain" rule stands.

### 5. Real Grants — the Plaza goes live
Grants.gov / Candid ingestion replaces seed data (the Johnny Autoseed `grants.py`
scanner is a working head start). Filters by org profile, deadline radar, fit
scoring. This is the step where the demo becomes a tool with day-one value —
the first thing a stranger would pay for.

### 6. Civic Executables — the package manager
Formalize the app manifest the Ops Center already reads (merge with the Feb
`spec.json` pattern: id, version, classification, integration point, declared
health checks). Third parties ship apps; CivicOS installs them into the Start
menu and *verifies their checks before letting them run*. The app store moment —
except the store is a folder and the DRM is a checksum.

### 7. Drivers — the Harvest Protocol
The first hardware peripheral: Johnny Autoseed gardens report caloric yield into
CivicOS, and the desktop shows the neighborhood's **Runway — days of food
sovereignty** — as a system gauge, as ambient as the clock. This is the step
where the OS metaphor breaks the screen boundary: real dirt, real calories,
rendered in the system tray.

### 8. Multiplayer — mesh sync
CRDT sync between nodes: a neighborhood shares one desktop state. The offline
tripwire from the February spec engages mesh relay when the internet drops.
Enforce the 3MB bundle budget so the entire OS passes phone-to-phone over
Bluetooth — the Sneakernet install. Infrastructure that survives the outage is
infrastructure people trust *before* the outage.

### 9. Federation — neighborhoods peer with neighborhoods
Public Plazas visible across orgs: shared grant radar, coalition applications
assembled across communities, mutual-aid routing between nodes with surplus and
nodes in deficit. Public ledgers make every org auditable to every funder. Each
community that joins makes the grant intel and the trust graph better for all —
the network effect, pointed at solidarity instead of engagement.

### 10. The Distro — institution-in-a-box
One command boots a governed institution: pick a template (mutual-aid network,
co-op, watershed council, PTA), get bylaws as Control Panel settings, a seeded
Plaza, an empty Vault, and a ledger from block zero. At this point CivicOS stops
being an app and becomes a standard — the manifest format, ledger format, and
governance primitives published as open protocol, FogSift running the reference
shell. *"Vibe code a government"* stops being a tagline.

---

## What CivicOS Is Not

- **Not a blockchain.** No chain, no token, no gas. Signed local logs and human
  verification.
- **Not a SaaS panopticon.** Local-first; sync is opt-in; the export button always
  works; leaving is a file copy.
- **Not a platform play.** The protocol is the product. The moat is trust, and
  trust doesn't fork.

## The One-Line Test

Every feature must pass: *does this make something invisible about collective
action visible on the desktop?* If it doesn't, it's decoration.

---

*Related: `RECAP.md` (session state) · Ops Center (`src/views/OpsCenterView.jsx`) ·
FogSift 5050 hard gate (`fogsift/_docs/20-29_development/workflow_category/workflow.06`) ·
Feb 2026 kernel specs (Drive: "CivicOS: Sovereign Bootloader Integration",
"CivicOS Velocity Decay Engine")*
