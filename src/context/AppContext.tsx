import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from '@/i18n/translations';

type Theme = 'light' | 'dark';

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('zonexa-theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('zonexa-lang');
      if (stored === 'en' || stored === 'kn') return stored;
    }
    return 'en';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zonexa-auth') === 'true';
    }
    return false;
  });

  const [currentPage, setCurrentPage] = useState<string>('input-studio');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('zonexa-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zonexa-lang', lang);
  }, [lang]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'kn' : 'en'));
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[lang][key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  const login = useCallback((email: string) => {
    localStorage.setItem('zonexa-auth', 'true');
    localStorage.setItem('zonexa-email', email);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('zonexa-auth');
    setIsAuthenticated(false);
    setCurrentPage('input-studio');
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLang,
        t,
        isAuthenticated,
        login,
        logout,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
