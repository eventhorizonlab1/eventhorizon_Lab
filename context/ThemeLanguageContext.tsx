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
  nav_studio: { fr: 'IA Oracle', en: 'Oracle AI', de: 'Orakel KI', es: 'IA Oráculo', it: 'IA Oracolo' },
  
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
  hero_history_title: { fr: "Odyssée Orbitale", en: "Orbital Odyssey", de: "Orbitale Odyssee", es: "Odisea Orbital", it: "Odissea Orbitale" },
  hero_history_sub: { fr: "Les grandes étapes de la conquête spatiale européenne", en: "Major milestones in European space conquest", de: "Wichtige Meilensteine der europäischen Raumfahrteroberung", es: "Grandes hitos de la conquista espacial europea", it: "Le grandi tappe della conquista spaziale europea" },

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
  ecosystem_view: { fr: "Voir le profil", en: "View profile", de: "Profil ansehen", es: "Ver perfil", it: "Vedi profilo" },
  
  partner_p1_role: { fr: 'Agence Spatiale', en: 'Space Agency', de: 'Raumfahrtagentur', es: 'Agencia Espacial', it: 'Agenzia Spaziale' },
  partner_p2_role: { fr: 'Constructeur', en: 'Manufacturer', de: 'Hersteller', es: 'Fabricante', it: 'Costruttore' },
  partner_p3_role: { fr: 'Satellites', en: 'Satellites', de: 'Satelliten', es: 'Satélites', it: 'Satelliti' },
  partner_p4_role: { fr: 'Excellence', en: 'Excellence', de: 'Exzellenz', es: 'Excelencia', it: 'Eccellenza' },
  partner_p5_role: { fr: 'Culture', en: 'Culture', de: 'Kultur', es: 'Cultura', it: 'Cultura' },

  // --- TIMELINE ---
  milestone_0_title: { fr: 'Création de l\'ESA', en: 'Creation of ESA', de: 'Gründung der ESA', es: 'Creación de la ESA', it: 'Creazione dell\'ESA' },
  milestone_0_desc: { fr: 'L\'Europe unit ses forces spatiales.', en: 'Europe unites its space forces.', de: 'Europa vereint seine Raumfahrtkräfte.', es: 'Europa une sus fuerzas espaciales.', it: 'L\'Europa unisce le forze spaziali.' },
  
  milestone_1_title: { fr: 'Ariane 1', en: 'Ariane 1', de: 'Ariane 1', es: 'Ariane 1', it: 'Ariane 1' },
  milestone_1_desc: { fr: 'Premier vol qui ouvre l\'accès à l\'espace.', en: 'First flight opening access to space.', de: 'Erster Flug öffnet den Zugang zum All.', es: 'Primer vuelo que abre acceso al espacio.', it: 'Primo volo che apre l\'accesso allo spazio.' },

  milestone_2_title: { fr: 'Mission Rosetta', en: 'Rosetta Mission', de: 'Mission Rosetta', es: 'Misión Rosetta', it: 'Missione Rosetta' },
  milestone_2_desc: { fr: 'Première orbite autour d\'une comète.', en: 'First orbit around a comet.', de: 'Erster Orbit um einen Kometen.', es: 'Primera órbita alrededor de un cometa.', it: 'Prima orbita attorno a una cometa.' },

  milestone_3_title: { fr: 'Galileo', en: 'Galileo', de: 'Galileo', es: 'Galileo', it: 'Galileo' },
  milestone_3_desc: { fr: 'Le GPS européen devient opérationnel.', en: 'European GPS becomes operational.', de: 'Europäisches GPS wird operativ.', es: 'El GPS europeo entra en funcionamiento.', it: 'Il GPS europeo diventa operativo.' },

  milestone_4_title: { fr: 'Ariane 6', en: 'Ariane 6', de: 'Ariane 6', es: 'Ariane 6', it: 'Ariane 6' },
  milestone_4_desc: { fr: 'La souveraineté retrouvée.', en: 'Sovereignty regained.', de: 'Wiedergewonnene Souveränität.', es: 'Soberanía recuperada.', it: 'Sovranità ritrovata.' },


  // --- ORACLE ---
  oracle_title: { fr: "Centre de Contrôle", en: "Mission Control", de: "Missionskontrolle", es: "Control de Misión", it: "Controllo Missione" },
  oracle_desc: { fr: "Accédez à la base de connaissance de l'Event Horizon. Posez vos questions techniques, explorez des scénarios hypothétiques ou analysez des données de vol.", en: "Access the Event Horizon knowledge base. Ask technical questions, explore hypothetical scenarios, or analyze flight data.", de: "Greifen Sie auf die Wissensdatenbank zu. Stellen Sie technische Fragen.", es: "Acceda a la base de conocimientos. Haga preguntas técnicas.", it: "Accedi al database. Poni domande tecniche." },
  oracle_placeholder: { fr: "Entrez votre requête (ex: Trajectoire Mars...)", en: "Enter query (ex: Mars Trajectory...)", de: "Eingabe (z.B. Mars Trajektorie...)", es: "Entrada (ej: Trayectoria Marte...)", it: "Inserisci (es: Traiettoria Marte...)" },
  oracle_quick_access: { fr: "Protocoles Rapides", en: "Quick Protocols", de: "Schnellprotokolle", es: "Protocolos Rápidos", it: "Protocolli Rapidi" },
  oracle_sugg_1: { fr: "Quelle est la charge utile maximale d'Ariane 6 ?", en: "What is the max payload of Ariane 6?", de: "Was ist die max. Nutzlast von Ariane 6?", es: "¿Cuál es la carga útil máx de Ariane 6?", it: "Qual è il carico utile max di Ariane 6?" },
  oracle_sugg_2: { fr: "Explique le point de Lagrange L2", en: "Explain Lagrange Point L2", de: "Erkläre Lagrange-Punkt L2", es: "Explica el punto Lagrange L2", it: "Spiega il punto di Lagrange L2" },
  oracle_sugg_3: { fr: "Comment devenir astronaute à l'ESA ?", en: "How to become an ESA astronaut?", de: "Wie wird man ESA-Astronaut?", es: "¿Cómo ser astronauta de la ESA?", it: "Come diventare astronauta ESA?" },

  // --- BLACK HOLE ---
  bh_title: { fr: "Singularité", en: "Singularity", de: "Singularität", es: "Singularidad", it: "Singolarità" },
  bh_subtitle: { fr: "Simulation de l'Horizon des Événements", en: "Event Horizon Simulation", de: "Ereignishorizont-Simulation", es: "Simulación del Horizonte de Sucesos", it: "Simulazione dell'Orizzonte degli Eventi" },
  bh_controls: { fr: "Paramètres Physique", en: "Physics Parameters", de: "Physikalische Parameter", es: "Parámetros Físicos", it: "Parametri Fisici" },
  bh_rotation: { fr: "Rotation", en: "Rotation", de: "Rotation", es: "Rotación", it: "Rotazione" },
  bh_bloom: { fr: "Intensité Lumineuse", en: "Glow Intensity", de: "Leuchtintensität", es: "Intensidad de Brillo", it: "Intensità Luminosa" },
  bh_lensing: { fr: "Lentille Gravitationnelle", en: "Gravitational Lensing", de: "Gravitationslinse", es: "Lente Gravitacional", it: "Lente Gravitazionale" },
  bh_density: { fr: "Densité Disque", en: "Disk Density", de: "Scheibendichte", es: "Densidad del Disco", it: "Densità del Disco" },
  bh_temp: { fr: "Température", en: "Temperature", de: "Temperatur", es: "Temperatura", it: "Temperatura" },
  bh_interact: { fr: "Glisser pour tourner • Scroller pour zoomer", en: "Drag to Rotate • Scroll to Zoom", de: "Ziehen zum Drehen • Scrollen zum Zoomen", es: "Arrastrar para rotar • Desplazar para zoom", it: "Trascina per ruotare • Scorri per zoomare" },

  // --- STUDIO ---
  studio_title: { fr: "Studio Cosmique", en: "Cosmic Studio", de: "Kosmisches Studio", es: "Estudio Cósmico", it: "Studio Cosmico" },
  studio_desc: { fr: "Générez des visuels spatiaux ultra-réalistes assistés par IA.", en: "Generate ultra-realistic space visuals assisted by AI.", de: "Erstellen Sie ultrarealistische Weltraumbilder mit KI.", es: "Generar imágenes espaciales ultra realistas con IA.", it: "Genera immagini spaziali ultra realistiche con l'IA." },
  studio_label: { fr: "Prompt de Mission", en: "Mission Prompt", de: "Missions-Prompt", es: "Prompt de Misión", it: "Prompt di Missione" },
  studio_placeholder: { fr: "Décrivez le phénomène cosmique ou le vaisseau...", en: "Describe the cosmic phenomenon or spacecraft...", de: "Beschreiben Sie das kosmische Phänomen...", es: "Describa el fenómeno cósmico...", it: "Descrivi il fenomeno cosmico..." },
  studio_btn_generate: { fr: "Initialiser le Rendu", en: "Initialize Render", de: "Render starten", es: "Iniciar Render", it: "Inizializza Render" },
  studio_btn_generating: { fr: "Calcul en cours...", en: "Processing...", de: "Verarbeitung...", es: "Procesando...", it: "Elaborazione..." },
  studio_download: { fr: "Télécharger la Donnée", en: "Download Data", de: "Daten herunterladen", es: "Descargar Datos", it: "Scarica Dati" },
  studio_empty: { fr: "En attente de coordonnées visuelles", en: "Awaiting visual coordinates", de: "Warte auf visuelle Koordinaten", es: "Esperando coordenadas visuales", it: "In attesa di coordinate visive" },
  studio_error_generic: { fr: "Erreur de génération. Veuillez réessayer.", en: "Generation error. Please try again.", de: "Generierungsfehler. Bitte erneut versuchen.", es: "Error de generación. Intente de nuevo.", it: "Errore di generazione. Riprova." },
  studio_error_safety: { fr: "Le système de sécurité a rejeté cette requête.", en: "Safety system rejected this request.", de: "Sicherheitssystem hat abgelehnt.", es: "Sistema de seguridad rechazó la solicitud.", it: "Il sistema di sicurezza ha respinto la richiesta." },
  studio_error_quota: { fr: "Quota de calcul dépassé. Réessayez plus tard.", en: "Calculation quota exceeded. Try again later.", de: "Rechenquote überschritten.", es: "Cuota de cálculo excedida.", it: "Quota di calcolo superata." },
  studio_error_timeout: { fr: "Délai d'attente dépassé.", en: "Request timed out.", de: "Zeitüberschreitung der Anfrage.", es: "Tiempo de espera agotado.", it: "Richiesta scaduta." },

  // --- FOOTER ---
  footer_rights: { fr: "Tous droits réservés.", en: "All rights reserved.", de: "Alle Rechte vorbehalten.", es: "Todos los derechos reservados.", it: "Tutti i diritti riservati." },
  footer_legal: { fr: "Mentions Légales", en: "Legal Notice", de: "Impressum", es: "Aviso Legal", it: "Note Legali" },
  footer_privacy: { fr: "Confidentialité", en: "Privacy Policy", de: "Datenschutz", es: "Política de Privacidad", it: "Privacy" },
  footer_desc: { fr: "Connecter les passionnés à la réalité de l'industrie spatiale européenne.", en: "Connecting enthusiasts to the reality of the European space industry.", de: "Verbindung von Enthusiasten mit der Realität der europäischen Raumfahrt.", es: "Conectando entusiastas con la realidad espacial europea.", it: "Connettere gli appassionati alla realtà dell'industria spaziale europea." },
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
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
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
    if (translations[key]) {
      if (translations[key][language]) {
        return translations[key][language];
      }
      if (translations[key]['en']) {
        return translations[key]['en'];
      }
    }
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