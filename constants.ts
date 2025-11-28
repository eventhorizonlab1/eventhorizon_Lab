


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
  {
    id: 'a_asterix',
    title: 'Astérix : 60 ans en orbite pour le premier satellite français',
    summary: "Retour sur l'histoire du premier satellite français lancé en 1965.",
    date: '26 NOV 2025',
    // Satellite/Space historic feel
    imageUrl: '/assets/articles/asterix.jpg'
  },
  {
    id: 'a_adenot',
    title: "L'astronaute Sophie Adenot sereine avant son départ pour l'ISS",
    summary: "Interview exclusive avant la mission spatiale historique.",
    date: '20 NOV 2025',
    // Astronaut / Space suit
    imageUrl: '/assets/articles/adenot.jpg'
  },
  {
    id: 'a_exobio',
    title: "De la vie ailleurs ? Le grand livre de l'exobiologie",
    summary: "Exploration des possibilités de vie extraterrestre à travers un nouvel ouvrage de référence.",
    date: '15 NOV 2025',
    // DNA / Abstract Space / Biology
    imageUrl: '/assets/articles/exobio.jpg'
  },
  {
    id: 'a_nasa_moon',
    title: "La NASA accélère son retour sur la Lune",
    summary: "Le programme Artemis passe à la vitesse supérieure.",
    date: '10 NOV 2025',
    // Moon / Astronaut / Artemis
    imageUrl: '/assets/articles/nasa_moon.jpg'
  },
  {
    id: 'a_galileo',
    title: "Lancement de deux satellites Galileo le 17 décembre",
    summary: "Arianespace prépare le déploiement de la constellation européenne.",
    date: '05 NOV 2025',
    // Rocket Launch / Satellite
    imageUrl: '/assets/articles/galileo.jpg'
  },
  {
    id: 'a_geminides',
    title: "Carte du ciel : Le retour des Géminides",
    summary: "Tout ce qu'il faut savoir pour observer la pluie d'étoiles filantes de décembre.",
    date: '01 DEC 2025',
    // Starry Sky / Meteors - Plus spectaculaire (Milky Way / Shooting stars vibe)
    imageUrl: '/assets/articles/geminides.jpg'
  },
  {
    id: 'a_exoplanet',
    title: "Première carte 3D d'une atmosphère d'exoplanète",
    summary: "Une percée scientifique majeure dans l'étude des mondes lointains.",
    date: '28 OCT 2025',
    // Exoplanet Atmosphere / Hot Surface - Plus scientifique (Abstract planet surface)
    imageUrl: '/assets/articles/exoplanet.jpg'
  }
];

export const PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'CNES',
    role: 'Agence Spatiale',
    // Mission Control / Antennas - High Tech
    imageUrl: '/assets/ecosystem/cnes.jpg',
    websiteUrl: 'https://cnes.fr/fr'
  },
  {
    id: 'p2',
    name: 'Airbus',
    role: 'Constructeur',
    // Clean Room / Satellite - Industrial
    imageUrl: '/assets/ecosystem/airbus.jpg',
    websiteUrl: 'https://www.airbus.com/en/products-services/space'
  },
  {
    id: 'p3',
    name: 'Thales Alenia',
    role: 'Satellites',
    // Satellite / Orbit (Unsplash Stable)
    imageUrl: '/assets/ecosystem/thales.jpg',
    websiteUrl: 'https://www.thalesgroup.com/en/global/activities/space'
  },
  {
    id: 'p4',
    name: 'ISAE-SUPAERO',
    role: 'Excellence',
    // Engineering / Laboratory (Unsplash Stable)
    imageUrl: '/assets/ecosystem/isae.jpg',
    websiteUrl: 'https://www.isae-supaero.fr/fr/'
  },
  {
    id: 'p5',
    name: 'Cité de l\'Espace',
    role: 'Culture',
    // Rocket Model / Museum - Public
    imageUrl: '/assets/ecosystem/cite_espace.jpg',
    websiteUrl: 'https://www.cite-espace.com/'
  },
];