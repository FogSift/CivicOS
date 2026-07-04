/**
 * @fileId 4a868153-7bb3-4b99-a6e9-24b47aab90a2
 * @module CivicOS/src/kernel/CivicProvider.jsx
 * @description Kernel context provider — boots storage, hydrates snapshots, exposes useKernel().
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createStorage } from './storage';
import { createEventLog } from './events';
import BootScreen from './BootScreen';

const KernelContext = createContext(null);

// Children mount only after hydration, so they can read snapshots
// synchronously in useState/useReducer initializers.
const MIN_BOOT_MS = 700;

const SNAPSHOT_KEYS = ['resources', 'session', 'windows', 'notepad'];

// Envelope check: corrupt, missing, or wrong-version snapshots yield
// undefined, which consumers translate to their seed state.
const unwrapSnapshot = (raw) => (raw && raw.v === 1 ? raw.data : undefined);

export function useKernel() {
  const kernel = useContext(KernelContext);
  if (!kernel) throw new Error('useKernel must be used inside <CivicProvider>');
  return kernel;
}

export default function CivicProvider({ children }) {
  const [boot, setBoot] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return; // StrictMode double-invoke guard
    bootedRef.current = true;
    const bootStart = Date.now();

    const initialize = async () => {
      const storage = await createStorage();
      const log = createEventLog(storage);

      const [rawSnapshots, count] = await Promise.all([
        Promise.all(SNAPSHOT_KEYS.map((key) => storage.get('kv', key))),
        log.countEvents(),
      ]);

      const snapshots = {};
      SNAPSHOT_KEYS.forEach((key, i) => {
        snapshots[key] = unwrapSnapshot(rawSnapshots[i]);
      });

      await log.logEvent('kernel.boot', { backend: storage.backend });

      const elapsed = Date.now() - bootStart;
      if (elapsed < MIN_BOOT_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_BOOT_MS - elapsed));
      }

      setEventCount(count + 1);
      setBoot({ storage, log, snapshots });
    };

    initialize().catch((error) => {
      console.error('CivicOS kernel: boot failed', error);
    });
  }, []);

  const saveSnapshot = useCallback(
    (key, data) => {
      if (!boot) return Promise.resolve();
      boot.snapshots[key] = data; // keep in-session reads fresh (close/reopen a window)
      return boot.storage.put('kv', key, { v: 1, data });
    },
    [boot]
  );

  const logEvent = useCallback(
    (type, payload) => {
      if (!boot) return Promise.resolve(null);
      return boot.log.logEvent(type, payload).then((event) => {
        setEventCount((n) => n + 1);
        return event;
      });
    },
    [boot]
  );

  const getEvents = useCallback(() => (boot ? boot.log.getEvents() : Promise.resolve([])), [boot]);

  const value = useMemo(
    () =>
      boot && {
        status: 'ready',
        backend: boot.storage.backend,
        snapshots: boot.snapshots,
        saveSnapshot,
        logEvent,
        getEvents,
        eventCount,
      },
    [boot, saveSnapshot, logEvent, getEvents, eventCount]
  );

  if (!value) return <BootScreen />;

  return <KernelContext.Provider value={value}>{children}</KernelContext.Provider>;
}
