
import { Video, Article, Partner } from './types';

// Navigation simplifiée : Vidéos, Articles, Écosystème
export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos', key: 'nav_videos' },
  { label: 'Articles', href: '#articles', key: 'nav_articles' },
  { label: 'Écosystème', href: '#ecosystem', key: 'nav_ecosystem' },
];

/* 
  === UTILITAIRE AUTOMATIQUE ===
  Cette fonction permet de récupérer automatiquement l'image "maxres" (HD) de YouTube.
  Supporte maintenant les liens "Shorts".
*/
export const getYouTubeThumbnail = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
};

/* 
  === IMAGES ===
  FEATURED_VIDEO : Utilise le lien direct vers votre dépôt GitHub PUBLIC via raw.githubusercontent.com
*/

export const FEATURED_VIDEO: Video = {
  id: 'feat_1', 
  title: '🚀 Ariane 6 : Le Retour du Géant Européen',
  category: 'LANCEURS',
  duration: 'Live',
  // Image depuis votre dépôt GitHub (Branche main)
  imageUrl: 'https://raw.githubusercontent.com/eventhorizonlab1/eventhorizon_Lab/main/images/vignette_ariane6.jpeg', 
  videoUrl: 'https://www.youtube.com/watch?v=ukoMgE_8heo',
  description: "Revivez le moment historique du retour de l'Europe spatiale avec le décollage inaugural d'Ariane 6 depuis Kourou. Une étape cruciale pour l'autonomie stratégique du continent."
};

export const VIDEOS: Video[] = [
  // --- NOUVELLES VIDÉOS (2024-2025) ---
  { 
    id: 'v_new_1', 
    title: 'Ariane 6 - Le Vol Inaugural (Replay)', 
    category: 'LANCEURS', 
    duration: '03:45:00', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=B5mDezzc74M'),
    videoUrl: 'https://www.youtube.com/watch?v=B5mDezzc74M',
    description: "Le replay intégral du vol inaugural VA262 d'Ariane 6. Un moment d'histoire pour l'Agence Spatiale Européenne."
  },
  { 
    id: 'v_new_2', 
    title: 'Ariane 6 : Un succès (presque) complet !', 
    category: 'ANALYSE', 
    duration: '18:20', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=Tiqfj7QhKyI'),
    videoUrl: 'https://www.youtube.com/watch?v=Tiqfj7QhKyI',
    description: "Hugo Lisoir décrypte le premier vol d'Ariane 6 : ce qui a marché, et le problème technique survenu en fin de mission avec l'APU."
  },
  { 
    id: 'v_new_3', 
    title: 'Lancement Inaugural Ariane 6 commenté', 
    category: 'LIVE', 
    duration: '04:12:00', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=MRGid8lylLc'),
    videoUrl: 'https://www.youtube.com/watch?v=MRGid8lylLc',
    description: "Revivez l'ambiance du lancement avec les commentaires passionnés de Stardust (Astronogeek)."
  },
  { 
    id: 'v_new_4', 
    title: 'Décollage Ariane 6 - Vol VA265 / Sentinel-1D', 
    category: 'FUTUR', 
    duration: '02:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=FDKbEavYCVk'),
    videoUrl: 'https://www.youtube.com/watch?v=FDKbEavYCVk',
    description: "Prévisualisation et simulation du futur vol VA265 qui emportera le satellite Sentinel-1D du programme Copernicus."
  },
  { 
    id: 'v_new_5', 
    title: 'Rêves d\'Espace : Décollage Ariane 6 VA265', 
    category: 'REPORTAGE', 
    duration: '15:10', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=ELTmiLg7gLw'),
    videoUrl: 'https://www.youtube.com/watch?v=ELTmiLg7gLw',
    description: "Reportage en immersion sur la préparation du prochain vol commercial d'Ariane 6."
  },
  { 
    id: 'v_new_6', 
    title: 'ESA Open Day 2025 (ESRIN)', 
    category: 'ÉVÉNEMENT', 
    duration: '05:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=LsX01klFlpU'),
    videoUrl: 'https://www.youtube.com/watch?v=LsX01klFlpU',
    description: "Découvrez les coulisses de l'ESRIN, le centre de l'ESA pour l'observation de la Terre, lors des journées portes ouvertes 2025."
  },
  { 
    id: 'v_new_7', 
    title: 'Hélène Huby (The Exploration Company) à BIG 2025', 
    category: 'INTERVIEW', 
    duration: '25:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=jUQ3qZNLXNg'),
    videoUrl: 'https://www.youtube.com/watch?v=jUQ3qZNLXNg',
    description: "Intervention inspirante d'Hélène Huby, CEO de The Exploration Company, sur l'avenir du transport spatial cargo européen."
  },
  { 
    id: 'v_new_8', 
    title: 'The Exploration Company : Présentation Capsule Nyx', 
    category: 'TECH', 
    duration: '03:15', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=tqRHR6u2MpQ'),
    videoUrl: 'https://www.youtube.com/watch?v=tqRHR6u2MpQ',
    description: "Découverte technique de la capsule Nyx, le futur vaisseau cargo réutilisable européen capable de revenir de l'espace."
  },
  { 
    id: 'v_new_9', 
    title: 'MaiaSpace : Allocutions officielles (Juin 2025)', 
    category: 'NEWSPACE', 
    duration: '12:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=C4BdQ5n34Wo'),
    videoUrl: 'https://www.youtube.com/watch?v=C4BdQ5n34Wo',
    description: "Conférence de presse de MaiaSpace détaillant la feuille de route vers le premier vol de leur mini-lanceur réutilisable."
  },
  { 
    id: 'v_new_10', 
    title: 'Yohann Leroy (CEO MaiaSpace) - Interview', 
    category: 'INTERVIEW', 
    duration: '10:20', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=GvL919qYTSY'),
    videoUrl: 'https://www.youtube.com/watch?v=GvL919qYTSY',
    description: "Entretien exclusif avec le dirigeant de MaiaSpace sur les défis de la réutilisabilité en Europe."
  },
  { 
    id: 'v_new_11', 
    title: 'Latitude : Stanislas Maximin (CEO) - Interview', 
    category: 'INTERVIEW', 
    duration: '14:10', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=E0eVosJGnjA'),
    videoUrl: 'https://www.youtube.com/watch?v=E0eVosJGnjA',
    description: "Le parcours et la vision de Stanislas Maximin, fondateur de Latitude, la startup française qui développe le lanceur Zephyr."
  },
  { 
    id: 'v_new_12', 
    title: 'Latitude à VivaTech 2025', 
    category: 'SHORT', 
    duration: '00:59', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/shorts/5ImuM68aN5c'),
    videoUrl: 'https://www.youtube.com/shorts/5ImuM68aN5c',
    description: "Aperçu rapide du moteur Navier de Latitude présenté au salon VivaTech."
  },
  { 
    id: 'v_new_13', 
    title: 'Isar Aerospace : Premier vol Spectrum', 
    category: 'LANCEURS', 
    duration: '04:50', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=yAxzKhxqdWg'),
    videoUrl: 'https://www.youtube.com/watch?v=yAxzKhxqdWg',
    description: "Tentative de vol orbital du lanceur Spectrum depuis la Norvège. Une étape clé pour le NewSpace allemand."
  },
  { 
    id: 'v_new_14', 
    title: 'Analyse du crash Isar Aerospace', 
    category: 'ANALYSE', 
    duration: '08:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=LxC-BvAW5G4'),
    videoUrl: 'https://www.youtube.com/watch?v=LxC-BvAW5G4',
    description: "Retour technique sur les anomalies rencontrées lors du premier vol d'essai d'Isar Aerospace."
  },
  { 
    id: 'v_new_15', 
    title: 'HyImpulse : Premier tir (Mai 2024)', 
    category: 'TEST', 
    duration: '02:15', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=IaxMjVpdAsY'),
    videoUrl: 'https://www.youtube.com/watch?v=IaxMjVpdAsY',
    description: "Succès pour le tir suborbital de la fusée SR75 de HyImpulse, propulsée à la cire de paraffine."
  },
  { 
    id: 'v_new_16', 
    title: 'PLD Space : Miura 5 Update', 
    category: 'SHORT', 
    duration: '00:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/shorts/7-r6yEgORes'),
    videoUrl: 'https://www.youtube.com/shorts/7-r6yEgORes',
    description: "Mise à jour rapide sur le développement du lanceur espagnol Miura 5."
  },
  { 
    id: 'v_new_17', 
    title: 'Hugo Lisoir : Perspectives et défis 2025', 
    category: 'ANALYSE', 
    duration: '22:00', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=86ufZvtsj8M'),
    videoUrl: 'https://www.youtube.com/watch?v=86ufZvtsj8M',
    description: "Bilan complet et prospective de l'année spatiale : Starship, Ariane 6, retour sur la Lune et NewSpace."
  },
  { 
    id: 'v_new_18', 
    title: 'Latitude : A French Space Startup', 
    category: 'DOCUMENTAIRE', 
    duration: '11:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=1jA1c7PyBDk'),
    videoUrl: 'https://www.youtube.com/watch?v=1jA1c7PyBDk',
    description: "Un documentaire sur l'histoire et les ambitions de Latitude (ex-Venture Orbital Systems)."
  },
  { 
    id: 'v_new_19', 
    title: 'Comprendre MaiaSpace en 30 secondes', 
    category: 'ÉDU', 
    duration: '00:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=7tyJPJkFvM8'),
    videoUrl: 'https://www.youtube.com/watch?v=7tyJPJkFvM8',
    description: "Vidéo courte et pédagogique pour comprendre le positionnement de MaiaSpace."
  },
  { 
    id: 'v_new_20', 
    title: 'ESA Living Planet Symposium 2025', 
    category: 'CONFÉRENCE', 
    duration: '01:30:00', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=qhOfIy6PpH8'),
    videoUrl: 'https://www.youtube.com/watch?v=qhOfIy6PpH8',
    description: "Les grands enjeux de l'observation de la Terre discutés lors du symposium majeur de l'ESA."
  },
  
  // --- ANCIENNES VIDÉOS (Restaurées) ---
  { 
    id: 'v1', 
    title: 'Ariane 6 : la fusée européenne a réussi son 3ème envol', 
    category: 'ACTUALITÉ', 
    duration: '10:15', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=O1f8s9jV_hY'),
    videoUrl: 'https://www.youtube.com/watch?v=O1f8s9jV_hY',
    description: "Retour en détail sur le troisième vol de qualification d'Ariane 6 et ses implications pour le marché."
  },
  { 
    id: 'v2', 
    title: "Pourquoi Ariane s'acharne face à SpaceX ?", 
    category: 'STRATÉGIE', 
    duration: '12:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=Tiqfj7QhKyI'),
    videoUrl: 'https://www.youtube.com/watch?v=Tiqfj7QhKyI',
    description: "Analyse stratégique de la concurrence entre le lanceur lourd européen et le géant américain."
  },
  { 
    id: 'v3', 
    title: "MaiaSpace, l'entreprise française qui veut rivaliser avec SpaceX", 
    category: 'NEWSPACE', 
    duration: '08:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=7tyJPJkFvM8'),
    videoUrl: 'https://www.youtube.com/watch?v=7tyJPJkFvM8',
    description: "Présentation de la filiale d'ArianeGroup qui développe un mini-lanceur réutilisable."
  },
  { 
    id: 'v4', 
    title: 'Enfin une FUSÉE RÉUTILISABLE en EUROPA ! MAIA SPACE', 
    category: 'TECH', 
    duration: '14:20', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=C4BdQ5n34Wo'),
    videoUrl: 'https://www.youtube.com/watch?v=C4BdQ5n34Wo',
    description: "Les défis techniques de la réutilisation et comment l'Europe compte rattraper son retard."
  },
  { 
    id: 'v5', 
    title: 'La France a ENFIN son SpaceX ( Baguette One, Latitude.. ) ?', 
    category: 'STARTUP', 
    duration: '11:10', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=E0eVosJGnjA'),
    videoUrl: 'https://www.youtube.com/watch?v=E0eVosJGnjA',
    description: "Panorama des startups françaises qui bougent les lignes du spatial : Latitude, HyPrSpace, Sirius."
  },
  { 
    id: 'v6', 
    title: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', 
    category: 'CARGO', 
    duration: '09:50', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=tqRHR6u2MpQ'),
    videoUrl: 'https://www.youtube.com/watch?v=tqRHR6u2MpQ',
    description: "Focus sur la capsule Nyx, le futur cargo spatial européen capable de revenir sur Terre."
  },
  { 
    id: 'v7', 
    title: 'NASA should use The Exploration Company Nyx to backup Starship!', 
    category: 'OPINION', 
    duration: '13:15', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=jUQ3qZNLXNg'),
    videoUrl: 'https://www.youtube.com/watch?v=jUQ3qZNLXNg',
    description: "Pourquoi l'Europe pourrait devenir un partenaire critique pour le programme Artemis de la NASA."
  },
  { 
    id: 'v8', 
    title: 'Euclid discovers a stunning Einstein ring', 
    category: 'SCIENCE', 
    duration: '06:40', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=UqQcceJd5B8'),
    videoUrl: 'https://www.youtube.com/watch?v=UqQcceJd5B8',
    description: "Les premières découvertes majeures du télescope spatial européen Euclid sur la matière noire."
  },
  { 
    id: 'v9', 
    title: 'The Telescope Images Scientists Have Been Waiting 12 Years For | Euclid', 
    category: 'DOCUMENTAIRE', 
    duration: '15:00', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=L25sX_XW_2U'),
    videoUrl: 'https://www.youtube.com/watch?v=L25sX_XW_2U',
    description: "Documentaire sur la genèse et les objectifs scientifiques de la mission Euclid."
  },
  { 
    id: 'v10', 
    title: "Incroyable ! JAMES WEBB détecte les toutes premières étoiles de l'univers !", 
    category: 'ASTRONOMIE', 
    duration: '10:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=1C_zV77G8e4'),
    videoUrl: 'https://www.youtube.com/watch?v=1C_zV77G8e4',
    description: "Les dernières observations du JWST bouleversent notre compréhension du Big Bang."
  },
  { 
    id: 'v11', 
    title: 'James Webb observe des points rouges que personne ne comprend !', 
    category: 'MYSTÈRE', 
    duration: '12:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=yi8kK0_yXzU'),
    videoUrl: 'https://www.youtube.com/watch?v=yi8kK0_yXzU',
    description: "Enigme cosmique : ces galaxies primitives qui ne devraient pas exister selon nos modèles."
  },
  { 
    id: 'v12', 
    title: 'ClearSpace-1 Mission Launch Update', 
    category: 'DURABILITÉ', 
    duration: '04:20', 
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=03ZZdJf2nDA',
    description: "Le point sur ClearSpace-1, la première mission mondiale de nettoyage de débris spatiaux. Comment l'ESA compte désorbiter un étage de fusée Vega."
  },
];

export const ARTICLES: Article[] = [
  { 
    id: 'a1', 
    title: 'Pourquoi Toulouse est la capitale du spatial', 
    summary: 'Analyse économique et structurelle de l\'écosystème Aerospace Valley.', 
    date: '10 OCT 2023', 
    // Place du Capitole (Nuit) - Wikimedia Commons
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Le_Capitole_Toulouse_nuit.jpg/1024px-Le_Capitole_Toulouse_nuit.jpg'
  },
  { 
    id: 'a2', 
    title: 'Interview exclusive : Le DG de l\'ESA', 
    summary: 'Vision stratégique pour l\'autonomie européenne à l\'horizon 2030.', 
    date: '05 OCT 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'a3', 
    title: 'Propulsion Ionique : Le dossier technique', 
    summary: 'Comment les moteurs électriques redéfinissent les voyages lointains.', 
    date: '28 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'a4', 
    title: 'Retour sur la Lune : Mission Argonaut', 
    summary: 'Les détails de l\'atterrisseur logistique européen lourd.', 
    date: '20 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'a5', 
    title: 'Loi Spatiale et Débris Orbitaux', 
    summary: 'Les nouvelles réglementations pour un espace durable (Zéro Débris).', 
    date: '15 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
];

export const PARTNERS: Partner[] = [
  { 
    id: 'p1', 
    name: 'CNES', 
    role: 'Agence Spatiale', 
    // Mission Control / Antennas - High Tech
    imageUrl: 'https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    websiteUrl: 'https://cnes.fr/fr'
  },
  { 
    id: 'p2', 
    name: 'Airbus', 
    role: 'Constructeur', 
    // Clean Room / Satellite - Industrial
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    websiteUrl: 'https://www.airbus.com/en/products-services/space'
  },
  { 
    id: 'p3', 
    name: 'Thales Alenia', 
    role: 'Satellites', 
    // Satellite / Orbit (Unsplash Stable)
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    websiteUrl: 'https://www.thalesgroup.com/en/global/activities/space'
  },
  { 
    id: 'p4', 
    name: 'ISAE-SUPAERO', 
    role: 'Excellence', 
    // Engineering / Laboratory (Unsplash Stable)
    imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    websiteUrl: 'https://www.isae-supaero.fr/fr/'
  },
  { 
    id: 'p5', 
    name: 'Cité de l\'Espace', 
    role: 'Culture', 
    // Rocket Model / Museum - Public
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    websiteUrl: 'https://www.cite-espace.com/'
  },
];
