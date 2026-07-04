# Third-Party Licenses

CivicOS vendors a small number of complete open-source applications as static
assets under `public/apps/<name>/`. Each is served unmodified (or with only
the trimming noted below) and keeps its own upstream license file in its own
directory. Vendoring one of these does not relicense it — it remains under
its original terms, alongside CivicOS's own MIT license for the rest of the
codebase. This is standard practice for projects that bundle third-party
components under different licenses (VS Code does the same).

| App | Path | Upstream | License | Notes |
| --- | --- | --- | --- | --- |
| Solitaire | `public/apps/solitaire/` | [jhatzimalis/solitaire](https://github.com/jhatzimalis/solitaire) | MIT | Single `index.html`, vendored unmodified |
| Minesweeper | `public/apps/minesweeper/` | [sylhare/Minesweeper](https://github.com/sylhare/Minesweeper) | GPL-3.0 | `index.html` + `js/`/`css`/`img/`; test suite and CI config excluded |
| Paint | `public/apps/jspaint/` | [1j01/jspaint](https://github.com/1j01/jspaint) | MIT | `src/`/`lib/`/`styles/`/`audio/`/`images/`/`localization/`/`help/` + root HTML; Electron desktop build, Discord Activity sub-project, Cypress tests, and dev scripts excluded (not referenced by the vendored `index.html`) |

Before vendoring, each app's source was read (in full for Solitaire and
Minesweeper; at scale — full grep sweep for `eval`/network calls/telemetry
across every JS file, plus targeted reads of every hit — for jspaint, given
its larger size) to check for unexpected network calls, `eval`, obfuscation,
or other supply-chain risk.

- Solitaire / Minesweeper: clean. Canvas/DOM rendering only, same-origin
  `localStorage` for game state, no external requests.
- jspaint: clean. `eval`/`new Function` hits are confined to vendored
  upstream libraries (Mozilla's `pdf.js`, and the author's own `no-eval.js`
  security helper). Real outbound calls exist (Imgur upload, speech
  recognition via a CORS proxy, real-time collaboration, a Help→About
  "check for updates" fetch to `jspaint.app`) but every one is gated behind
  an explicit user menu action or a dev-only URL hash — none fire
  automatically on load. The collaboration feature's `/api/rooms/*` calls
  target no backend in this deployment and simply no-op.

See `WORKRUN.md` for the remaining vendored app planned (Doom) and its
license once added.
