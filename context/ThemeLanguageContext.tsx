
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../locales';

export { SUPPORTED_LANGUAGES, type Language } from '../locales';

type Theme = 'light' | 'dark';

interface ThemeLanguageContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoaded: boolean;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

import fr from '../locales/fr.json';
import en from '../locales/en.json';
import de from '../locales/de.json';
import es from '../locales/es.json';
import it from '../locales/it.json';

const TRANSLATIONS: Record<string, any> = {
  fr,
  en,
  de,
  es,
  it
};

export const ThemeLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always default to 'dark' strictly
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState<Record<string, string>>(fr);
  const [isLoaded, setIsLoaded] = useState(true);

  // Enforce dark mode class on mount
  useEffect(() => {
    const root = document.documentElement;
    // Always start with dark to avoid flash
    if (!root.classList.contains('dark')) {
      root.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Load translations synchronously
  useEffect(() => {
    setTranslations(TRANSLATIONS[language] || fr);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, toggleTheme, language, setLanguage, t, isLoaded }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (context === undefined) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
