/**
 * @fileId 61ec2f4d-3473-4214-bc1a-1c84b42576c3
 * @module CivicOS/src/hooks/useTheme.js
 * @description Theme state — reads/writes data-theme on html element, persists to localStorage
 */

import { useState, useEffect } from 'react';

const THEMES = ['classic', 'creme'];
const STORAGE_KEY = 'civicos-theme';

export function useTheme() {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? 'classic'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    if (THEMES.includes(newTheme)) setThemeState(newTheme);
  };

  return { theme, setTheme, themes: THEMES };
}
