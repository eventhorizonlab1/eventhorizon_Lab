import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = string;
type Theme = 'light' | 'dark';

export const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'bs', name: 'Bosanski', flag: '🇧🇦' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
  { code: 'lb', name: 'Lëtzebuergesch', flag: '🇱🇺' },
  { code: 'be', name: 'Беларуская', flag: '🇧🇾' },
  { code: 'ca', name: 'Català', flag: '🇦🇩' },
  { code: 'eu', name: 'Euskara', flag: '🇪🇸' },
  { code: 'gl', name: 'Galego', flag: '🇪🇸' },
  { code: 'cy', name: 'Cymraeg', flag: '🇬🇧' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ka', name: 'Kartuli', flag: '🇬🇪' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
];

interface TranslationSet {
  [key: string]: string;
}

interface Translations {
  [key: string]: TranslationSet;
}

// Basic translations for major languages, others fallback to EN
const translations: Translations = {
  // Nav
  nav_videos: { 
    fr: 'Vidéos', en: 'Videos', de: 'Videos', es: 'Vídeos', it: 'Video', pt: 'Vídeos', nl: 'Video\'s' 
  },
  nav_articles: { 
    fr: 'Articles', en: 'Articles', de: 'Artikel', es: 'Artículos', it: 'Articoli', pt: 'Artigos', nl: 'Artikelen' 
  },
  nav_ecosystem: { 
    fr: 'Écosystème', en: 'Ecosystem', de: 'Ökosystem', es: 'Ecosistema', it: 'Ecosistema', pt: 'Ecossistema', nl: 'Ecosysteem' 
  },
  nav_studio: { 
    fr: 'IA Oracle', en: 'Oracle AI', de: 'Orakel KI', es: 'IA Oráculo', it: 'IA Oracolo', pt: 'IA Oráculo', nl: 'Orakel AI' 
  },
  
  // Hero
  hero_line1: { 
    fr: 'DANS LES COULISSES', en: 'BEHIND THE SCENES', de: 'HINTER DEN KULISSEN', es: 'ENTRE BASTIDORES', it: 'DIETRO LE QUINTE' 
  },
  hero_line2: { 
    fr: "DE L'EUROPE SPATIALE", en: 'OF EUROPEAN SPACE', de: 'DER EUROPÄISCHEN RAUMFAHRT', es: 'DEL ESPACIO EUROPEO', it: 'DELLO SPAZIO EUROPEO' 
  },
  hero_subtitle: { 
    fr: "Une plongée immersive au cœur de l'industrie aérospatiale, de Toulouse à Kourou.", 
    en: "An immersive dive into the heart of the aerospace industry, from Toulouse to Kourou.",
    de: "Ein immersiver Tauchgang in das Herz der Luft- und Raumfahrtindustrie, von Toulouse bis Kourou.",
    es: "Una inmersión profunda en el corazón de la industria aeroespacial, desde Toulouse hasta Kourou.",
    it: "Un'immersione nel cuore dell'industria aerospaziale, da Tolosa a Kourou."
  },
  hero_cta: { fr: 'Découvrez nos vidéos', en: 'Watch our videos', de: 'Videos ansehen', es: 'Ver videos', it: 'Guarda i video' },
  hero_scroll: { fr: 'Scroll pour explorer', en: 'Scroll to explore', de: 'Scrollen zum Entdecken', es: 'Desplazar para explorar', it: 'Scorri per esplorare' },
  
  hero_history_title: { fr: "Odyssée Orbitale", en: "Orbital Odyssey", de: "Orbitale Odyssee", es: "Odisea Orbital", it: "Odissea Orbitale" },
  hero_history_sub: { fr: "Les grandes étapes de la conquête spatiale européenne", en: "Major milestones in European space conquest" },

  // Videos
  videos_title: { fr: 'Vidéos', en: 'Videos', de: 'Videos', es: 'Vídeos', it: 'Video' },
  videos_subtitle: { fr: 'Explorez notre catalogue', en: 'Explore our catalog' },
  videos_watch: { fr: 'Regarder maintenant', en: 'Watch now' },

  // Articles
  articles_title: { fr: 'Derniers Articles', en: 'Latest Articles' },
  articles_subtitle: { fr: "Analyses, interviews et dossiers de fond sur l'actualité spatiale.", en: "Analyses, interviews, and in-depth reports on space news." },
  article_read_more: { fr: 'Lire la suite', en: 'Read more' },
  article_read_less: { fr: 'Réduire', en: 'Show less' },

  // Ecosystem
  ecosystem_title: { fr: "L'Écosystème Toulousain", en: "The Toulouse Ecosystem" },
  ecosystem_subtitle: { fr: "Les acteurs majeurs qui façonnent l'avenir depuis la ville rose.", en: "Major players shaping the future from the Pink City." },
  ecosystem_view: { fr: "Voir le profil", en: "View profile" },

  // Oracle / Mission Control
  oracle_title: { fr: "Centre de Contrôle", en: "Mission Control" },
  oracle_desc: { fr: "Accédez à la base de connaissance de l'Event Horizon. Posez vos questions techniques, explorez des scénarios hypothétiques ou analysez des données de vol.", en: "Access the Event Horizon knowledge base. Ask technical questions, explore hypothetical scenarios, or analyze flight data." },
  oracle_placeholder: { fr: "Entrez votre requête (ex: Trajectoire Mars...)", en: "Enter query (ex: Mars Trajectory...)" },
  oracle_quick_access: { fr: "Protocoles Rapides", en: "Quick Protocols" },
  oracle_sugg_1: { fr: "Quelle est la charge utile maximale d'Ariane 6 ?", en: "What is the max payload of Ariane 6?" },
  oracle_sugg_2: { fr: "Explique le point de Lagrange L2", en: "Explain Lagrange Point L2" },
  oracle_sugg_3: { fr: "Comment devenir astronaute à l'ESA ?", en: "How to become an ESA astronaut?" },

  // Black Hole
  bh_title: { fr: "Singularité", en: "Singularity", de: "Singularität", es: "Singularidad", it: "Singolarità" },
  bh_subtitle: { fr: "Simulation de l'Horizon des Événements", en: "Event Horizon Simulation" },
  bh_controls: { fr: "Paramètres Physique", en: "Physics Parameters" },
  bh_rotation: { fr: "Rotation", en: "Rotation" },
  bh_bloom: { fr: "Intensité Lumineuse", en: "Glow Intensity" },
  bh_lensing: { fr: "Lentille Gravitationnelle", en: "Gravitational Lensing" },
  bh_density: { fr: "Densité Disque", en: "Disk Density" },
  bh_temp: { fr: "Température", en: "Temperature" },
  bh_interact: { fr: "Glisser pour tourner • Scroller pour zoomer", en: "Drag to Rotate • Scroll to Zoom" },

  // Studio
  studio_title: { fr: "Studio Cosmique", en: "Cosmic Studio" },
  studio_desc: { fr: "Générez des visuels spatiaux ultra-réalistes assistés par IA.", en: "Generate ultra-realistic space visuals assisted by AI." },
  studio_label: { fr: "Prompt de Mission", en: "Mission Prompt" },
  studio_placeholder: { fr: "Décrivez le phénomène cosmique ou le vaisseau...", en: "Describe the cosmic phenomenon or spacecraft..." },
  studio_btn_generate: { fr: "Initialiser le Rendu", en: "Initialize Render" },
  studio_btn_generating: { fr: "Calcul en cours...", en: "Processing..." },
  studio_download: { fr: "Télécharger la Donnée", en: "Download Data" },
  studio_empty: { fr: "En attente de coordonnées visuelles", en: "Awaiting visual coordinates" },
  studio_error_generic: { fr: "Erreur de génération. Veuillez réessayer.", en: "Generation error. Please try again." },
  studio_error_safety: { fr: "Le système de sécurité a rejeté cette requête.", en: "Safety system rejected this request." },
  studio_error_quota: { fr: "Quota de calcul dépassé. Réessayez plus tard.", en: "Calculation quota exceeded. Try again later." },
  studio_error_timeout: { fr: "Délai d'attente dépassé.", en: "Request timed out." },

  // Footer
  footer_rights: { fr: "Tous droits réservés.", en: "All rights reserved." },
  footer_legal: { fr: "Mentions Légales", en: "Legal Notice" },
  footer_privacy: { fr: "Confidentialité", en: "Privacy Policy" },
  footer_desc: { fr: "Connecter les passionnés à la réalité de l'industrie spatiale européenne.", en: "Connecting enthusiasts to the reality of the European space industry." },
};

interface ThemeLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) {
      setLanguage(browserLang);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key: string) => {
    // 1. Try requested language
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // 2. Fallback to English
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    // 3. Return key if nothing else
    return key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ language, setLanguage, theme, toggleTheme, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};