/**
 * CivicOS Version Manager
 *
 * Single source of truth for release metadata.
 * Import anywhere: import { version, release } from './version.js'
 *
 * Bump this file + package.json together on each release.
 * Tagging convention: git tag v{major}.{minor}.{patch}
 */

export const version = {
  major: 0,
  minor: 0,
  patch: 1,
  label: "super-early-bird",      // optional human tag; null for stable releases
  toString() {
    const base = `${this.major}.${this.minor}.${this.patch}`;
    return this.label ? `${base}-${this.label}` : base;
  },
};

export const release = {
  tag: `v${version}`,             // "v0.0.1-super-early-bird"
  date: "2026-02-22",
  channel: "alpha",               // alpha | beta | rc | stable
  notes: [
    "XP-themed login screen",
    "Discovery Feed with consensus voting (upvote / downvote)",
    "Active Pipeline kanban (Discovery → Vetting → Drafting → Under Review)",
    "Asset Vault folder view",
    "Add Node modal",
    "Locked Network Modules sidebar (Governance, Treasury, Node Map)",
  ],
};

/**
 * Bump helpers — call these manually or wire into a release script.
 *
 * Usage (conceptual, not live):
 *   bumpPatch()  → 0.0.1 → 0.0.2
 *   bumpMinor()  → 0.0.x → 0.1.0
 *   bumpMajor()  → 0.x.x → 1.0.0
 *
 * Actual bumping: edit version.major / minor / patch above,
 * run `npm version patch|minor|major` to sync package.json,
 * then `git tag v{version} && git push --tags`.
 */
export const bumpGuide = {
  patch: "bug fixes, copy tweaks, minor UI polish",
  minor: "new feature or unlocked Network Module",
  major: "breaking change or major architectural shift",
};
