# WORKRUN.md — CivicOS Production Work Run

**Status:** Ready for execution · Created 2026-07-03
**Scope:** Make every currently-existing UI element functional, then fold in the
classic XP accessories (Solitaire, Minesweeper, Paint, and — as the capstone —
Doom).
**Rule for WP1–WP12:** no new features, zero new npm dependencies — only make
what exists work. **WP13–WP15 are explicitly new scope**, added by the user
after the functionality audit; they vendor real open-source projects rather
than reinvent them.

This document is self-contained. An agent with no prior context on this
session can execute it top to bottom.

---

## Part A — Make Everything That Exists Work (WP1–WP12)

### Audit Findings (complete inventory, verified against source)

**Orphaned components (defined, never imported):** `AppChrome.jsx`,
`TaskPane.jsx`, `InfoBar.jsx`, `ThemeSwitcher.jsx` (all superseded by the
browser-OS rebuild). `ContextMenu.jsx` and `StatusBar.jsx` are also currently
orphaned but have real homes below — keep and wire them in.

**Dead controls (no handler / no-op):**
- AuthScreen: email input, Cancel, Turn Off, Options, titlebar Help, user tile
- NotepadApp: entire menu bar (File/Edit/Format/View/Help); "Ln 1, Col 1" hardcoded
- ControlPanelApp: Apply + OK buttons; 3 sidebar links; 5 of 6 category panels
  are "under construction" placeholders (Sounds, Network, User Accounts,
  Security, Appearance)
- MyComputerApp: all sidebar task links
- SearchApp: Search button; 3 category sidebar links
- VaultView: all 3 folder buttons (hover styling only, no click)

**Fake displays (hardcoded pretending to be live):**
- SystemTrayPanel: "Connected" network status; volume slider (no onChange,
  75% hardcoded); frozen clock
- Taskbar: Wifi + Volume tray icons (static, no state)
- BuilderView/KanbanColumn: display-only pipeline — cards cannot move
- OpsCenterView: action links are raw `<a href>` that navigate the SPA away

**Already working — do not touch:** window manager, Start Menu, taskbar
buttons, desktop icons, Plaza voting/commit/discard, AddNodeModal, Event
Viewer, theme switching, the kernel (persistence/ledger from the prior
milestone).

### 0. Preamble for the Executing Agent

#### 0.1 Conventions (non-negotiable)

1. New `src/` files get a `@fileId` header via
   `node scripts/new-file.js src/path/File.jsx "Description"`. Do **not**
   retrofit headers onto existing files that lack one.
2. Tailwind = layout, xp.css = chrome — never both on one element. Match each
   file's existing idiom (`src/os/*` and `src/apps/*` use inline styles +
   xp.css; `src/views/*` and `src/components/*` use Tailwind arbitrary values).
3. All colors via `var(--color-*)` (defined `src/index.css:24-100`).
4. **Disabled-state convention** (used throughout): `disabled` +
   `aria-disabled="true"`, `color: var(--color-text-muted)`, no
   `textDecoration: underline`, `cursor: 'default'`, no hover handlers.
5. `CHANGELOG.md` `[Unreleased]` gets bullets per work package.
6. One commit per work package, Conventional Commits style, trailer
   `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

#### 0.2 Verification protocol (run after every package)

```bash
cd /Users/ctavolazzi/Code/CivicOS
npm run build
npm run dev &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --virtual-time-budget=8000 \
  --dump-dom http://localhost:5050 | grep -c "Log On to CivicOS"   # expect ≥1
```

Headless Chrome always lands on AuthScreen (fresh profile, no session), so DOM
probes verify boot + auth-screen markers only. Everything behind logon is
verified manually per the steps in each package. `node
scripts/check-5050-namespaces.mjs` verifies the FogSift adapter when it's up.

#### 0.3 Central registry spec (single source of truth — no package deviates)

`src/kernel/CivicProvider.jsx` line 18:

```js
const SNAPSHOT_KEYS = ['resources', 'session', 'windows', 'settings', 'notepad', 'vault'];
```

**Critical fix** — `saveSnapshot` must refresh the in-memory cache, or a
window that closes and reopens in the same session hydrates stale data:

```js
const saveSnapshot = useCallback((key, data) => {
  if (!boot) return Promise.resolve();
  boot.snapshots[key] = data;
  return boot.storage.put('kv', key, { v: 1, data });
}, [boot]);
```

`src/kernel/events.js` `EVENT_TYPES` gains:

```js
'resource.move':   { label: 'Resource', color: '#3a7a5c' },
'settings.change': { label: 'Settings', color: '#1e76a2' },
'user.rename':     { label: 'Session',  color: '#2a5cce' },
```

**Snapshot shapes:** `settings: { uiSounds: bool=true, volume: 0-100=75 }` ·
`notepad: { text, wordWrap: bool=true, statusBar: bool=true }` ·
`vault: { folders: { 'master-narrative': [], 'compliance-tax': [], 'team-bios': [] } }`
(nothing writes these yet — reads must tolerate `undefined` throughout) ·
`session: { authenticated, user }` (already the shape; `user` becomes dynamic).

---

### WP1 — Delete orphaned pre-OS-shell components

**Delete:** `src/components/AppChrome.jsx`, `TaskPane.jsx`, `InfoBar.jsx`,
`ThemeSwitcher.jsx`. **Touch:** `CHANGELOG.md`.

Verified: `grep -rn "AppChrome\|TaskPane\|InfoBar\|ThemeSwitcher" src/` matches
nothing outside these four files (AppChrome imports ThemeSwitcher — both go
together). `ContextMenu.jsx`/`StatusBar.jsx` stay — wired in WP2/4/10/11.

CHANGELOG → Removed: "Orphaned pre-OS shell components — superseded by the OS
shell; theme switching lives in Control Panel → Display and the system tray."

**Verify:** grep returns 0 hits; build passes; headless probe shows auth screen.
**Commit:** `chore: remove orphaned pre-OS shell components superseded by the OS shell`

---

### WP2 — Kernel registry + ContextMenu disabled-item support

**Touch:** `src/kernel/CivicProvider.jsx`, `src/kernel/events.js`,
`src/components/ContextMenu.jsx`, `CHANGELOG.md`.

1. Apply the §0.3 registry spec verbatim.
2. `ContextMenu.jsx` (~line 49-62): support `item.disabled` — render with
   `text-[var(--color-text-muted)]`, no hover classes, `aria-disabled="true"`,
   guarded `onClick={() => { if (item.disabled) return; item.onClick?.(); onClose(); }}`.
   Portal, viewport clamping, Escape/outside-click close already work — reused
   as-is by WP4/WP10/WP11/WP13. For dropdown use, anchor with
   `const r = e.currentTarget.getBoundingClientRect(); {x: r.left, y: r.bottom}`.
3. CHANGELOG: Added — new snapshot keys and ledger event types; Fixed —
   in-session snapshot cache staleness.

**Verify:** build; Event Viewer's `Show:` dropdown lists the 3 new event types.
**Commit:** `feat(kernel): register settings/notepad/vault snapshots and new ledger event types; ContextMenu disabled items`

---

### WP3 — AuthScreen: real logon identity, Cancel, Turn Off, disabled Options/Help

**Touch:** `src/components/AuthScreen.jsx`, `src/App.jsx`, `src/os/Desktop.jsx`,
`src/os/Taskbar.jsx`, `CHANGELOG.md`. (`StartMenu.jsx` already accepts
`username`, default `'Civic User'` — no change needed there.)

**App.jsx:** `handleLogon(nextUser)` — guard with `typeof nextUser === 'string' && nextUser.trim()`
(a bare `onClick={onAuth}` would otherwise pass a MouseEvent as the username)
→ `user = trimmed || SESSION_USER`; `setUser`, `setIsAuthenticated(true)`,
`saveSnapshot('session', {authenticated:true, user})`,
`logEvent('session.logon', {user})`. Add `const [user, setUser] = useState(() => snapshots.session?.user ?? SESSION_USER)`.
`handleLogoff` saves the current `user`, not the constant. Pass
`username={user}` down to `<Desktop>` → `<Taskbar>` → `<StartMenu>`.

**AuthScreen.jsx element-by-element:**

| Element | Current | Target |
|---|---|---|
| Email input | dead, no onChange | controlled state; wrap in `<form onSubmit>` so Enter submits |
| User tile | dead, cursor:pointer only | `onClick={() => onAuth()}` — logs on as System Administrator |
| Log On | ignores email | `onAuth(email)` — logs on as email if non-empty, else System Administrator |
| Cancel | dead | `onClick={() => setEmail('')}` |
| Enter Demo Workspace | works, but leaks MouseEvent once onAuth takes a param | `onClick={() => onAuth()}` |
| Turn Off | dead | logs `session.logoff {reason:'shutdown'}`, renders full-screen black/orange "It is now safe to turn off your computer." (no controls; reload boots again) |
| Options | dead | disabled per §0.1.4 |
| Titlebar Help | dead | `disabled aria-disabled="true"` |

**Verify:** build; probe still finds auth screen. Manual: logon identity shows
in Start Menu + persists across reload; Turn Off shows shutdown screen and
logs the event; Cancel clears field; Options/Help visibly disabled.
**Commit:** `feat(auth): wire logon identity, cancel, and shutdown screen; thread username to Start Menu`

---

### WP4 — Notepad: real menus, live Ln/Col, word wrap, persistence, Exit

**Touch:** `src/apps/NotepadApp.jsx`, `src/App.jsx`, `CHANGELOG.md`.

`App.jsx`: `case 'notepad': return <NotepadApp onClose={() => closeWindow(win.id)} />;`
(add `closeWindow` to `renderApp` deps).

**NotepadApp rewrite:** state `text/wordWrap/statusBar` hydrated from
`useKernel().snapshots.notepad` (§0.3 defaults); `cursor {ln,col}`;
`openMenu {name,x,y}|null`; `aboutOpen`; `canPaste = !!navigator.clipboard?.readText`.
Debounce-save `{text, wordWrap, statusBar}` to snapshot `'notepad'` (400ms,
same pattern as `useWindowManager.js` window-layout persistence).

Menu bar buttons get `onMouseDown={e => {e.preventDefault(); e.stopPropagation();}}`
+ `onClick` toggling `openMenu` anchored at the button's rect; one
`<ContextMenu>` renders when open:
- **File:** New (confirm-discard if dirty) · Save (Blob download `Untitled.txt`,
  same pattern as EventViewerApp's export) · separator · Exit → `onClose()`
- **Edit:** Select All · Copy (`clipboard.writeText`, try/catch) · Cut
  (disabled when no selection) · Paste (disabled if `!canPaste`)
- **Format:** Word Wrap toggle — real `wrap={wordWrap ? 'soft':'off'}` on the
  textarea; `✓` prefix in label when on
- **View:** Status Bar toggle (single XP-authentic item)
- **Help:** About Notepad — modal (AddNodeModal overlay pattern), shows
  `__APP_VERSION__`

Status bar: replace hardcoded "Ln 1, Col 1" — compute from
`textarea.selectionStart` on change/click/keyup/select.

**Verify:** build; every menu item works; word wrap visibly changes long-line
behavior; type → close → reopen → text restored (exercises the WP2 cache
fix); reload → still restored; Exit closes window + logs `window.close`.
**Commit:** `feat(notepad): real menus, live Ln/Col, word wrap, and kernel persistence`

---

### WP5 — Settings + sounds infrastructure; live tray and taskbar indicators

**New:** `src/hooks/useSettings.js`, `src/hooks/useOnlineStatus.js`,
`src/os/sounds.js`. **Touch:** `src/App.jsx`, `src/os/Desktop.jsx`,
`src/os/Taskbar.jsx`, `src/os/SystemTrayPanel.jsx`, `CHANGELOG.md`.

`useSettings.js` mirrors `useResources`: hydrate from
`snapshots.settings ?? {uiSounds:true, volume:75}`; effect persists on
change; `updateSettings(patch)` merges + logs `settings.change`.
**Instantiate once in App.jsx**, pass down as props (same ownership as
`useTheme`) — never call it in a leaf component.

`useOnlineStatus.js`: `useState(navigator.onLine)` + online/offline listeners.

`sounds.js`: lazy module-level `AudioContext`; `playOpenBeep(volume)` /
`playCloseBeep(volume)` — two-tone oscillator (523→659Hz / 659→523Hz, 80ms),
gain `volume/100 * 0.1`, no-op at volume 0, wrapped in try/catch.

**App.jsx:** `openApp` plays open-beep after `openWindow` when
`settings.uiSounds`; new `handleCloseWindow(id)` plays close-beep then calls
`closeWindow` — pass to Desktop as `onCloseWindow` and reuse for Notepad's
`onClose`.

**SystemTrayPanel:** network row → `useOnlineStatus()`, live Connected/Offline
+ Wifi/WifiOff icon; volume slider → `value={settings.volume}`
`onChange={e => updateSettings({volume:+e.target.value})}`; clock gets the
same 1s-interval pattern already used in `Taskbar.jsx`'s `Clock`.

**Taskbar:** tray icons become real buttons — Wifi/WifiOff by online state,
Volume2/VolumeX by `settings.volume === 0 || !settings.uiSounds`; both open
the tray panel on click.

**Verify:** open/close windows → beeps scale with volume; DevTools →
Network → Offline flips tray live; volume 0 shows VolumeX; settings persist;
Event Viewer shows `settings.change`.
**Commit:** `feat(os): live network and volume tray with persisted sound settings and WebAudio beeps`

---

### WP6 — Control Panel: five real panels, OK/Apply, disabled sidebar

**Touch:** `src/apps/ControlPanelApp.jsx`, `src/App.jsx`, `CHANGELOG.md`.

`App.jsx`: pass `settings, updateSettings, user` + `onRenameUser` (trims,
no-ops on empty/unchanged, `setUser` + `saveSnapshot('session',...)` +
`logEvent('user.rename', {from,to})`) into `ControlPanelApp`.

- Sidebar links ("Switch to Category View" etc.) → disabled.
- Display panel OK → returns to grid; Apply → disabled + "Changes apply
  immediately." caption.
- Delete `PlaceholderPanel`; replace all 5 remaining categories:
  - **Sound:** checkbox bound to `settings.uiSounds`, volume slider bound to
    `settings.volume` (same source as the tray — stays in sync by construction)
  - **Network:** `useOnlineStatus()` row; a mount-time
    `fetch('/api/meta.json', {cache:'no-store'})` → Connected/Unreachable for
    the FogSift adapter (honest on both fetch-fail and non-200); proxy info
    display; a real Refresh button
  - **Accounts:** current user tile + rename form → `onRenameUser`; muted
    caption "Passwords are not used in this build."
  - **Security Center:** `useKernel()` directly — storage backend,
    `eventCount`, session user, XP-styled status rows
  - **Appearance:** aliases Display (`id === 'appearance' ? setActive('display') : setActive(id)`)

**Verify:** every category opens a real panel; rename propagates to Start
Menu + Security Center + ledger; sounds toggle syncs with tray both ways;
network panel reflects offline + adapter state; OK returns to grid.
**Commit:** `feat(control-panel): functional Network, Sounds, Accounts, and Security Center panels; honest OK/Apply`

---

### WP7 — My Computer: wire sidebar tasks + System Properties dialog

**Touch:** `src/apps/MyComputerApp.jsx`, `CHANGELOG.md`.

Convert sidebar links to a data-driven list: "View system info" → opens
**System Properties** dialog (AddNodeModal overlay pattern) showing
`release.tag/channel/label` from `src/version.js`, kernel `backend`,
`eventCount`, `navigator.userAgent` — no fabricated uptime. "Change a
setting" → `onOpenApp('settings')`. "Network Places" → `onOpenApp('ops')`.
"My Documents" → `onOpenApp('vault')`. "Add/remove programs" and "Shared
Documents" → disabled (genuinely no backing).

**Verify:** each mapped link opens the right window; disabled ones inert;
dialog shows real values.
**Commit:** `feat(my-computer): wire sidebar tasks and real System Properties dialog`

---

### WP8 — Search: real submit model; disabled category links

**Touch:** `src/apps/SearchApp.jsx`, `CHANGELOG.md`.

Convert to a `<form>`; add `submitted` state set on submit; results derive
from `submitted`, not live `query` — makes the Search button (and Enter) do
real work instead of being vestigial. Category sidebar links → disabled.

**Verify:** typing alone no longer changes results; submit (button or Enter)
runs the search; double-click still opens apps.
**Commit:** `feat(search): submit-driven search; disable unimplemented category scopes`

---

### WP9 — Vault: folder navigation with kernel-backed listings

**Touch:** `src/views/VaultView.jsx`, `CHANGELOG.md`.

Add stable `id`s to the 3 vault items. Double-click opens a folder view
(toolbar Back + breadcrumb) listing
`snapshots.vault?.folders?.[id] ?? []` — empty array renders honest
"(This folder is empty)". No writes in this package (upload stays out of
scope); any future writer to the `vault` key surfaces here for free.

**Verify:** each folder opens with honest empty state; Back returns to grid.
**Commit:** `feat(vault): folder navigation with kernel-backed listings and honest empty states`

---

### WP10 — Builder pipeline: moveLead via card context menu

**Touch:** `src/hooks/useResources.js`, `src/components/KanbanColumn.jsx`,
`src/views/BuilderView.jsx`, `src/App.jsx`, `CHANGELOG.md`.

`useResources` gains `moveLead(id, direction)` (mirrors `commitLead`):
compute `from`/`to` from `PipelineColumns` order (`src/constants.js`), clamp
to bounds, no-op if unchanged, `logEvent('resource.move', {id,from,to})`.
Cards gain `onContextMenu` → a `<ContextMenu>` with "Advance to X" (disabled
on last column) / "Send back to X" (disabled on first column — sending
`vetting` back returns it to the Plaza feed, which is correct). Remove the
fake link-cursor affordance on card titles.

**Verify:** right-click each column's cards → correct enabled/disabled pair;
advancing walks Discovery→Vetting→Drafting→Submitted; ledger logs
`resource.move`; state survives reload.
**Commit:** `feat(builder): move leads through the pipeline via card context menu`

---

### WP11 — Plaza: StatusBar mount + GrantCard right-click menu

**Touch:** `src/views/PlazaView.jsx`, `src/components/GrantCard.jsx`,
`CHANGELOG.md`.

Mount the orphaned `StatusBar` (already renders version + node count, no
changes needed to it) at the bottom of PlazaView. GrantCard gains
`onContextMenu` → Commit / separator / Discard (danger-styled) — the
February roadmap item, finally wired. Remove GrantCard's fake link-cursor
title affordance.

**Verify:** status bar shows live lead count; right-click Commit/Discard both
work and log existing events.
**Commit:** `feat(plaza): status bar with live lead count and grant card context menu`

---

### WP12 — Ops Center link fix + final acceptance sweep

**Touch:** `src/views/OpsCenterView.jsx`, `CHANGELOG.md`.

Add `target="_blank" rel="noopener noreferrer"` to registry action links (they
currently navigate the SPA away, killing the desktop session). Run the full
Acceptance Checklist below end-to-end; fix any regressions found; final
`npm run build` + `node scripts/check-5050-namespaces.mjs`.

**Commit:** `fix(ops): open registry action links in a new tab; acceptance sweep`

### Acceptance Checklist (WP1–WP12)

| # | Element | Resolution | WP |
|---|---|---|---|
| 1 | AppChrome/TaskPane/InfoBar/ThemeSwitcher orphans | deleted | WP1 |
| 2 | ContextMenu orphan | kept; disabled-item support; wired ×4+ | WP2/4/10/11/13 |
| 3 | StatusBar orphan | kept; mounted in Plaza | WP11 |
| 4-9 | AuthScreen dead controls + hardcoded user | real logon identity, Cancel, shutdown screen, disabled Options/Help | WP3 |
| 10 | StartMenu username never passed | threaded from session | WP3 |
| 11-14 | Notepad fake menus, hardcoded Ln/Col, no persistence | real dropdowns, live cursor tracking, kernel snapshot | WP4 |
| 15-18 | Tray/taskbar fake network/volume/clock | live state, WebAudio beeps | WP5 |
| 19-21 | Control Panel dead buttons + 5 placeholders | real panels, honest OK/Apply | WP6 |
| 22 | My Computer dead sidebar | wired + System Properties | WP7 |
| 23-24 | Search dead button + category links | submit model, disabled scopes | WP8 |
| 25 | Vault dead folders | navigation + honest empty state | WP9 |
| 26-27 | Kanban display-only + fake affordances | moveLead context menu | WP10 |
| 28 | Ops links hijack SPA | target=_blank | WP12 |
| 29 | GrantCard right-click (Feb roadmap) | Commit/Discard menu | WP11 |

---

## Part B — Classic Accessories (WP13–WP15)

**New scope, added after the functionality audit.** These vendor real
open-source projects rather than reinvent them — per instruction, search
first, fold in second. All four share one integration pattern:

### Shared architecture: vendored static apps

Each accessory is vendored **unbuilt, as static files** under
`public/apps/<name>/` — Vite copies `public/` verbatim without bundling, so
none of this touches the core JS/CSS bundle size or the 3MB Sneakernet
budget documented in `VISION.md`/`APPS.md`. This is the same pattern
`APPS.md` already proposes for Knowledge-server content packs: opt-in static
content, fetched on demand, never inflating the core shell. Flag this
explicitly wherever the budget is discussed — Doom's WAD alone is ~4MB,
which is fine *because* it never enters the bundle graph.

A single new component, `src/apps/IframeApp.jsx`, mounts any vendored app:

```jsx
export default function IframeApp({ src, title }) {
  return (
    <iframe
      src={src}
      title={title}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
    />
  );
}
```

Each of the four apps gets an `APP_META` entry, a `renderApp` case
(`<IframeApp src="/apps/<name>/index.html" title="<Name>" />`), a desktop
icon, and a Start Menu entry — same registration recipe used throughout the
codebase (`src/App.jsx` `APP_META`/`renderApp`, `src/os/Desktop.jsx`
`DESKTOP_ICONS`, `src/os/StartMenu.jsx`).

**Licensing:** every vendored directory keeps its own upstream `LICENSE`
file untouched. Add `THIRD_PARTY_LICENSES.md` at the repo root listing each
vendored app, its upstream repo URL, and its license (GPL code living
alongside an MIT project is standard practice — VS Code does the same —
as long as the GPL portions stay separately licensed and aren't
relicensed).

---

### WP13 — Classic Games: Solitaire + Minesweeper

**Solitaire** — vendor **[jhatzimalis/solitaire](https://github.com/jhatzimalis/solitaire)**
(MIT). Genuinely a single `index.html` file, zero dependencies, zero build
step — `git clone` it into `public/apps/solitaire/`, keep its `LICENSE`.

**Minesweeper** — vendor **[sylhare/Minesweeper](https://github.com/sylhare/Minesweeper)**
(GPL-3.0). Canvas-rendered, plain `index.html` + `js/`/`css/`/`img/`
folders, no build step. `git clone` into `public/apps/minesweeper/`, keep
its `LICENSE`.

**Steps:**
1. `git clone --depth 1 https://github.com/jhatzimalis/solitaire /tmp/solitaire-src`
   → copy `index.html` + `LICENSE` into `public/apps/solitaire/`.
2. `git clone --depth 1 https://github.com/sylhare/Minesweeper /tmp/minesweeper-src`
   → copy `index.html`, `js/`, `css/`, `img/`, `LICENSE` into
   `public/apps/minesweeper/`. Verify relative asset paths still resolve
   from that directory (open directly, check DevTools console for 404s).
3. Register both via the shared `IframeApp` pattern: `APP_META` entries
   `solitaire`/`minesweeper`, `renderApp` cases, desktop icons (a `Spade`/
   `Bomb`-style lucide icon each), Start Menu pinned or system entries.
4. `THIRD_PARTY_LICENSES.md`: add both entries.
5. CHANGELOG: Added — Solitaire and Minesweeper, vendored from open source.

**Verify:** both open as real windows, fully playable (deal/drag cards;
click/flag mine tiles), no console 404s for assets, build passes.
**Commit:** `feat(games): add Solitaire and Minesweeper (vendored, open source)`

---

### WP14 — Paint

Vendor **[1j01/jspaint](https://github.com/1j01/jspaint)** (MIT). No build
step — raw source runs as static files. `git clone --depth 1
https://github.com/1j01/jspaint /tmp/jspaint-src` → copy the whole tree
(minus `.git`, `node_modules` if present, test/CI-only files) into
`public/apps/jspaint/`. jspaint's own README notes the iframe must be
same-origin with the host page — vendoring under `public/apps/` on the same
Vite origin satisfies this natively, no config needed.

Register via `IframeApp` (`src="/apps/jspaint/index.html"`), `APP_META`
entry `paint`, desktop icon (lucide `Paintbrush`), Start Menu entry.
`THIRD_PARTY_LICENSES.md` entry. CHANGELOG: Added.

**Verify:** opens, draw/undo/save-as work inside the window; no cross-origin
console errors; build passes.
**Commit:** `feat(paint): add JS Paint (vendored, open source, MIT)`

---

### WP15 — Doom (the capstone)

Vendor **[cloudflare/doom-wasm](https://github.com/cloudflare/doom-wasm)** —
Chocolate Doom compiled to WebAssembly (GPL). It supports a genuine
local/no-network single-player mode served from plain static files — no
backend, no websocket router needed for single-player (the multiplayer
message-router in the companion `doom-workers` repo is explicitly **out of
scope**; single-player only).

**Steps:**
1. `git clone --depth 1 https://github.com/cloudflare/doom-wasm /tmp/doom-wasm-src`.
   Inspect `src/` (or wherever the built `doom.wasm`/`doom.js`/loader HTML
   live per the repo's own build docs) — the repo may require running its
   documented build once (likely emscripten via a provided script/Docker
   image) to produce the wasm+js output; if a pre-built release/artifact
   exists, prefer that over rebuilding.
2. `doom1.wad` is the id Software shareware WAD — freely distributable since
   1993, safe to vendor. If not already bundled in the repo output, fetch it
   from the widely-mirrored shareware release (verify checksum against a
   known-good `doom1.wad`, ~4.2MB, before including).
3. Copy the built output (`doom.wasm`, `doom.js`/glue, `doom1.wad`, and
   whatever minimal HTML/JS the upstream `index.html` uses to boot into a
   canvas) into `public/apps/doom/`. Strip anything multiplayer/websocket-
   specific — single-player boot only.
4. Register via a **dedicated** `DoomApp.jsx` (not the generic IframeApp,
   since Doom needs a canvas + focus handling for keyboard capture inside
   an OS window) or an iframe if the upstream HTML is self-contained enough
   — try iframe first (simplest, consistent with the other three); fall
   back to a thin wrapper component only if keyboard-focus stealing inside
   `OsWindow`'s draggable chrome causes problems (click-to-focus the iframe
   first).
5. Desktop icon (lucide `Skull` or `Gamepad2`) **plus** a Start Menu entry —
   the user explicitly asked for a desktop icon.
6. `THIRD_PARTY_LICENSES.md` entry noting Chocolate Doom's GPL and the
   Cloudflare port's license.
7. CHANGELOG: Added — "Doom, playable from the desktop (vendored, open
   source, single-player, no network required)."

**Verify:** double-click desktop icon → window opens → Doom boots to its
title screen inside the canvas → keyboard input reaches the game (arrow
keys move, Ctrl fires, Space opens doors) without the OS window intercepting
it → build passes; note the actual asset size in the commit message (WAD +
wasm will likely be several MB — expected and fine, per the static/public
architecture note above).
**Commit:** `feat(doom): playable Doom from the desktop (vendored, open source, single-player)`

---

---

### WP16 — Diablo (honest scoping — read before starting)

**Added after WP15, at the user's request for "Diablo 2." This package is
different in kind from WP13–15: unlike Doom's shareware WAD (freely
distributable since 1993) or Solitaire/Minesweeper/Paint (fully MIT/GPL,
code *and* assets both open), Diablo II's game data — sprites, sounds, story
content, MPQ archives — was never open-sourced and is still sold commercially
(Diablo II: Resurrected, GOG). No engine project ships it, and this repo
must not either. Vendoring Blizzard's copyrighted assets into a public
GitHub repo would be distributing pirated commercial content — out of
bounds, full stop, regardless of how the engine code is licensed.**

**What's actually real, researched 2026-07-03:**

| Project | Game | Engine license | Completeness | Web/WASM build |
|---|---|---|---|---|
| [OpenDiablo2](https://github.com/OpenDiablo2/OpenDiablo2) | Diablo II | open source (Go) | historically incomplete/stalled; verify current activity before investing time | none known |
| [DevilutionX](https://github.com/diasurgical/devilutionX) | **Diablo 1** (not II) | open source | mature, actively maintained, genuinely playable end-to-end | **yes** — Emscripten/WASM web build exists |

Both require the **user to supply their own legally-owned game data**
(OpenDiablo2: Diablo II + Lord of Destruction installed; DevilutionX:
`DIABDAT.MPQ` from an owned CD or GOG copy) — the data never lives in this
repo, never gets committed, and is loaded strictly client-side from a local
file the user provides at runtime (e.g. a drag-and-drop file picker writing
into browser storage, gitignored, never touching git history).

**Recommendation for "the next guy":** pursue **DevilutionX**, not
OpenDiablo2. It is the substitute that's actually deliverable — mature,
complete, WASM-capable — even though it's Diablo I rather than II. Verify
OpenDiablo2's current repo activity/archival status first if Diablo II
specifically is a hard requirement; historically it has stalled short of a
fully playable state, which would make this package undeliverable regardless
of legal posture.

**Save/load — the good news:** this is the most tractable part of the whole
package, and it dovetails directly with work already shipped in this repo.
Emscripten's `IDBFS` (IndexedDB-backed virtual filesystem) is the standard
way these WASM game ports persist save files in-browser — the same
IndexedDB the CivicOS kernel (`src/kernel/storage.js`) already uses for
everything else. `FS.mount(IDBFS, {}, '/save')` + periodic `FS.syncfs()` is
the whole mechanism; no new architecture, just Emscripten's existing hook
into the browser's existing IndexedDB.

**If pursued:**
1. Confirm OpenDiablo2/DevilutionX's current state and pick one (default:
   DevilutionX per above).
2. Build (or find a prebuilt) Emscripten/WASM target — DevilutionX's repo
   documents a web build; follow it, don't reinvent it.
3. Vendor **only the compiled engine** (`.wasm`/`.js`/loader `index.html`)
   into `public/apps/diablo/` — never any `.mpq`/asset files.
4. Build a `DiabloApp.jsx` (not the generic IframeApp) with a one-time
   "Load Game Data" file picker: user selects their own `DIABDAT.MPQ`
   (or D2 equivalent) from disk; write it into the Emscripten virtual FS
   (`FS.writeFile`) — never into a snapshot, never into git, never leaves
   the browser.
5. Wire `IDBFS` for save games as described above.
6. Desktop icon + Start Menu entry, same registration recipe as WP13–15.
7. `THIRD_PARTY_LICENSES.md` entry for the engine; a clear in-app notice
   that game data is user-supplied and not included, with the legal
   rationale one sentence, matching this section.

**Verify:** engine boots to title screen with zero bundled game data; the
file picker successfully loads a user-supplied MPQ; a save made in-session
survives a reload (proves IDBFS→IndexedDB persistence); no game asset file
ever appears in `git status` or the repo history.
**Commit:** `feat(diablo): playable DevilutionX engine from the desktop; user supplies own legally-owned game data`

---

---

### WP17 — Further open-source game candidates (backlog, not yet scoped)

Requested as a follow-up recommendation list. These share Doom's clean legal
pattern — original creator released the source *and* the assets are freely
distributable — so none carry WP16's Diablo-style asset problem. Not yet
speced to WP-level detail; each needs its own repo/build verification pass
before a build package is written.

| Game | Why it's clean | Notes |
|---|---|---|
| **Wolfenstein 3D** | id Software GPL source release; shareware data freely distributable since 1993 (same status as Doom's WAD) | Smaller footprint than Doom, several existing WASM/JS ports — verify current best port before vendoring |
| **Quake** | id Software GPL source release; shareware `pak0.pak` freely distributable | `quakejs` (browser Quake via Emscripten/WebGL) is a known, actually-deployed port — more technically impressive than Wolf3D, similar vendoring pattern to WP15 |
| **Colossal Cave Adventure** | Original 1976 game; `esr/open-adventure` is an explicitly open-sourced, permissively-licensed C port maintained by Eric S. Raymond | Tiny footprint, arguably the first computer game ever made — thematically perfect for a nostalgic OS; compiles to WASM trivially given its size |
| **Freeciv-web** | Freeciv is fully open source (GPL), code *and* assets both free — no third-party data problem at all | Genuinely browser-native already; verify whether its architecture needs a backend civserver for single-player or if there's a fully client-side mode before committing to it |
| **OpenRA** | Reimplements Command & Conquer/Red Alert/Dune 2000; Westwood released the original C&C/Red Alert assets as freeware in 2007, so OpenRA needs no purchased data | Best-known desktop build is native (Mono), not WASM — would need a web-build feasibility check first, unlike the others in this list |

Recommended next step if any of these move forward: repeat the WP13–15
research pattern (search → verify license → verify web/WASM build exists or
is feasible → verify asset distributability) before writing a build package.

---

## Final Acceptance (run once, after WP15)

- [ ] `npm run build` passes
- [ ] Every WP1–WP12 checklist row verified manually
- [ ] Solitaire, Minesweeper, Paint, Doom all open from both a desktop icon
      and/or Start Menu entry and are genuinely usable
- [ ] `THIRD_PARTY_LICENSES.md` lists all four vendored apps with upstream
      URL + license
- [ ] `node scripts/check-5050-namespaces.mjs` passes (adapter up)
- [ ] `CHANGELOG.md` `[Unreleased]` reflects every package
- [ ] No orphaned components remain (`grep` sweep for the four deleted names)
