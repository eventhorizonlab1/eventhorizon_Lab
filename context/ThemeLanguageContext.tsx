
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

export const ThemeLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always default to 'dark' strictly
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Load translations asynchronously
  useEffect(() => {
    const loadTranslations = async () => {
      // Don't set isLoaded to false here to avoid flashing loading state on language switch if possible,
      // or do it if we want to show a spinner. Let's keep it smooth.
      try {
        const module = await import(`../locales/${language}.json`);
        setTranslations(module.default);
        setIsLoaded(true);
      } catch (error) {
        console.error(`Failed to load translations for ${language}`, error);
        // Fallback to French
        if (language !== 'fr') {
          try {
            const module = await import(`../locales/fr.json`);
            setTranslations(module.default);
          } catch (e) {
            console.error("Failed to load fallback translations", e);
          }
        }
      }
    };

    loadTranslations();
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
