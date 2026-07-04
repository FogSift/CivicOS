/**
 * @fileId d14e2683-636d-406d-b4d1-042590246397
 * @module CivicOS/src/hooks/useSettings.js
 * @description Persisted UI settings (sound on/off, volume) — single source of truth, owned by App.jsx.
 */

import { useState, useEffect } from 'react';
import { useKernel } from '../kernel/CivicProvider.jsx';

const DEFAULT_SETTINGS = { uiSounds: true, volume: 75 };

export function useSettings() {
  const { snapshots, saveSnapshot, logEvent } = useKernel();
  const [settings, setSettings] = useState(() => snapshots.settings ?? DEFAULT_SETTINGS);

  useEffect(() => {
    saveSnapshot('settings', settings);
  }, [settings, saveSnapshot]);

  const updateSettings = (patch) => {
    logEvent('settings.change', patch);
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return { settings, updateSettings };
}
