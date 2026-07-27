/**
 * journalBridge.js: mirror a Nova run into the shared agent journal.
 *
 * SimpleAgentOS and NovaSystem both write to one PocketBase collection
 * (`agent_journal`) so either can ask what the other learned. CivicOS was the
 * one system in that group with no way in: a Nova run landed in the browser's
 * IndexedDB ledger and stopped there, which is why a cross-project view of the
 * journal only ever showed two projects.
 *
 * This is the third door. It is deliberately thin:
 *
 * - OFF unless VITE_NOVA_JOURNAL=1. A civic desktop should not quietly POST
 *   what a user typed to a local service they did not ask to run.
 * - Best effort. Every failure path resolves rather than throws, so mirroring
 *   can never break the ledger write it hangs off. The ledger stays the record;
 *   the journal is only an index onto it.
 * - No dependencies. Plain fetch against the same public-rule collection the
 *   Python clients use, which is safe only because it is bound to loopback.
 *
 * Testing this end to end writes real records. Point it at the scratch
 * collection so a browser test does not bury the real memory, the same way the
 * Python suites do:
 *
 *   VITE_NOVA_JOURNAL=1 VITE_NOVA_JOURNAL_COLLECTION=agent_journal_test npm run dev
 */

const BASE = (import.meta.env?.VITE_NOVA_JOURNAL_BASE || 'http://127.0.0.1:8090').replace(/\/$/, '');
const COLLECTION = import.meta.env?.VITE_NOVA_JOURNAL_COLLECTION || 'agent_journal';
const PROJECT = import.meta.env?.VITE_NOVA_JOURNAL_PROJECT || 'CivicOS';
const TIMEOUT_MS = 1500;

export function journalEnabled() {
  return String(import.meta.env?.VITE_NOVA_JOURNAL || '0') === '1';
}

/** PocketBase wants "YYYY-MM-DD HH:MM:SS.sssZ", not a bare ISO string. */
function pbDate(d) {
  return d.toISOString().replace('T', ' ');
}

/** 15 lowercase alphanumerics, the shape PocketBase uses for record ids. */
function entryId() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(15);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

/**
 * Mirror one Nova run. Returns { ok, reason } and never rejects.
 *
 * `detail` is the same payload the `nova.run` ledger event carries, so the two
 * records describe the same thing and can be lined up after the fact.
 */
export async function mirrorNovaRun(detail) {
  if (!journalEnabled()) return { ok: false, reason: 'disabled' };
  if (!detail) return { ok: false, reason: 'no detail' };

  const now = new Date();
  const problem = String(detail.problem || '').trim();
  const title = problem.length > 120 ? `${problem.slice(0, 119)}…` : problem;

  const record = {
    entry_id: entryId(),
    occurred_at: pbDate(now),
    kind: 'decision',
    actor: 'nova-process',
    source: 'civicos',
    project: PROJECT,
    title: title || 'Nova run',
    body: [
      problem,
      '',
      `verdict: ${detail.verdict ?? 'unknown'}`,
      `specification: ${detail.specification ?? 'n/a'}`,
      `facets: ${detail.facets ?? 0}`,
      Array.isArray(detail.actions) && detail.actions.length
        ? `actions:\n${detail.actions.map((a) => `  - ${typeof a === 'string' ? a : a.text || JSON.stringify(a)}`).join('\n')}`
        : '',
    ].filter(Boolean).join('\n'),
    tags: ['nova', 'civicos', 'nova.run'],
    // The specification score measures how completely the problem was stated,
    // not how good the answer is. It is the only ranking signal the run has.
    importance: typeof detail.specification === 'number' ? detail.specification : 0.5,
    metadata: { civicos: true, ...detail },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(`${BASE}/api/collections/${COLLECTION}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      signal: controller.signal,
    });
    if (!resp.ok) return { ok: false, reason: `HTTP ${resp.status}` };
    return { ok: true, reason: '' };
  } catch (err) {
    // Journal down, blocked, or timed out. The ledger write already happened.
    return { ok: false, reason: err?.name === 'AbortError' ? 'timeout' : 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}
