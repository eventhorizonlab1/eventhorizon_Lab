
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, Language } from '../locales';

export { SUPPORTED_LANGUAGES, type Language } from '../locales';

type Theme = 'light' | 'dark';

interface ThemeLanguageContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always default to 'dark' strictly
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('fr');

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['fr'];
    return langDict[key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, toggleTheme, language, setLanguage, t }}>
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
