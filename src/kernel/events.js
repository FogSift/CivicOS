/**
 * @fileId 233708d5-a634-4f00-bd26-08211cf45345
 * @module CivicOS/src/kernel/events.js
 * @description Append-only civic event ledger built on the kernel storage adapter.
 */

/**
 * Event shape: { id: <auto>, v: 1, ts: <epoch ms>, type, payload, actor: 'local' }
 * 'actor' becomes a Paper Key fingerprint at VISION step 2 (Identity).
 */
export const EVENT_TYPES = {
  'kernel.boot':      { label: 'Kernel',   color: '#e07b3c' },
  'session.logon':    { label: 'Session',  color: '#2a5cce' },
  'session.logoff':   { label: 'Session',  color: '#2a5cce' },
  'theme.change':     { label: 'Theme',    color: '#6b3fa0' },
  'window.open':      { label: 'Window',   color: '#777777' },
  'window.close':     { label: 'Window',   color: '#777777' },
  'resource.vote':    { label: 'Resource', color: '#3a7a5c' },
  'resource.commit':  { label: 'Resource', color: '#3a7a5c' },
  'resource.discard': { label: 'Resource', color: '#c2410c' },
  'resource.add':     { label: 'Resource', color: '#3a7a5c' },
  'resource.move':    { label: 'Resource', color: '#3a7a5c' },
  'settings.change':  { label: 'Settings', color: '#1e76a2' },
  'user.rename':      { label: 'Session',  color: '#2a5cce' },
  'notepad.new':      { label: 'Notepad',  color: '#777777' },
  'notepad.save':     { label: 'Notepad',  color: '#777777' },
  'nova.run':         { label: 'Nova',     color: '#57d97a' },
};

export function createEventLog(storage) {
  return {
    logEvent(type, payload = {}) {
      const event = { v: 1, ts: Date.now(), type, payload, actor: 'local' };
      return storage.append('events', event).then((id) => ({ ...event, id }));
    },
    getEvents() {
      return storage.getAll('events');
    },
    countEvents() {
      return storage.count('events');
    },
  };
}
