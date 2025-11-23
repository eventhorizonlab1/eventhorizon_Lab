

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = string;
type Theme = 'light' | 'dark';

// Reduced to major European languages to ensure 100% translation coverage
export const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

interface TranslationSet {
  [key: string]: string;
}

interface Translations {
  [key: string]: TranslationSet;
}

const translations: Translations = {
  // --- NAVIGATION ---
  nav_videos: { fr: 'Vidéos', en: 'Videos', de: 'Videos', es: 'Vídeos', it: 'Video' },
  nav_articles: { fr: 'Articles', en: 'Articles', de: 'Artikel', es: 'Artículos', it: 'Articoli' },
  nav_ecosystem: { fr: 'Écosystème', en: 'Ecosystem', de: 'Ökosystem', es: 'Ecosistema', it: 'Ecosistema' },
  
  // --- HERO ---
  hero_line1: { fr: 'DANS LES COULISSES', en: 'BEHIND THE SCENES', de: 'HINTER DEN KULISSEN', es: 'ENTRE BASTIDORES', it: 'DIETRO LE QUINTE' },
  hero_line2: { fr: "DE L'EUROPE SPATIALE", en: 'OF EUROPEAN SPACE', de: 'DER EUROPÄISCHEN RAUMFAHRT', es: 'DEL ESPACIO EUROPEO', it: 'DELLO SPAZIO EUROPEO' },
  hero_subtitle: { 
    fr: "Une plongée immersive au cœur de l'industrie aérospatiale, de Toulouse à Kourou.", 
    en: "An immersive dive into the heart of the aerospace industry, from Toulouse to Kourou.",
    de: "Ein immersiver Tauchgang in das Herz der Luft- und Raumfahrtindustrie, von Toulouse bis Kourou.",
    es: "Una inmersión profunda en el corazón de la industria aeroespacial, desde Toulouse hasta Kourou.",
    it: "Un'immersione nel cuore dell'industria aerospaziale, da Tolosa a Kourou."
  },
  hero_cta: { fr: 'Découvrez nos vidéos', en: 'Watch our videos', de: 'Videos ansehen', es: 'Ver videos', it: 'Guarda i video' },
  hero_scroll: { fr: 'Scroll pour explorer', en: 'Scroll to explore', de: 'Scrollen zum Entdecken', es: 'Desplazar para explorar', it: 'Scorri per esplorare' },

  // --- VIDEOS ---
  videos_title: { fr: 'Vidéos', en: 'Videos', de: 'Videos', es: 'Vídeos', it: 'Video' },
  videos_subtitle: { fr: 'Explorez notre catalogue', en: 'Explore our catalog', de: 'Katalog durchsuchen', es: 'Explorar catálogo', it: 'Esplora catalogo' },
  videos_channel: { fr: 'Chaîne Officielle', en: 'Official Channel', de: 'Offizieller Kanal', es: 'Canal Oficial', it: 'Canale Ufficiale' },
  videos_channel_desc: { fr: 'Reportages, Lancements et Directs du CNES.', en: 'Reports, Launches and Live streams from CNES.', de: 'Berichte, Starts und Livestreams vom CNES.', es: 'Informes, Lanzamientos y Transmisiones en vivo del CNES.', it: 'Reportage, Lanci e Dirette dal CNES.' },
  videos_access: { fr: 'Accéder au flux', en: 'Access Feed', de: 'Zum Feed', es: 'Acceder al feed', it: 'Accedi al feed' },
  videos_featured: { fr: 'À la une', en: 'Featured', de: 'Vorgestellt', es: 'Destacado', it: 'In evidenza' },

  // Video Content
  video_feat_1_title: { fr: 'Cap sur 2025 : Les Vœux du CNES', en: 'Heading for 2025: CNES Wishes', de: 'Auf dem Weg zu 2025: CNES Wünsche', es: 'Rumbo a 2025: Deseos del CNES', it: 'Verso il 2025: Auguri del CNES' },
  video_feat_1_cat: { fr: 'INSTITUTIONNEL', en: 'INSTITUTIONAL', de: 'INSTITUTIONELL', es: 'INSTITUCIONAL', it: 'ISTITUZIONALE' },

  video_v1_title: { fr: 'Décollage réussi pour JUICE', en: 'Successful Liftoff for JUICE', de: 'Erfolgreicher Start für JUICE', es: 'Despegue exitoso de JUICE', it: 'Decollo riuscito per JUICE' },
  video_v1_cat: { fr: 'EXPLORATION', en: 'EXPLORATION', de: 'ERFORSCHUNG', es: 'EXPLORACIÓN', it: 'ESPLORAZIONE' },
  
  video_v2_title: { fr: "SWOT : L'eau vue de l'espace", en: 'SWOT: Water seen from space', de: 'SWOT: Wasser aus dem All', es: 'SWOT: El agua vista desde el espacio', it: "SWOT: L'acqua vista dallo spazio" },
  video_v2_cat: { fr: 'CLIMAT', en: 'CLIMATE', de: 'KLIMA', es: 'CLIMA', it: 'CLIMA' },

  video_v3_title: { fr: 'Thomas Pesquet : Retour sur Alpha', en: 'Thomas Pesquet: Alpha Mission Review', de: 'Thomas Pesquet: Rückblick Alpha', es: 'Thomas Pesquet: Resumen Misión Alpha', it: 'Thomas Pesquet: Ritorno su Alpha' },
  video_v3_cat: { fr: 'ASTRONAUTE', en: 'ASTRONAUT', de: 'ASTRONAUT', es: 'ASTRONAUTA', it: 'ASTRONAUTA' },

  video_v4_title: { fr: 'Le Centre Spatial Guyanais (CSG)', en: 'Guiana Space Centre (CSG)', de: 'Raumfahrtzentrum Guayana', es: 'Centro Espacial de Guayana', it: 'Centro Spaziale della Guyana' },
  video_v4_cat: { fr: 'INFRASTRUCTURE', en: 'INFRASTRUCTURE', de: 'INFRASTRUKTUR', es: 'INFRAESTRUCTURA', it: 'INFRASTRUTTURA' },

  video_v5_title: { fr: 'MicroCarb : Piéger le CO2', en: 'MicroCarb: Trapping CO2', de: 'MicroCarb: CO2 einfangen', es: 'MicroCarb: Atrapando CO2', it: 'MicroCarb: Intrappolare la CO2' },
  video_v5_cat: { fr: 'SCIENCE', en: 'SCIENCE', de: 'WISSENSCHAFT', es: 'CIENCIA', it: 'SCIENZA' },

  video_v6_title: { fr: 'Les Rovers Martiens : Perseverance', en: 'Mars Rovers: Perseverance', de: 'Mars Rover: Perseverance', es: 'Rovers de Marte: Perseverance', it: 'Rover Marziani: Perseverance' },
  video_v6_cat: { fr: 'MARS', en: 'MARS', de: 'MARS', es: 'MARTE', it: 'MARTE' },

  video_v7_title: { fr: 'Nanosatellites : La Révolution Angels', en: 'Nanosatellites: The Angels Revolution', de: 'Nanosatelliten: Die Angels Revolution', es: 'Nanosatélites: La Revolución Angels', it: 'Nanosatelliti: La Rivoluzione Angels' },
  video_v7_cat: { fr: 'NEWSPACE', en: 'NEWSPACE', de: 'NEWSPACE', es: 'NEWSPACE', it: 'NEWSPACE' },

  video_v8_title: { fr: 'Gaia : Cartographier la Voie Lactée', en: 'Gaia: Mapping the Milky Way', de: 'Gaia: Kartierung der Milchstraße', es: 'Gaia: Mapeando la Vía Láctea', it: 'Gaia: Mappare la Via Lattea' },
  video_v8_cat: { fr: 'ASTRONOMIE', en: 'ASTRONOMY', de: 'ASTRONOMIE', es: 'ASTRONOMÍA', it: 'ASTRONOMIA' },

  video_v9_title: { fr: 'Le Ballon Stratosphérique', en: 'The Stratospheric Balloon', de: 'Der Stratosphärenballon', es: 'El Globo Estratosférico', it: 'Il Pallone Stratosferico' },
  video_v9_cat: { fr: 'INNOVATION', en: 'INNOVATION', de: 'INNOVATION', es: 'INNOVACIÓN', it: 'INNOVAZIONE' },

  video_v10_title: { fr: 'Ariane 6 : Préparatifs', en: 'Ariane 6: Preparations', de: 'Ariane 6: Vorbereitungen', es: 'Ariane 6: Preparativos', it: 'Ariane 6: Preparativi' },
  video_v10_cat: { fr: 'LANCEURS', en: 'LAUNCHERS', de: 'TRÄGERRAKETEN', es: 'LANZADORES', it: 'LANCIATORI' },


  // --- ARTICLES ---
  articles_title: { fr: 'Derniers Articles', en: 'Latest Articles', de: 'Neueste Artikel', es: 'Últimos Artículos', it: 'Ultimi Articoli' },
  articles_subtitle: { 
    fr: "Analyses, interviews et dossiers de fond sur l'actualité spatiale.", 
    en: "Analyses, interviews, and in-depth reports on space news.",
    de: "Analysen, Interviews und Hintergrundberichte zu Raumfahrt-News.",
    es: "Análisis, entrevistas e informes detallados sobre noticias espaciales.",
    it: "Analisi, interviste e reportage approfonditi sulle notizie spaziali."
  },
  article_read_more: { fr: 'Lire la suite', en: 'Read more', de: 'Mehr lesen', es: 'Leer más', it: 'Leggi di più' },

  article_a1_title: { fr: 'Pourquoi Toulouse est la capitale du spatial', en: 'Why Toulouse is the Space Capital', de: 'Warum Toulouse die Raumfahrthauptstadt ist', es: 'Por qué Toulouse es la capital espacial', it: 'Perché Tolosa è la capitale dello spazio' },
  article_a1_summary: { fr: "Analyse économique et structurelle de l'écosystème Aerospace Valley.", en: "Economic and structural analysis of the Aerospace Valley ecosystem.", de: "Wirtschaftliche und strukturelle Analyse des Aerospace Valley.", es: "Análisis económico y estructural del ecosistema Aerospace Valley.", it: "Analisi economica e strutturale dell'ecosistema Aerospace Valley." },
  
  article_a2_title: { fr: "Interview exclusive : Le DG de l'ESA", en: "Exclusive Interview: ESA DG", de: "Exklusivinterview: ESA GD", es: "Entrevista exclusiva: DG de la ESA", it: "Intervista esclusiva: DG dell'ESA" },
  article_a2_summary: { fr: "Vision stratégique pour l'autonomie européenne à l'horizon 2030.", en: "Strategic vision for European autonomy by 2030.", de: "Strategische Vision für die europäische Autonomie bis 2030.", es: "Visión estratégica para la autonomía europea hacia 2030.", it: "Visione strategica per l'autonomia europea entro il 2030." },
  
  article_a3_title: { fr: 'Propulsion Ionique : Le dossier technique', en: 'Ion Propulsion: Technical File', de: 'Ionenantrieb: Technisches Dossier', es: 'Propulsión Iónica: Expediente Técnico', it: 'Propulsione Ionica: Dossier Tecnico' },
  article_a3_summary: { fr: 'Comment les moteurs électriques redéfinissent les voyages lointains.', en: 'How electric engines are redefining long-distance travel.', de: 'Wie Elektromotoren Fernreisen neu definieren.', es: 'Cómo los motores eléctricos redefinen los viajes largos.', it: 'Come i motori elettrici ridefiniscono i viaggi a lunga distanza.' },
  
  article_a4_title: { fr: 'Retour sur la Lune : Mission Argonaut', en: 'Return to Moon: Argonaut Mission', de: 'Rückkehr zum Mond: Mission Argonaut', es: 'Regreso a la Luna: Misión Argonaut', it: 'Ritorno sulla Luna: Missione Argonaut' },
  article_a4_summary: { fr: "Les détails de l'atterrisseur logistique européen lourd.", en: "Details of the European heavy logistics lander.", de: "Details zum europäischen schweren Logistik-Lander.", es: "Detalles del módulo de aterrizaje logístico pesado europeo.", it: "Dettagli del lander logistico pesante europeo." },
  
  article_a5_title: { fr: 'Loi Spatiale et Débris Orbitaux', en: 'Space Law and Orbital Debris', de: 'Weltraumrecht und Weltraummüll', es: 'Derecho Espacial y Desechos Orbitales', it: 'Diritto Spaziale e Detriti Orbitali' },
  article_a5_summary: { fr: "Les nouvelles réglementations pour un espace durable (Zéro Débris).", en: "New regulations for a sustainable space (Zero Debris).", de: "Neue Vorschriften für einen nachhaltigen Weltraum.", es: "Nuevas regulaciones para un espacio sostenible.", it: "Nuove normative per uno spazio sostenibile." },


  // --- ECOSYSTEM ---
  ecosystem_title: { fr: "L'Écosystème Toulousain", en: "The Toulouse Ecosystem", de: "Das Ökosystem von Toulouse", es: "El Ecosistema de Toulouse", it: "L'Ecosistema di Tolosa" },
  ecosystem_subtitle: { fr: "Les acteurs majeurs qui façonnent l'avenir depuis la ville rose.", en: "Major players shaping the future from the Pink City.", de: "Wichtige Akteure, die die Zukunft gestalten.", es: "Actores clave que dan forma al futuro.", it: "Attori chiave che plasmano il futuro." },
  ecosystem_view: { fr: "Voir le profil", en: "View profile", de: "Profil ansehen", es: "Profil ansehen", it: "Vedi profilo" },
  
  partner_p1_role: { fr: 'Agence Spatiale', en: 'Space Agency', de: 'Raumfahrtagentur', es: 'Agencia Espacial', it: 'Agenzia Spaziale' },
  partner_p2_role: { fr: 'Constructeur', en: 'Manufacturer', de: 'Hersteller', es: 'Fabricante', it: 'Costruttore' },
  partner_p3_role: { fr: 'Satellites', en: 'Satellites', de: 'Satelliten', es: 'Satélites', it: 'Satelliti' },
  partner_p4_role: { fr: 'Excellence', en: 'Excellence', de: 'Exzellenz', es: 'Excelencia', it: 'Eccellenza' },
  partner_p5_role: { fr: 'Culture', en: 'Culture', de: 'Kultur', es: 'Cultura', it: 'Cultura' },

  // --- TIMELINE ---
  hero_history_title: { fr: 'Notre Histoire', en: 'Our History', de: 'Unsere Geschichte', es: 'Nuestra Historia', it: 'La Nostra Storia' },
  hero_history_sub: { fr: "L'héritage de l'exploration spatiale européenne", en: "The legacy of European space exploration", de: "Das Erbe der europäischen Weltraumforschung", es: "El legado de la exploración espacial europea", it: "L'eredità dell'esplorazione spaziale europea" },
  
  milestone_0_title: { fr: "Création du CNES", en: "Creation of CNES", de: "Gründung des CNES", es: "Creación del CNES", it: "Creazione del CNES" },
  milestone_0_desc: { fr: "Fondation de l'agence spatiale française par le Général de Gaulle.", en: "Foundation of the French space agency by General de Gaulle.", de: "Gründung der französischen Raumfahrtagentur durch General de Gaulle.", es: "Fundación de la agencia espacial francesa por el General de Gaulle.", it: "Fondazione dell'agenzia spaziale francese da parte del Generale de Gaulle." },
  
  milestone_1_title: { fr: "Premier vol Ariane", en: "First Ariane Flight", de: "Erster Ariane-Flug", es: "Primer vuelo de Ariane", it: "Primo volo Ariane" },
  milestone_1_desc: { fr: "L'Europe gagne son accès indépendant à l'espace avec Ariane 1.", en: "Europe gains independent access to space with Ariane 1.", de: "Europa erhält mit Ariane 1 unabhängigen Zugang zum Weltraum.", es: "Europa obtiene acceso independiente al espacio con Ariane 1.", it: "L'Europa ottiene accesso indipendente allo spazio con Ariane 1." },
  
  milestone_2_title: { fr: "Mission Rosetta", en: "Rosetta Mission", de: "Rosetta-Mission", es: "Misión Rosetta", it: "Missione Rosetta" },
  milestone_2_desc: { fr: "Première atterrissage sur une comète avec le robot Philae.", en: "First landing on a comet with the Philae lander.", de: "Erste Landung auf einem Kometen mit dem Lander Philae.", es: "Primer aterrizaje en un cometa con el módulo Philae.", it: "Primo atterraggio su una cometa con il lander Philae." },
  
  milestone_3_title: { fr: "Station Spatiale (ISS)", en: "Space Station (ISS)", de: "Raumstation (ISS)", es: "Estación Espacial (ISS)", it: "Stazione Spaziale (ISS)" },
  milestone_3_desc: { fr: "Thomas Pesquet prend le commandement de l'ISS.", en: "Thomas Pesquet takes command of the ISS.", de: "Thomas Pesquet übernimmt das Kommando über die ISS.", es: "Thomas Pesquet asume el mando de la ISS.", it: "Thomas Pesquet assume il comando della ISS." },

  // --- BLACK HOLE SIM ---
  bh_title: { fr: 'Singularité', en: 'Singularity', de: 'Singularität', es: 'Singularidad', it: 'Singolarità' },
  bh_subtitle: { 
    fr: "Simulation astrophysique temps réel d'un trou noir de Kerr (supermassif en rotation). Données visuelles basées sur les modèles Luminet (1979).",
    en: "Real-time astrophysical simulation of a Kerr black hole. Visual data based on Luminet models (1979).",
    de: "Echtzeit-Astrophysik-Simulation eines Kerr-Schwarzen Lochs. Basierend auf Luminet-Modellen.",
    es: "Simulación astrofísica en tiempo real de un agujero negro de Kerr.",
    it: "Simulazione astrofisica in tempo reale di un buco nero di Kerr."
  },
  bh_controls: { fr: 'Paramètres de Simulation', en: 'Simulation Parameters', de: 'Simulationsparameter', es: 'Parámetros de Simulación', it: 'Parametri di Simulazione' },
  bh_rotation: { fr: 'Vitesse de Rotation', en: 'Rotation Speed', de: 'Rotationsgeschwindigkeit', es: 'Velocidad de Rotación', it: 'Velocità di Rotazione' },
  bh_bloom: { fr: 'Intensité Lumineuse', en: 'Light Intensity', de: 'Lichtintensität', es: 'Intensidad de Luz', it: 'Intensità Luminosa' },
  bh_lensing: { fr: 'Lentille Gravitationnelle', en: 'Gravitational Lensing', de: 'Gravitationslinse', es: 'Lente Gravitacional', it: 'Lente Gravitazionale' },
  bh_density: { fr: 'Densité Disque', en: 'Disk Density', de: 'Scheibendichte', es: 'Densidad del Disco', it: 'Densità del Disco' },
  bh_temp: { fr: 'Température (K)', en: 'Temperature (K)', de: 'Temperatur (K)', es: 'Temperatura (K)', it: 'Temperatura (K)' },
  bh_interact: { fr: 'Simulation Interactive', en: 'Interactive Simulation', de: 'Interaktive Simulation', es: 'Simulación Interactiva', it: 'Simulazione Interattiva' },

  // --- FOOTER ---
  footer_desc: { 
    fr: "La plateforme de référence pour suivre l'actualité, les innovations et les missions de l'industrie spatiale européenne.",
    en: "The reference platform to follow news, innovations, and missions of the European space industry.",
    de: "Die Referenzplattform für Nachrichten, Innovationen und Missionen der europäischen Raumfahrt.",
    es: "La plataforma de referencia para seguir noticias, innovaciones y misiones de la industria espacial europea.",
    it: "La piattaforma di riferimento per seguire notizie, innovazioni e missioni dell'industria spaziale europea."
  },
  footer_rights: { fr: 'Tous droits réservés.', en: 'All rights reserved.', de: 'Alle Rechte vorbehalten.', es: 'Todos los derechos reservados.', it: 'Tutti i diritti riservati.' },
  footer_legal: { fr: 'Mentions Légales', en: 'Legal Notice', de: 'Impressum', es: 'Aviso Legal', it: 'Note Legali' },
  footer_privacy: { fr: 'Confidentialité', en: 'Privacy Policy', de: 'Datenschutz', es: 'Privacidad', it: 'Privacy' },
};

interface ThemeLanguageContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]['fr'] || key;
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
