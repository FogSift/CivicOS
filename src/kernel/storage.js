/**
 * @fileId 8424a6d7-75f1-42d1-801f-e63783332c84
 * @module CivicOS/src/kernel/storage.js
 * @description Kernel storage adapter — IndexedDB backend with in-memory fallback. The adapter interface is the contract for future backends (PGLite).
 */

/**
 * Adapter contract — any future backend (PGLite, etc.) must implement exactly this:
 *
 *   backend            'indexeddb' | 'memory'
 *   get(store, key)    -> Promise<value | undefined>
 *   put(store, key, v) -> Promise<void>
 *   append(store, v)   -> Promise<number>   // generated auto-increment key
 *   getAll(store)      -> Promise<Array>    // key order (== insertion order)
 *   count(store)       -> Promise<number>
 *
 * Stores: 'kv' (out-of-line string keys, state snapshots) and
 *         'events' (keyPath 'id', autoIncrement — the append-only ledger).
 *
 * Multi-tab: last-writer-wins on 'kv'. Acceptable at v0.0.x.
 */

const DB_NAME = 'civicos-kernel';
const DB_VERSION = 1;
const OPEN_TIMEOUT_MS = 2000;

const promisify = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      // Switch on oldVersion so v2+ migrations slot in beneath this block.
      if (event.oldVersion < 1) {
        db.createObjectStore('kv');
        db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('IndexedDB open blocked'));
  });
}

function createIndexedDbStorage(db) {
  const tx = (store, mode) => db.transaction(store, mode).objectStore(store);

  return {
    backend: 'indexeddb',
    get: (store, key) => promisify(tx(store, 'readonly').get(key)),
    put: (store, key, value) =>
      promisify(tx(store, 'readwrite').put(value, key)).then(() => undefined),
    append: (store, value) => promisify(tx(store, 'readwrite').add(value)),
    getAll: (store) => promisify(tx(store, 'readonly').getAll()),
    count: (store) => promisify(tx(store, 'readonly').count()),
  };
}

export function createMemoryStorage() {
  const stores = { kv: new Map(), events: new Map() };
  let nextId = 1;

  return {
    backend: 'memory',
    get: (store, key) => Promise.resolve(stores[store].get(key)),
    put: (store, key, value) => {
      stores[store].set(key, value);
      return Promise.resolve();
    },
    append: (store, value) => {
      const id = nextId++;
      stores[store].set(id, { ...value, id });
      return Promise.resolve(id);
    },
    getAll: (store) => Promise.resolve([...stores[store].values()]),
    count: (store) => Promise.resolve(stores[store].size),
  };
}

/**
 * Create the kernel storage adapter. Tries IndexedDB; falls back to a
 * session-only in-memory backend when IndexedDB is unavailable (private-mode
 * Firefox), rejects, or hangs on open (known Safari bug — hence the timeout).
 */
export async function createStorage() {
  if (typeof indexedDB === 'undefined') return createMemoryStorage();

  try {
    const db = await Promise.race([
      openDatabase(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('IndexedDB open timed out')), OPEN_TIMEOUT_MS)
      ),
    ]);
    return createIndexedDbStorage(db);
  } catch (error) {
    console.warn('CivicOS kernel: IndexedDB unavailable, using memory backend.', error);
    return createMemoryStorage();
  }
}
