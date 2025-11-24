
export type Language = 'fr' | 'en' | 'de' | 'es' | 'it';

export type TranslationSet = Record<Language, string>;

export interface Translations {
  [key: string]: TranslationSet;
}

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

// Reduced to major European languages to ensure 100% translation coverage
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export const TRANSLATIONS: Translations = {
  // --- COMMON ---
  common_close: { fr: 'Fermer', en: 'Close', de: 'Schließen', es: 'Cerrar', it: 'Chiudere' },

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
  video_feat_1_title: { fr: '🚀 Ariane 6 : Le Retour du Géant Européen', en: '🚀 Ariane 6: The Return of the European Giant', de: '🚀 Ariane 6: Die Rückkehr des europäischen Giganten', es: '🚀 Ariane 6: El Regreso del Gigante Europeo', it: '🚀 Ariane 6: Il Ritorno del Gigante Europeo' },
  video_feat_1_cat: { fr: 'LANCEURS', en: 'LAUNCHERS', de: 'TRÄGERRAKETEN', es: 'LANZADORES', it: 'LANCIATORI' },

  video_v1_title: { fr: 'Ariane 6 : la fusée européenne a réussi son 3ème envol', en: 'Ariane 6: European Rocket Succeeds 3rd Flight', de: 'Ariane 6: Erfolgreicher dritter Flug', es: 'Ariane 6: El cohete europeo logra su tercer vuelo', it: 'Ariane 6: Il razzo europeo riesce il terzo volo' },
  video_v1_cat: { fr: 'ACTUALITÉ', en: 'NEWS', de: 'NACHRICHTEN', es: 'NOTICIAS', it: 'NOTIZIE' },
  
  video_v2_title: { fr: "Pourquoi Ariane s'acharne face à SpaceX ?", en: 'Why Ariane persists against SpaceX?', de: 'Warum Ariane gegen SpaceX besteht?', es: '¿Por qué Ariane persiste frente a SpaceX?', it: 'Perché Ariane insiste contro SpaceX?' },
  video_v2_cat: { fr: 'STRATÉGIE', en: 'STRATEGY', de: 'STRATEGIE', es: 'ESTRATEGIA', it: 'STRATEGIA' },

  video_v3_title: { fr: 'MaiaSpace, l\'entreprise française qui veut rivaliser avec SpaceX', en: 'MaiaSpace, the French rival to SpaceX', de: 'MaiaSpace, der französische SpaceX-Rivale', es: 'MaiaSpace, el rival francés de SpaceX', it: 'MaiaSpace, il rivale francese di SpaceX' },
  video_v3_cat: { fr: 'NEWSPACE', en: 'NEWSPACE', de: 'NEWSPACE', es: 'NEWSPACE', it: 'NEWSPACE' },

  video_v4_title: { fr: 'Enfin une FUSÉE RÉUTILISABLE en EUROPE ! MAIA SPACE', en: 'Finally a REUSABLE ROCKET in EUROPE! MAIA SPACE', de: 'Endlich eine WIEDERVERWENDBARE RAKETE in EUROPA! MAIA SPACE', es: '¡Finalmente un COHETE REUTILIZABLE en EUROPA! MAIA SPACE', it: 'Finalmente un RAZZO RIUTILIZZABILE in EUROPA! MAIA SPACE' },
  video_v4_cat: { fr: 'TECH', en: 'TECH', de: 'TECH', es: 'TEC', it: 'TECH' },

  video_v5_title: { fr: 'La France a ENFIN son SpaceX ( Baguette One, Latitude.. ) ?', en: 'Does France FINALLY have its SpaceX (Latitude)?', de: 'Hat Frankreich ENDLICH sein SpaceX (Latitude)?', es: '¿Francia tiene FINALMENTE su SpaceX (Latitude)?', it: 'La Francia ha FINALMENTE il suo SpaceX (Latitude)?' },
  video_v5_cat: { fr: 'STARTUP', en: 'STARTUP', de: 'STARTUP', es: 'STARTUP', it: 'STARTUP' },

  video_v6_title: { fr: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', en: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', de: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', es: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', it: 'Space Startup News: The Exploration Company Nyx Crew Vehicle' },
  video_v6_cat: { fr: 'CARGO', en: 'CARGO', de: 'FRACHT', es: 'CARGA', it: 'CARICO' },

  video_v7_title: { fr: 'NASA should use The Exploration Company Nyx to backup Starship!', en: 'NASA should use The Exploration Company Nyx to backup Starship!', de: 'NASA sollte Nyx als Backup für Starship nutzen!', es: '¡NASA debería usar Nyx como respaldo de Starship!', it: 'La NASA dovrebbe usare Nyx come backup per Starship!' },
  video_v7_cat: { fr: 'OPINION', en: 'OPINION', de: 'MEINUNG', es: 'OPINIÓN', it: 'OPINIONE' },

  video_v8_title: { fr: 'Euclid discovers a stunning Einstein ring', en: 'Euclid discovers a stunning Einstein ring', de: 'Euclid entdeckt einen atemberaubenden Einsteinring', es: 'Euclid descubre un impresionante anillo de Einstein', it: 'Euclid scopre uno straordinario anello di Einstein' },
  video_v8_cat: { fr: 'SCIENCE', en: 'SCIENCE', de: 'WISSENSCHAFT', es: 'CIENCIA', it: 'SCIENZA' },

  video_v9_title: { fr: 'The Telescope Images Scientists Have Been Waiting 12 Years For | Euclid', en: 'The Telescope Images Scientists Have Been Waiting 12 Years For | Euclid', de: 'Die Teleskopbilder, auf die Wissenschaftler 12 Jahre gewartet haben | Euclid', es: 'Las imágenes que los científicos han esperado 12 años | Euclid', it: 'Le immagini che gli scienziati aspettavano da 12 anni | Euclid' },
  video_v9_cat: { fr: 'DOCUMENTAIRE', en: 'DOCUMENTARY', de: 'DOKUMENTARFILM', es: 'DOCUMENTAL', it: 'DOCUMENTARIO' },

  video_v10_title: { fr: 'Incroyable ! JAMES WEBB détecte les toutes premières étoiles de l\'univers !', en: 'Incredible! JAMES WEBB detects the very first stars of the universe!', de: 'Unglaublich! JAMES WEBB entdeckt die allerersten Sterne!', es: '¡Increíble! JAMES WEBB detecta las primeras estrellas del universo!', it: 'Incredibile! JAMES WEBB rileva le primissime stelle dell\'universo!' },
  video_v10_cat: { fr: 'ASTRONOMIE', en: 'ASTRONOMY', de: 'ASTRONOMIE', es: 'ASTRONOMÍA', it: 'ASTRONOMIA' },

  video_v11_title: { fr: 'James Webb observe des points rouges que personne ne comprend !', en: 'James Webb observes red dots that no one understands!', de: 'James Webb beobachtet rote Punkte, die niemand versteht!', es: 'James Webb observa puntos rojos que nadie entiende!', it: 'James Webb osserva punti rossi che nessuno capisce!' },
  video_v11_cat: { fr: 'MYSTÈRE', en: 'MYSTERY', de: 'GEHEIMNIS', es: 'MISTERIO', it: 'MISTERO' },

  video_v12_title: { fr: 'ClearSpace-1 Mission Launch Update', en: 'ClearSpace-1 Mission Launch Update', de: 'ClearSpace-1 Missions-Update', es: 'Actualización misión ClearSpace-1', it: 'Aggiornamento missione ClearSpace-1' },
  video_v12_cat: { fr: 'DURABILITÉ', en: 'SUSTAINABILITY', de: 'NACHHALTIGKEIT', es: 'SOSTENIBILIDAD', it: 'SOSTENIBILITÀ' },


  // --- ARTICLES ---
  articles_title: { fr: 'Derniers Articles', en: 'Latest Articles', de: 'Neueste Artikel', es: 'Últimos Artículos', it: 'Ultimi Articoli' },
  articles_subtitle: { 
    fr: "Analyses, interviews et dossiers de fond sur l'actualité spatiale.", 
    en: "Analyses, interviews, and in-depth reports on space news.",
    de: "Analysen, Interviews und Hintergrundberichte zu Raumfahrt-News.",
    es: "Análisis, entrevistas e informes detallados sobre noticias espaciales.",
    it: "Analisi, interviste e reportage approfonditi sulle notizie spaziali."
  },
  article_read_more: { fr: 'Lire l\'article complet', en: 'Read full article', de: 'Vollständigen Artikel lesen', es: 'Leer artículo completo', it: 'Leggi articolo completo' },

  // ARTICLE 1: TOULOUSE
  article_a1_title: { fr: 'Pourquoi Toulouse est la capitale du spatial', en: 'Why Toulouse is the Space Capital', de: 'Warum Toulouse die Raumfahrthauptstadt ist', es: 'Por qué Toulouse es la capital espacial', it: 'Perché Tolosa è la capitale dello spazio' },
  article_a1_summary: { fr: "Analyse économique et structurelle de l'écosystème Aerospace Valley.", en: "Economic and structural analysis of the Aerospace Valley ecosystem.", de: "Wirtschaftliche und strukturelle Analyse des Aerospace Valley.", es: "Análisis económico y estructural del ecosistema Aerospace Valley.", it: "Analisi economica e strutturale dell'ecosistema Aerospace Valley." },
  article_a1_content: { 
    fr: "Toulouse n'est pas seulement connue pour ses briques roses et son climat ensoleillé. C'est le cœur battant de l'industrie aérospatiale européenne. \n\nAvec plus de 124 000 emplois industriels, l'Aerospace Valley concentre une puissance technologique unique au monde. C'est ici que siège Airbus, le géant mondial de l'aéronautique, mais aussi la division spatiale d'Airbus Defence and Space, responsable de la construction de satellites majeurs et de modules pour la Station Spatiale Internationale.\n\nMais Toulouse, c'est aussi le Centre Spatial de Toulouse (CST) du CNES. Fondé dans les années 60, il est le plus grand centre technique spatial en Europe. C'est ici que sont conçus les véhicules orbitaux, que sont opérées les missions martiennes comme Curiosity ou Perseverance (via le FOC), et que se prépare l'avenir de l'exploration.\n\nL'excellence toulousaine repose également sur son vivier de talents. Des institutions comme l'ISAE-SUPAERO, l'ENAC et l'INSA forment chaque année l'élite des ingénieurs spatiaux. Cet écosystème académique nourrit une myriade de startups du NewSpace (comme Loft Orbital ou Kinéis) qui redéfinissent l'accès à l'espace.\n\nEnfin, la culture spatiale y est omniprésente. La Cité de l'Espace, parc à thème scientifique unique en Europe, accueille des centaines de milliers de visiteurs, inspirant les futures générations d'astronautes et d'ingénieurs.",
    en: "Toulouse is not just known for its pink bricks and sunny climate. It is the beating heart of the European aerospace industry. \n\nWith over 124,000 industrial jobs, Aerospace Valley concentrates a technological power unique in the world. This is where Airbus, the global aviation giant, is headquartered, as well as the space division of Airbus Defence and Space, responsible for building major satellites and modules for the International Space Station.\n\nBut Toulouse is also home to the Toulouse Space Centre (CST) of CNES. Founded in the 60s, it is the largest space technical centre in Europe. This is where orbital vehicles are designed, where Martian missions like Curiosity or Perseverance are operated (via the FOC), and where the future of exploration is prepared.\n\nToulouse's excellence also relies on its talent pool. Institutions like ISAE-SUPAERO, ENAC, and INSA train the elite of space engineers every year. This academic ecosystem nourishes a myriad of NewSpace startups (like Loft Orbital or Kinéis) that are redefining access to space.\n\nFinally, space culture is omnipresent. The Cité de l'Espace, a unique scientific theme park in Europe, welcomes hundreds of thousands of visitors, inspiring future generations of astronauts and engineers.",
    de: "Toulouse ist nicht nur für seine rosa Ziegelsteine und sein sonniges Klima bekannt. Es ist das schlagende Herz der europäischen Luft- und Raumfahrtindustrie. \n\nMit über 124.000 Industriearbeitsplätzen konzentriert das Aerospace Valley eine weltweit einzigartige technologische Macht. Hier hat Airbus, der globale Luftfahrtriese, seinen Hauptsitz, ebenso wie die Raumfahrtsparte von Airbus Defence and Space.\n\nAber Toulouse ist auch die Heimat des Toulouse Space Centre (CST) des CNES. Es wurde in den 60er Jahren gegründet und ist das größte technische Raumfahrtzentrum Europas. Hier werden Orbitalfahrzeuge entworfen und Marsmissionen wie Curiosity oder Perseverance gesteuert.\n\nDie Exzellenz von Toulouse beruht auch auf seinem Talentpool. Institutionen wie ISAE-SUPAERO, ENAC und INSA bilden jedes Jahr die Elite der Raumfahrtingenieure aus. Dieses akademische Ökosystem nährt unzählige NewSpace-Startups.\n\nSchließlich ist die Raumfahrtkultur allgegenwärtig. Die Cité de l'Espace, ein einzigartiger wissenschaftlicher Themenpark in Europa, empfängt Hunderttausende von Besuchern und inspiriert zukünftige Generationen von Astronauten und Ingenieuren.",
    es: "Toulouse no es solo conocida por sus ladrillos rosados y su clima soleado. Es el corazón palpitante de la industria aeroespacial europea. \n\nCon más de 124,000 empleos industriales, el Aerospace Valley concentra un poder tecnológico único en el mundo. Aquí es donde tiene su sede Airbus, el gigante mundial de la aviación, así como la división espacial de Airbus Defence and Space.\n\nPero Toulouse es también el hogar del Centro Espacial de Toulouse (CST) del CNES. Fundado en los años 60, es el mayor centro técnico espacial de Europa. Aquí es donde se diseñan los vehículos orbitales y se operan misiones marcianas como Curiosity o Perseverance.\n\nLa excelencia de Toulouse también se basa en su cantera de talentos. Instituciones como ISAE-SUPAERO, ENAC e INSA forman cada año a la élite de ingenieros espaciales. Este ecosistema académico nutre a una miríada de startups del NewSpace.\n\nFinalmente, la cultura espacial es omnipresente. La Cité de l'Espace, un parque temático científico único en Europa, acoge a cientos de miles de visitantes, inspirando a las futuras generaciones de astronautas e ingenieros.",
    it: "Tolosa non è conosciuta solo per i suoi mattoni rosa e il clima soleggiato. È il cuore pulsante dell'industria aerospaziale europea. \n\nCon oltre 124.000 posti di lavoro industriali, l'Aerospace Valley concentra una potenza tecnologica unica al mondo. Qui ha sede Airbus, il gigante globale dell'aviazione, così come la divisione spaziale di Airbus Defence and Space.\n\nMa Tolosa è anche la sede del Centro Spaziale di Tolosa (CST) del CNES. Fondato negli anni '60, è il più grande centro tecnico spaziale in Europa. È qui che vengono progettati i veicoli orbitali e operate missioni marziane come Curiosity o Perseverance.\n\nL'eccellenza di Tolosa si basa anche sul suo bacino di talenti. Istituzioni come ISAE-SUPAERO, ENAC e INSA formano ogni anno l'élite degli ingegneri spaziali. Questo ecosistema accademico nutre una miriade di startup NewSpace.\n\nInfine, la cultura spaziale è onnipresente. La Cité de l'Espace, un parco a tema scientifico unico in Europa, accoglie centinaia di migliaia di visitatori, ispirando le future generazioni di astronauti e ingegneri."
  },
  
  // PLACEHOLDERS FOR OTHER ARTICLES
  article_placeholder_content: {
      fr: "Le contenu complet de cet article est en cours de rédaction par nos équipes éditoriales. Revenez bientôt pour découvrir l'analyse complète.",
      en: "The full content of this article is currently being written by our editorial teams. Check back soon for the full analysis.",
      de: "Der vollständige Inhalt dieses Artikels wird derzeit von unseren Redaktionsteams verfasst. Schauen Sie bald wieder vorbei.",
      es: "El contenido completo de este artículo está siendo redactado actualmente por nuestros equipos editoriales. Vuelva pronto.",
      it: "Il contenuto completo di questo articolo è attualmente in fase di redazione da parte dei nostri team editoriali. Torna presto."
  },

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
