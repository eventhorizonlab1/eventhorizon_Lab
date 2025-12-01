


import { Video, Article, Partner } from './types';

// Navigation simplifiée : Vidéos, Articles, Écosystème
export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos', key: 'nav_videos' },
  { label: 'Articles', href: '#articles', key: 'nav_articles' },
  { label: 'Écosystème', href: '#ecosystem', key: 'nav_ecosystem' },
];



/* 
  === IMAGES ===
  FEATURED_VIDEO : Utilise le lien direct vers votre dépôt GitHub PUBLIC via raw.githubusercontent.com
*/

export const FEATURED_VIDEO: Video = {
  id: 'feat_1',
  title: 'Lancement Ariane 6 avec le satellite Sentinel-1D (VA265)',
  category: 'LANCEURS',
  subcategory: 'LIVE',
  duration: 'Live',
  // Image depuis votre dépôt GitHub (Branche main)
  imageUrl: '/assets/videos/feat_1.jpg',
  videoUrl: 'https://www.youtube.com/watch?v=ukoMgE_8heo',
  description: "Revivez le moment historique du retour de l'Europe spatiale avec le décollage inaugural d'Ariane 6 depuis Kourou. Une étape cruciale pour l'autonomie stratégique du continent."
};

export const VIDEOS: Video[] = [
  // --- NOUVELLES VIDÉOS (2024-2025) ---
  {
    id: 'v_new_1',
    title: "Vol inaugural d'Ariane 6",
    category: 'LANCEURS',
    subcategory: 'REPLAY',
    duration: '03:45:00',
    imageUrl: '/assets/videos/v_new_1.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=B5mDezzc74M',
    description: "Le replay intégral du vol inaugural VA262 d'Ariane 6. Un moment d'histoire pour l'Agence Spatiale Européenne."
  },
  {
    id: 'v_new_2',
    title: 'Ariane 6: un succès ( presque ) complet !',
    category: 'LANCEURS',
    subcategory: 'ANALYSE',
    duration: '18:20',
    imageUrl: '/assets/videos/v_new_2.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Tiqfj7QhKyI',
    description: "Hugo Lisoir décrypte le premier vol d'Ariane 6 : ce qui a marché, et le problème technique survenu en fin de mission avec l'APU."
  },
  {
    id: 'v_new_3',
    title: '🔴 Lancement inaugural Ariane 6 VA-262 commenté FR',
    category: 'LANCEURS',
    subcategory: 'LIVE',
    duration: '04:12:00',
    imageUrl: '/assets/videos/v_new_3.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=MRGid8lylLc',
    description: "Revivez l'ambiance du lancement avec les commentaires passionnés de Stardust (Astronogeek)."
  },
  {
    id: 'v_new_4',
    title: 'Vol VA265 | Sentinel-1D | Ariane 6 I Arianespace',
    category: 'FUTUR',
    subcategory: 'SIMULATION',
    duration: '02:30',
    imageUrl: '/assets/videos/v_new_4.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=FDKbEavYCVk',
    description: "Prévisualisation et simulation du futur vol VA265 qui emportera le satellite Sentinel-1D du programme Copernicus."
  },
  {
    id: 'v_new_5',
    title: "Décollage d'Ariane 6 du 4 novembre 2025",
    category: 'LANCEURS',
    subcategory: 'REPORTAGE',
    duration: '15:10',
    imageUrl: '/assets/videos/v_new_5.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ELTmiLg7gLw',
    description: "Reportage en immersion sur la préparation du prochain vol commercial d'Ariane 6."
  },
  {
    id: 'v_new_6',
    title: 'ESA Open Day 2025: an unforgettable day inside ESRIN',
    category: 'ÉVÉNEMENT',
    subcategory: 'VISITE',
    duration: '05:45',
    imageUrl: '/assets/videos/v_new_6.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=LsX01klFlpU',
    description: "Découvrez les coulisses de l'ESRIN, le centre de l'ESA pour l'observation de la Terre, lors des journées portes ouvertes 2025."
  },
  {
    id: 'v_new_7',
    title: 'Hélène HUBY au Studio Bang à BIG 2025',
    category: 'NEWSPACE',
    subcategory: 'INTERVIEW',
    duration: '25:30',
    imageUrl: '/assets/videos/v_new_7.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=jUQ3qZNLXNg',
    description: "Intervention inspirante d'Hélène Huby, CEO de The Exploration Company, sur l'avenir du transport spatial cargo européen."
  },
  {
    id: 'v_new_8',
    title: 'ISSRDC 2024 Day 3 Lightning Talk: Dana Baki The Exploration Company',
    category: 'TECH',
    subcategory: 'PRÉSENTATION',
    duration: '03:15',
    imageUrl: '/assets/videos/v_new_8.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tqRHR6u2MpQ',
    description: "Découverte technique de la capsule Nyx, le futur vaisseau cargo réutilisable européen capable de revenir de l'espace."
  },
  {
    id: 'v_new_9',
    title: 'Allocutions depuis le site de l’entreprise MaiaSpace | 13 juin 2025',
    category: 'NEWSPACE',
    subcategory: 'CONFÉRENCE',
    duration: '12:45',
    imageUrl: '/assets/videos/v_new_9.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=C4BdQ5n34Wo',
    description: "Conférence de presse de MaiaSpace détaillant la feuille de route vers le premier vol de leur mini-lanceur réutilisable."
  },
  {
    id: 'v_new_10',
    title: 'Yohann Leroy, CEO de MaiaSpace - Studio Bang - BIG 2024',
    category: 'NEWSPACE',
    subcategory: 'INTERVIEW',
    duration: '10:20',
    imageUrl: '/assets/videos/v_new_10.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=GvL919qYTSY',
    description: "Entretien exclusif avec le dirigeant de MaiaSpace sur les défis de la réutilisabilité en Europe."
  },
  {
    id: 'v_new_11',
    title: 'Envoyer des fusées dans l’espace à 25 ans en autodidacte - Stanislas Maximin',
    category: 'STARTUP',
    subcategory: 'INTERVIEW',
    duration: '14:10',
    imageUrl: '/assets/videos/v_new_11.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=E0eVosJGnjA',
    description: "Le parcours et la vision de Stanislas Maximin, fondateur de Latitude, la startup française qui développe le lanceur Zephyr."
  },
  {
    id: 'v_new_12',
    title: '#Vivatech : La fusée de Latitude réalisera son 1er vol en 2026',
    category: 'TECH',
    subcategory: 'SHORT',
    duration: '00:59',
    imageUrl: '/assets/videos/v_new_12.jpg',
    videoUrl: 'https://www.youtube.com/shorts/5ImuM68aN5c',
    description: "Aperçu rapide du moteur Navier de Latitude présenté au salon VivaTech."
  },
  {
    id: 'v_new_13',
    title: 'Isar Aerospace - Spectrum rocket first launch (full sequence) at Andøya spaceport - 30.3.2025',
    category: 'LANCEURS',
    subcategory: 'TEST',
    duration: '04:50',
    imageUrl: '/assets/videos/v_new_13.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=yAxzKhxqdWg',
    description: "Tentative de vol orbital du lanceur Spectrum depuis la Norvège. Une étape clé pour le NewSpace allemand."
  },
  {
    id: 'v_new_14',
    title: 'BOOM! Isar Aerospace launched Spectrum Rocket and it crashed!',
    category: 'LANCEURS',
    subcategory: 'ANALYSE',
    duration: '08:30',
    imageUrl: '/assets/videos/v_new_14.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=LxC-BvAW5G4',
    description: "Retour technique sur les anomalies rencontrées lors du premier vol d'essai d'Isar Aerospace."
  },
  {
    id: 'v_new_15',
    title: 'Une start-up allemande a réussi à lancer une fusée avec de la cire de bougie',
    category: 'NEWSPACE',
    subcategory: 'TEST',
    duration: '02:15',
    imageUrl: '/assets/videos/v_new_15.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=IaxMjVpdAsY',
    description: "Succès pour le tir suborbital de la fusée SR75 de HyImpulse, propulsée à la cire de paraffine."
  },
  {
    id: 'v_new_16',
    title: 'PLD Space | MIURA 5 "OM1"',
    category: 'NEWSPACE',
    subcategory: 'SHORT',
    duration: '00:45',
    imageUrl: '/assets/videos/v_new_16.jpg',
    videoUrl: 'https://www.youtube.com/shorts/7-r6yEgORes',
    description: "Mise à jour rapide sur le desarrollo del lanzador español Miura 5."
  },
  {
    id: 'v_new_17',
    title: "[L'espace du Débat]  Perspectives et défis dans le spatial en 2025",
    category: 'ANALYSE',
    subcategory: 'OPINION',
    duration: '22:00',
    imageUrl: '/assets/videos/v_new_17.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=86ufZvtsj8M',
    description: "Bilan complet et prospective de l'année spatiale : Starship, Ariane 6, retour sur la Lune et NewSpace."
  },
  {
    id: 'v_new_18',
    title: 'Latitude: A French Space Startup Planning to Launch Their First Vehicle in 2025',
    category: 'STARTUP',
    subcategory: 'DOCUMENTAIRE',
    duration: '11:45',
    imageUrl: '/assets/videos/v_new_18.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=1jA1c7PyBDk',
    description: "Un documentaire sur l'histoire et les ambitions de Latitude (ex-Venture Orbital Systems)."
  },
  {
    id: 'v_new_19',
    title: 'Comprendre MaiaSpace en moins de 30 secondes avec Jérôme Vila (DG Adjoint MaiaSpace)',
    category: 'ÉDU',
    subcategory: 'SHORT',
    duration: '00:30',
    imageUrl: '/assets/videos/v_new_19.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=7tyJPJkFvM8',
    description: "Vidéo courte et pédagogique pour comprendre le positionnement de MaiaSpace."
  },
  {
    id: 'v_new_20',
    title: "ESA's Living Planet Symposium 2025",
    category: 'SCIENCE',
    subcategory: 'CONFÉRENCE',
    duration: '01:30:00',
    imageUrl: '/assets/videos/v_new_20.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=qhOfIy6PpH8',
    description: "Les grands enjeux de l'observation de la Terre discutés lors du symposium majeur de l'ESA."
  },

  // --- ANCIENNES VIDÉOS (Restaurées) ---
  {
    id: 'v1',
    title: 'Ariane 6 : la fusée européenne a réussi son 3ème envol',
    category: 'ACTUALITÉ',
    duration: '10:15',
    // Image illustrative Ariane 6 (Wikimedia) car thumbnail YouTube manquant
    imageUrl: '/assets/videos/v1.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=O1f8s9jV_hY',
    description: "Retour en détail sur le troisième vol de qualification d'Ariane 6 et ses implications pour le marché."
  },
  {
    id: 'v2',
    title: 'Ariane 6: un succès ( presque ) complet !',
    category: 'STRATÉGIE',
    duration: '12:30',
    imageUrl: '/assets/videos/v2.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Tiqfj7QhKyI',
    description: "Analyse stratégique de la concurrence entre le lanceur lourd européen et le géant américain."
  },
  {
    id: 'v3',
    title: 'Comprendre MaiaSpace en moins de 30 secondes avec Jérôme Vila (DG Adjoint MaiaSpace)',
    category: 'NEWSPACE',
    duration: '08:45',
    imageUrl: '/assets/videos/v3.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=7tyJPJkFvM8',
    description: "Présentation de la filiale d'ArianeGroup qui développe un mini-lanceur réutilisable."
  },
  {
    id: 'v4',
    title: 'Allocutions depuis le site de l’entreprise MaiaSpace | 13 juin 2025',
    category: 'TECH',
    duration: '14:20',
    imageUrl: '/assets/videos/v4.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=C4BdQ5n34Wo',
    description: "Les défis techniques de la réutilisation et comment l'Europe compte rattraper son retard."
  },
  {
    id: 'v5',
    title: 'Envoyer des fusées dans l’espace à 25 ans en autodidacte - Stanislas Maximin',
    category: 'STARTUP',
    duration: '11:10',
    imageUrl: '/assets/videos/v5.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=E0eVosJGnjA',
    description: "Panorama des startups françaises qui bougent les lignes du spatial : Latitude, HyPrSpace, Sirius."
  },
  {
    id: 'v6',
    title: 'ISSRDC 2024 Day 3 Lightning Talk: Dana Baki The Exploration Company',
    category: 'CARGO',
    duration: '09:50',
    imageUrl: '/assets/videos/v6.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tqRHR6u2MpQ',
    description: "Focus sur la capsule Nyx, le futur cargo spatial européen capable de revenir sur Terre."
  },
  {
    id: 'v7',
    title: 'Hélène HUBY au Studio Bang à BIG 2025',
    category: 'OPINION',
    duration: '13:15',
    imageUrl: '/assets/videos/v7.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=jUQ3qZNLXNg',
    description: "Pourquoi l'Europe pourrait devenir un partenaire critique pour le programme Artemis de la NASA."
  },
  {
    id: 'v8',
    title: 'Euclid discovers a stunning Einstein ring',
    category: 'SCIENCE',
    duration: '06:40',
    // Image illustrative Galaxie/Nebula (Unsplash) car thumbnail YouTube manquant
    imageUrl: '/assets/videos/v8.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=UqQcceJd5B8',
    description: "Les premières découvertes majeures du télescope spatial européen Euclid sur la matière noire."
  },
  {
    id: 'v9',
    title: 'The Telescope Images Scientists Have Been Waiting 12 Years For | Euclid',
    category: 'DOCUMENTAIRE',
    duration: '15:00',
    // Image illustrative Champ d'étoiles (Unsplash)
    imageUrl: '/assets/videos/v9.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=L25sX_XW_2U',
    description: "Documentaire sur la genèse et les objectifs scientifiques de la mission Euclid."
  },
  {
    id: 'v10',
    title: "Incroyable ! JAMES WEBB détecte les toutes premières étoiles de l'univers !",
    category: 'ASTRONOMIE',
    duration: '10:30',
    // Image officielle JWST Deep Field (Wikimedia)
    imageUrl: '/assets/videos/v10.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=1C_zV77G8e4',
    description: "Les dernières observations du JWST bouleversent notre compréhension du Big Bang."
  },
  {
    id: 'v11',
    title: 'James Webb observe des points rouges que personne ne comprend !',
    category: 'MYSTÈRE',
    duration: '12:45',
    // Image illustrative Nebula (Unsplash)
    imageUrl: '/assets/videos/v11.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=yi8kK0_yXzU',
    description: "Enigme cosmique : ces galaxies primitives qui ne devraient pas exister selon nos modèles."
  },
  {
    id: 'v12',
    title: 'ClearSpace-1 Mission Launch',
    category: 'DURABILITÉ',
    duration: '04:20',
    imageUrl: '/assets/videos/v12.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=03ZZdJf2nDA',
    description: "Le point sur ClearSpace-1, la première mission mondiale de nettoyage de débris spatiaux. Comment l'ESA compte désorbiter un étage de fusée Vega."
  },
];

export const ARTICLES: Article[] = [
  // 🇪🇺 Décisions Stratégiques
  {
    id: 'a_cm25',
    title: "CM25 : Les États membres de l'ESA s'engagent sur un budget record",
    summary: "À Brême, l'Europe spatiale a validé une enveloppe historique de 22 milliards d'euros pour la période 2026-2028, sécurisant les programmes d'exploration et de défense planétaire.",
    date: '27 NOV 2025',
    category: 'STRATÉGIE',
    imageUrl: '/assets/videos/v_new_20.jpg', // ESA context
    linkUrl: 'https://www.esa.int/'
  },
  {
    id: 'a_uk_pnt',
    title: "Le Royaume-Uni injecte 155M£ pour sécuriser les signaux PNT",
    summary: "En marge du CM25, le Royaume-Uni renforce sa souveraineté sur la navigation par satellite (alternative/complément à Galileo), un enjeu critique pour la défense européenne.",
    date: '22 NOV 2025',
    category: 'STRATÉGIE',
    imageUrl: '/assets/articles/asterix.jpg', // Generic historic/gov feel
    linkUrl: 'https://www.gov.uk/'
  },
  {
    id: 'a_space_safety',
    title: "Sécurité Spatiale : L'ESA accélère sur le nettoyage orbital",
    summary: "Suite au CM25, le programme \"Space Safety\" reçoit un coup de boost financier pour les missions de désorbitation active (ClearSpace-1) et la surveillance des débris.",
    date: '28 NOV 2025',
    category: 'STRATÉGIE',
    imageUrl: '/assets/videos/v12.jpg', // ClearSpace context
    linkUrl: 'https://www.esa.int/Safety_Security'
  },

  // 🚀 Lanceurs & Opérations
  {
    id: 'a_va265',
    title: "Ariane 6 : Succès du lancement Sentinel-1D (Vol VA265)",
    summary: "Arianespace confirme la montée en cadence avec ce lancement réussi pour le programme Copernicus. Le satellite radar est parfaitement en orbite.",
    date: '04 NOV 2025',
    category: 'LANCEURS',
    imageUrl: '/assets/videos/feat_1.jpg', // Ariane 6 context
    linkUrl: 'https://www.arianespace.com/'
  },
  {
    id: 'a_vv28',
    title: "Vega C : Préparatifs finaux pour le vol VV28",
    summary: "Après plusieurs reports, Arianespace confirme la fenêtre de tir fin novembre/début décembre pour le satellite KOMPSAT-7. Le retour en vol du petit lanceur italien est crucial.",
    date: '21 NOV 2025',
    category: 'LANCEURS',
    imageUrl: '/assets/videos/v_new_13.jpg', // Rocket context
    linkUrl: 'https://www.arianespace.com/news/'
  },
  {
    id: 'a_galileo_l14',
    title: "Galileo : La campagne de lancement L14 a débuté en Guyane",
    summary: "Les équipes sont à pied d'œuvre à Kourou pour le prochain tir d'Ariane 6 prévu en décembre, qui emportera deux nouveaux satellites Galileo FOC.",
    date: '28 NOV 2025',
    category: 'LANCEURS',
    imageUrl: '/assets/articles/galileo.jpg', // Galileo context
    linkUrl: 'https://www.esa.int/Applications/Navigation/Galileo'
  },

  // 🦄 New Space & Tech
  {
    id: 'a_nyx_wind',
    title: "The Exploration Company : Nyx Earth validée en soufflerie hypersonique",
    summary: "La startup franco-allemande vient de conclure une campagne de tests décisive au DLR (Cologne) validant le comportement aérodynamique de sa capsule cargo pour la rentrée atmosphérique.",
    date: 'OCT 2025',
    category: 'NEW SPACE',
    imageUrl: '/assets/videos/v_new_8.jpg', // Nyx context
    linkUrl: 'https://www.exploration.company/'
  },
  {
    id: 'a_maia_fit',
    title: "MaiaSpace : Succès du 'Fit-Check' sur le pas de tir",
    summary: "Étape symbolique mais technique : le prototype du lanceur Maia a été érigé pour la première fois sur son pas de tir (l'ancien diamant/Themis) pour vérifier les interfaces sol.",
    date: '18 OCT 2025',
    category: 'NEW SPACE',
    imageUrl: '/assets/videos/v_new_9.jpg', // Maia context
    linkUrl: 'https://maiaspace.com/'
  },
  {
    id: 'a_euclid_dust',
    title: "Euclid dévoile 'Le Voile Poussiéreux' : Une image spectaculaire",
    summary: "Le télescope spatial européen continue de cartographier la matière noire avec une précision inédite.",
    date: '05 NOV 2025',
    category: 'SCIENCE',
    imageUrl: '/assets/videos/v8.jpg', // Euclid context
    linkUrl: 'https://www.esa.int/Science_Exploration/Space_Science/Euclid'
  },
  {
    id: 'a_thrustworks',
    title: "Moteurs spatiaux : Thrustworks rachetée par The Exploration Company",
    summary: "Consolidation dans le New Space. TEC acquiert le spécialiste allemand de l'impression 3D métal pour internaliser la production de ses moteurs.",
    date: 'NOV 2025',
    category: 'NEW SPACE',
    imageUrl: '/assets/videos/v_new_11.jpg', // Startup context
    linkUrl: 'https://www.exploration.company/'
  }
];

export const PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: "CNES",
    role: "Agence Spatiale Française",
    description: "Le CNES est le cœur de la politique spatiale française. À Toulouse, son centre technique (CST) conçoit et opère des satellites d'observation, d'océanographie et des missions scientifiques majeures, pilotant même des instruments sur Mars.",
    imageUrl: "/assets/ecosystem/cnes.jpg",
    websiteUrl: "https://cnes.fr",
    category: "INSTITUTION"
  },
  {
    id: 'p2',
    name: "Airbus Defence and Space",
    role: "Géant de la Construction Spatiale",
    description: "Leader européen, Airbus assemble à Toulouse des satellites de télécommunications, d'observation (Copernicus) et des sondes interplanétaires (JUICE). Ils sont aussi clés dans le vol habité avec le module de service européen (ESM) d'Orion.",
    imageUrl: "/assets/ecosystem/airbus.jpg",
    websiteUrl: "https://www.airbus.com/en/products-services/defence-and-space",
    category: "INDUSTRIE"
  },
  {
    id: 'p3',
    name: "Thales Alenia Space",
    role: "Expert en Satellites & Systèmes",
    description: "Acteur majeur franco-italien, Thales Alenia Space à Toulouse est spécialisé en altimétrie, météo et constellations (Galileo). Ils fournissent aussi des modules pressurisés pour les stations spatiales (ISS, Gateway).",
    imageUrl: "/assets/ecosystem/thales.jpg",
    websiteUrl: "https://www.thalesgroup.com/en/global/activities/space",
    category: "INDUSTRIE"
  },
  {
    id: 'p4',
    name: "ISAE-SUPAERO",
    role: "Excellence en Formation & Recherche",
    description: "L'école d'ingénieurs de référence mondiale pour l'aérospatial. Elle forme l'élite du secteur et mène des recherches de pointe, disposant de moyens uniques (souffleries, station sol CubeSats). Thomas Pesquet en est diplômé.",
    imageUrl: "/assets/ecosystem/isae.jpg",
    websiteUrl: "https://www.isae-supaero.fr",
    category: "ÉDUCATION"
  },
  {
    id: 'p5',
    name: "Cité de l'Espace",
    role: "La Culture Spatiale pour Tous",
    description: "Le parc à thème scientifique incontournable en Europe. Avec ses répliques taille réelle (Ariane 5, Mir), son planétarium et ses expos interactives, elle inspire les futures générations et diffuse la passion de l'espace.",
    imageUrl: "/assets/ecosystem/cite_espace.jpg",
    websiteUrl: "https://www.cite-espace.com",
    category: "CULTURE"
  },
  {
    id: 'p6',
    name: "The Exploration Company",
    role: "Cargo Spatial Réutilisable",
    description: "Startup franco-allemande ambitieuse développant 'Nyx', une capsule cargo réutilisable pour desservir les futures stations spatiales, avec une forte présence et des tests clés menés dans l'écosystème toulousain et européen.",
    imageUrl: "/assets/ecosystem/tec.jpg",
    websiteUrl: "https://www.exploration.space",
    category: "NEWSPACE"
  },
  {
    id: 'p7',
    name: "MaiaSpace",
    role: "Mini-Lanceur Réutilisable",
    description: "Filiale d'ArianeGroup, MaiaSpace développe 'Maia', un mini-lanceur partiellement réutilisable, visant le marché en plein essor des petits satellites, avec des synergies toulousaines.",
    imageUrl: "/assets/ecosystem/maiaspace.jpg",
    websiteUrl: "https://www.maiaspace.com",
    category: "NEWSPACE"
  },
  {
    id: 'p8',
    name: "Latitude",
    role: "Micro-Lanceur Innovant",
    description: "Startup rémoise développant 'Zéphyr', un micro-lanceur pour les nanosatellites, avec une approche agile et rapide.",
    imageUrl: "/assets/ecosystem/latitude.jpg",
    websiteUrl: "https://www.latitude.eu",
    category: "NEWSPACE"
  }
];