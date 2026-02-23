/**
 * @fileId 14d7c078-3327-49ac-ba47-a364786a7e13
 * @module CivicOS/version
 * @description Single source of truth for release metadata.
 *              The version number is sourced from package.json — never hardcode it here.
 *              Bump via: npm version patch|minor|major
 */

import { version as _version } from '../package.json';

/** Semver string pulled directly from package.json — e.g. "0.0.1" */
export const version = _version;

/** Full release metadata for the current build */
export const release = {
  version,
  tag: `v${version}`,
  date: '2026-02-22',
  channel: 'alpha',           // alpha | beta | rc | stable
  label: 'super-early-bird',  // human tag; set to null for unbranded releases

  notes: [
    'XP-themed login screen with demo workspace entry',
    'Discovery Feed (The Radar) with consensus up/downvoting',
    'Active Pipeline kanban — 4 columns (Discovery → Vetting → Drafting → Under Review)',
    'Asset Vault folder icon view',
    'Add Node modal for submitting new funding leads',
    'Locked Network Modules sidebar (Governance Rules, Treasury Escrow, Node Map)',
  ],
};

/**
 * Versioning guide for contributors (human and AI):
 *
 *   patch (0.0.x) — bug fix, copy tweak, minor UI polish
 *   minor (0.x.0) — new feature, unlock a Network Module
 *   major (x.0.0) — breaking change, major architectural shift
 *
 * Release workflow:
 *   1. npm version patch|minor|major     ← bumps package.json + creates git tag
 *   2. Update release.date and release.notes above
 *   3. Add entry to CHANGELOG.md
 *   4. git push origin main --tags
 *   5. gh release create v{version} --notes "..."
 */
