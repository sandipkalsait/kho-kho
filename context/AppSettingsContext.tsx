import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themes, { ThemeColors, ThemeKey } from '@/constants/colors';
import { LanguageKey, getTranslations, Translations } from '@/lib/i18n';

interface AppSettingsContextValue {
  themeKey: ThemeKey;
  colors: ThemeColors;
  setThemeKey: (key: ThemeKey) => void;
  languageKey: LanguageKey;
  t: Translations;
  setLanguageKey: (key: LanguageKey) => void;
}

const THEME_STORAGE_KEY = '@khokho_theme';
const LANGUAGE_STORAGE_KEY = '@khokho_language';

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>('mintSage');
  const [languageKey, setLanguageKeyState] = useState<LanguageKey>('en');

  useEffect(() => {
    (async () => {
      const [savedTheme, savedLang] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
      ]);
      if (savedTheme && (savedTheme === 'mintSage' || savedTheme === 'oceanBlue' || savedTheme === 'sunsetWarm')) {
        setThemeKeyState(savedTheme as ThemeKey);
      }
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'mr')) {
        setLanguageKeyState(savedLang as LanguageKey);
      }
    })();
  }, []);

  const setThemeKey = useCallback(async (key: ThemeKey) => {
    setThemeKeyState(key);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, key);
  }, []);

  const setLanguageKey = useCallback(async (key: LanguageKey) => {
    setLanguageKeyState(key);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, key);
  }, []);

  const colors = themes[themeKey];
  const t = getTranslations(languageKey);

  const value = useMemo(() => ({
    themeKey,
    colors,
    setThemeKey,
    languageKey,
    t,
    setLanguageKey,
  }), [themeKey, colors, setThemeKey, languageKey, t, setLanguageKey]);

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
}
