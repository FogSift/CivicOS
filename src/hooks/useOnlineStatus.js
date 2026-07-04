/**
 * @fileId d2063a9d-f689-4dad-acff-80651e8fc7aa
 * @module CivicOS/src/hooks/useOnlineStatus.js
 * @description Live navigator.onLine tracking with online/offline listeners.
 */

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}
