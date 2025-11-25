
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
*/
export const getYouTubeThumbnail = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
  videoUrl: 'https://www.youtube.com/watch?v=ukoMgE_8heo'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Ariane 6 : la fusée européenne a réussi son 3ème envol', 
    category: 'ACTUALITÉ', 
    duration: '12:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=hCg8hox12C4'),
    videoUrl: 'https://www.youtube.com/watch?v=hCg8hox12C4' 
  },
  { 
    id: 'v2', 
    title: 'Pourquoi Ariane s\'acharne face à SpaceX ?', 
    category: 'STRATÉGIE', 
    duration: '10:15', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=0StUZuq0K5Y'),
    videoUrl: 'https://www.youtube.com/watch?v=0StUZuq0K5Y'
  },
  { 
    id: 'v3', 
    title: 'MaiaSpace, l\'entreprise française qui veut rivaliser avec SpaceX', 
    category: 'NEWSPACE', 
    duration: '03:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=5nUehsleKQA'),
    videoUrl: 'https://www.youtube.com/watch?v=5nUehsleKQA'
  },
  { 
    id: 'v4', 
    title: 'Enfin une FUSÉE RÉUTILISABLE en EUROPE ! MAIA SPACE', 
    category: 'TECH', 
    duration: '18:20', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=1sjA4krnCDY'),
    videoUrl: 'https://www.youtube.com/watch?v=1sjA4krnCDY'
  },
  { 
    id: 'v5', 
    title: 'La France a ENFIN son SpaceX ( Baguette One, Latitude.. ) ?', 
    category: 'STARTUP', 
    duration: '15:10', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=4akJfQCpsFA'),
    videoUrl: 'https://www.youtube.com/watch?v=4akJfQCpsFA'
  },
  { 
    id: 'v6', 
    title: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', 
    category: 'CARGO', 
    duration: '08:45', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=XP4VjQBPlqQ'),
    videoUrl: 'https://www.youtube.com/watch?v=XP4VjQBPlqQ'
  },
  { 
    id: 'v7', 
    title: 'NASA should use The Exploration Company Nyx to backup Starship!', 
    category: 'OPINION', 
    duration: '11:30', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=nvEMhxTceQs'),
    videoUrl: 'https://www.youtube.com/watch?v=nvEMhxTceQs'
  },
  { 
    id: 'v8', 
    title: 'Euclid discovers a stunning Einstein ring', 
    category: 'SCIENCE', 
    duration: '01:15', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=pyCw_fhSndI'),
    videoUrl: 'https://www.youtube.com/watch?v=pyCw_fhSndI'
  },
  { 
    id: 'v9', 
    title: 'The Telescope Images Scientists Have Been Waiting 12 Years For | Euclid', 
    category: 'DOCUMENTAIRE', 
    duration: '22:00', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=N1AY3iCYkGs'),
    videoUrl: 'https://www.youtube.com/watch?v=N1AY3iCYkGs'
  },
  { 
    id: 'v10', 
    title: 'Incroyable ! JAMES WEBB détecte les toutes premières étoiles de l\'univers !', 
    category: 'ASTRONOMIE', 
    duration: '14:50', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=35lR0Wg5FII'),
    videoUrl: 'https://www.youtube.com/watch?v=35lR0Wg5FII'
  },
  { 
    id: 'v11', 
    title: 'James Webb observe des points rouges que personne ne comprend !', 
    category: 'MYSTÈRE', 
    duration: '12:10', 
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=CQUs61L3xko'),
    videoUrl: 'https://www.youtube.com/watch?v=CQUs61L3xko'
  },
  { 
    id: 'v12', 
    title: 'ClearSpace-1 Mission Launch Update', 
    category: 'DURABILITÉ', 
    duration: '04:20', 
    // Image Unsplash Stable (Débris/Terre)
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=03ZZdJf2nDA'
  },
];

export const ARTICLES: Article[] = [
  { 
    id: 'a1', 
    title: 'Pourquoi Toulouse est la capitale du spatial', 
    summary: 'Analyse économique et structurelle de l\'écosystème Aerospace Valley.', 
    date: '10 OCT 2023', 
    // Image : Place du Capitole de nuit (Wikimedia Commons - Stable)
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Toulouse_Capitole_Night_Wikimedia_Commons.jpg/1200px-Toulouse_Capitole_Night_Wikimedia_Commons.jpg'
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
    // Image authentique : Iridium NEXT en salle blanche Thales (Wikimedia)
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Iridium-NEXT_satellites_in_cleanroom.jpg/1280px-Iridium-NEXT_satellites_in_cleanroom.jpg',
    websiteUrl: 'https://www.thalesgroup.com/en/global/activities/space'
  },
  { 
    id: 'p4', 
    name: 'ISAE-SUPAERO', 
    role: 'Excellence', 
    // Etudiants/Ingénierie Aérospatiale (Unsplash stable)
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-cd56b507d1f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
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
