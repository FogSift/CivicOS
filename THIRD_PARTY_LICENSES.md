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

Before vendoring, each app's source was read in full (not just its README)
to check for unexpected network calls, `eval`, obfuscation, or other
supply-chain risk. Findings are recorded in this session's history; both
were clean — canvas/DOM rendering only, same-origin `localStorage` for
game state, no external requests.

See `WORKRUN.md` for the remaining vendored apps planned (JS Paint, Doom)
and their licenses once added.
