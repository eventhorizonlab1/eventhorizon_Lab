

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
  Plus besoin de gérer des fichiers images pour les vidéos classiques !
*/
export const getYouTubeThumbnail = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  // Retourne l'image HD si l'ID est trouvé, sinon une image vide (le composant gérera le fallback)
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
};

/* 
  === GUIDES DES IMAGES ===
  1. Pour la vidéo "À LA UNE" (Hero) : Utilisez une image très haute définition sans texte (Wikimedia, Unsplash).
     Évitez les miniatures YouTube automatiques ici car elles contiennent du texte qui jure avec le design.
  2. Pour la liste "VIDEOS" : Utilisez `getYouTubeThumbnail(url)` pour la simplicité.
*/

export const FEATURED_VIDEO: Video = {
  id: 'feat_1', 
  title: '🚀 Ariane 6 : Le Retour du Géant Européen',
  category: 'LANCEURS',
  duration: 'Live',
  // URL Stable (Wikimedia Commons) - Ne disparaîtra pas.
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ariane_6_first_flight_%28VA262%29_liftoff.jpg/1280px-Ariane_6_first_flight_%28VA262%29_liftoff.jpg', 
  videoUrl: 'https://www.youtube.com/watch?v=ukoMgE_8heo'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Ariane 6 : la fusée européenne a réussi son 3ème envol', 
    category: 'ACTUALITÉ', 
    duration: '12:30', 
    // Utilisation automatique de la miniature YouTube :
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
    imageUrl: getYouTubeThumbnail('https://www.youtube.com/watch?v=03ZZdJf2nDA'),
    videoUrl: 'https://www.youtube.com/watch?v=03ZZdJf2nDA'
  },
];

export const ARTICLES: Article[] = [
  { 
    id: 'a1', 
    title: 'Pourquoi Toulouse est la capitale du spatial', 
    summary: 'Analyse économique et structurelle de l\'écosystème Aerospace Valley.', 
    date: '10 OCT 2023', 
    // Image pertinente : Place du Capitole (Toulouse)
    imageUrl: 'https://images.unsplash.com/photo-1588934524456-6e542cb23354?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'a2', 
    title: 'Interview exclusive : Le DG de l\'ESA', 
    summary: 'Vision stratégique pour l\'autonomie européenne à l\'horizon 2030.', 
    date: '05 OCT 2023', 
    // Stable Unsplash ID: Business / Leadership / Modern Office
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'a3', 
    title: 'Propulsion Ionique : Le dossier technique', 
    summary: 'Comment les moteurs électriques redéfinissent les voyages lointains.', 
    date: '28 SEP 2023', 
    // Stable Unsplash ID: Blue Light / Tech / Thruster vibe
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'a4', 
    title: 'Retour sur la Lune : Mission Argonaut', 
    summary: 'Les détails de l\'atterrisseur logistique européen lourd.', 
    date: '20 SEP 2023', 
    // Stable Unsplash ID: Moon Surface / Space
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'a5', 
    title: 'Loi Spatiale et Débris Orbitaux', 
    summary: 'Les nouvelles réglementations pour un espace durable (Zéro Débris).', 
    date: '15 SEP 2023', 
    // Stable Unsplash ID: Earth Orbit / Satellite view
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
];

export const PARTNERS: Partner[] = [
  { 
    id: 'p1', 
    name: 'CNES', 
    role: 'Agence Spatiale', 
    // CNES Toulouse : Tech / Control Room vibe
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'p2', 
    name: 'Airbus', 
    role: 'Constructeur', 
    // Airbus Defence & Space : Clean Room / Satellite Manufacturing
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'p3', 
    name: 'Thales Alenia', 
    role: 'Satellites', 
    // TAS : High Tech / Electronics / Chips
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'p4', 
    name: 'ISAE-SUPAERO', 
    role: 'Excellence', 
    // Campus / Students / Innovation
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'p5', 
    name: 'Cité de l\'Espace', 
    role: 'Culture', 
    // Parc / Ariane 5 Mockup / Exhibition
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cit%C3%A9_de_l%27Espace_Ariane_5.jpg/800px-Cit%C3%A9_de_l%27Espace_Ariane_5.jpg' 
  },
];