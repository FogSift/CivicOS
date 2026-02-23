# Contributing to CivicOS

> Vibe code a government. Welcome aboard.

CivicOS is built for both human and AI contributors. These guidelines keep the codebase coherent as it grows.

---

## Table of Contents

1. [File Identity — @fileId](#file-identity)
2. [Versioning](#versioning)
3. [Branch & PR Workflow](#branch--pr-workflow)
4. [Commit Style](#commit-style)
5. [AI Contributor Notes](#ai-contributor-notes)

---

## File Identity

Every source file in `src/` carries a stable UUID header. This ID **never changes**, even if the file is renamed or moved. It is the file's permanent identity across git history, contributor attribution, and AI context windows.

### Format

```js
/**
 * @fileId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * @module CivicOS/ComponentName
 * @description One-line description of what this file does.
 */
```

### Creating a new file

Use the scaffold script — it generates the UUID and header for you:

```bash
node scripts/new-file.js src/components/MyComponent.jsx "One-line description"
```

Or generate a UUID manually and add the header yourself:

```bash
node -e "console.log(require('crypto').randomUUID())"
```

### Rules

- **Never reuse** a `@fileId` from another file.
- **Never change** a `@fileId` once it is committed.
- Every new file in `src/` must have a `@fileId` before merging.

---

## Versioning

CivicOS uses [Semantic Versioning](https://semver.org):

| Bump | When | Command |
|------|------|---------|
| `patch` (0.0.**x**) | Bug fix, copy tweak, minor UI polish | `npm version patch` |
| `minor` (0.**x**.0) | New feature, unlock a Network Module | `npm version minor` |
| `major` (**x**.0.0) | Breaking change, major architecture shift | `npm version major` |

### Single source of truth

The version lives in **`package.json`** only. `src/version.js` imports from it — never hardcode the version string anywhere else.

### Release workflow

```bash
# 1. Bump version (also creates a git tag automatically)
npm version patch

# 2. Update src/version.js — set release.date, release.notes, release.label
# 3. Add an entry to CHANGELOG.md

# 4. Commit the metadata update
git add src/version.js CHANGELOG.md
git commit -m "chore: release vX.Y.Z"

# 5. Push with tags
git push origin main --tags

# 6. Create GitHub release
gh release create vX.Y.Z --title "vX.Y.Z — Title" --notes "..."
```

---

## Branch & PR Workflow

```
main          ← always releasable
└── feat/my-feature
└── fix/bug-description
└── chore/maintenance-task
```

- Branch from `main`, PR back into `main`.
- One feature per PR when possible.
- PRs need a passing build (`npm run build`) before merge.

---

## Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add Treasury Escrow module
fix: correct vote count on discard
chore: bump to v0.0.2
docs: update CONTRIBUTING.md
refactor: extract ResourceCard component
```

---

## AI Contributor Notes

If you are an AI agent contributing to this codebase:

1. **Always read a file before editing it.**
2. **Never remove or change a `@fileId`.**
3. **Never hardcode the version string** — import from `package.json` or use `__APP_VERSION__`.
4. **Use `node scripts/new-file.js`** when creating new source files.
5. **Update `CHANGELOG.md`** under `[Unreleased]` for any user-visible change.
6. **Do not commit** unless explicitly asked. Stage changes and describe what you've done.
7. When in doubt, ask the human before taking destructive or irreversible actions.
