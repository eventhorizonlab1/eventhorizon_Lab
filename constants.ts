

import { Video, Article, Partner } from './types';

// Navigation simplifiée : Vidéos, Articles, Écosystème
export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos', key: 'nav_videos' },
  { label: 'Articles', href: '#articles', key: 'nav_articles' },
  { label: 'Écosystème', href: '#ecosystem', key: 'nav_ecosystem' },
];

/* 
  GUIDE D'INTEGRATION DES IMAGES PERSONNALISÉES :
  Pour changer une vignette, remplacez la valeur 'imageUrl' par le lien de votre image.
  
  NOTE : L'URL ci-dessous pointe vers une version archivée spécifique de l'image sur GitHub.
  Cela permet d'assurer son affichage même si le fichier local ou sur 'main' est temporairement manquant.
*/

export const FEATURED_VIDEO: Video = {
  id: 'feat_1', 
  title: '🚀 Ariane 6 : Le Retour du Géant Européen',
  category: 'LANCEURS',
  duration: 'Live',
  // Lien vers un commit spécifique (historique) pour garantir la disponibilité de l'image
  imageUrl: 'https://github.com/eventhorizonlab1/eventhorizon_Lab/raw/1b23f67e40a4b23acf6ef2b73014f4da76370473/images/vignette_ariane6.jpeg', 
  videoUrl: 'https://www.youtube.com/watch?v=ukoMgE_8heo'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Ariane 6 : la fusée européenne a réussi son 3ème envol', 
    category: 'ACTUALITÉ', 
    duration: '12:30', 
    imageUrl: 'https://images.unsplash.com/photo-1614728853970-3027b9cb323d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rocket on pad
    videoUrl: 'https://www.youtube.com/watch?v=hCg8hox12C4' 
  },
  { 
    id: 'v2', 
    title: 'Pourquoi Ariane s\'acharne face à SpaceX ?', 
    category: 'STRATÉGIE', 
    duration: '10:15', 
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Satellite/Orbit
    videoUrl: 'https://www.youtube.com/watch?v=0StUZuq0K5Y'
  },
  { 
    id: 'v3', 
    title: 'MaiaSpace, l\'entreprise française qui veut rivaliser avec SpaceX', 
    category: 'NEWSPACE', 
    duration: '03:45', 
    imageUrl: 'https://images.unsplash.com/photo-1596522509172-e1d88a183dc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rocket Engine
    videoUrl: 'https://www.youtube.com/watch?v=5nUehsleKQA'
  },
  { 
    id: 'v4', 
    title: 'Enfin une FUSÉE RÉUTILISABLE en EUROPE ! MAIA SPACE', 
    category: 'TECH', 
    duration: '18:20', 
    imageUrl: 'https://images.unsplash.com/photo-1569420587217-0c7da790757d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Clean room/Tech
    videoUrl: 'https://www.youtube.com/watch?v=1sjA4krnCDY'
  },
  { 
    id: 'v5', 
    title: 'La France a ENFIN son SpaceX ( Baguette One, Latitude.. ) ?', 
    category: 'STARTUP', 
    duration: '15:10', 
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Lab/Engineers
    videoUrl: 'https://www.youtube.com/watch?v=4akJfQCpsFA'
  },
  { 
    id: 'v6', 
    title: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', 
    category: 'CARGO', 
    duration: '08:45', 
    imageUrl: 'https://images.unsplash.com/photo-1454789548728-85d2696cf667?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Space station view
    videoUrl: 'https://www.youtube.com/watch?v=XP4VjQBPlqQ'
  },
  { 
    id: 'v7', 
    title: 'NASA should use The Exploration Company Nyx to backup Starship!', 
    category: 'OPINION', 
    duration: '11:30', 
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Earth/Capsule
    videoUrl: 'https://www.youtube.com/watch?v=nvEMhxTceQs'
  },
  { 
    id: 'v8', 
    title: 'Euclid discovers a stunning Einstein ring', 
    category: 'SCIENCE', 
    duration: '01:15', 
    imageUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Spiral Galaxy
    videoUrl: 'https://www.youtube.com/watch?v=pyCw_fhSndI'
  },
  { 
    id: 'v9', 
    title: 'The Telescope Images Scientists Have Been Waiting 12 Years For | Euclid', 
    category: 'DOCUMENTAIRE', 
    duration: '22:00', 
    imageUrl: 'https://images.unsplash.com/photo-1614726365723-498aa67c5f7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Telescope mirrors
    videoUrl: 'https://www.youtube.com/watch?v=N1AY3iCYkGs'
  },
  { 
    id: 'v10', 
    title: 'Incroyable ! JAMES WEBB détecte les toutes premières étoiles de l\'univers !', 
    category: 'ASTRONOMIE', 
    duration: '14:50', 
    imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Starfield
    videoUrl: 'https://www.youtube.com/watch?v=35lR0Wg5FII'
  },
  { 
    id: 'v11', 
    title: 'James Webb observe des points rouges que personne ne comprend !', 
    category: 'MYSTÈRE', 
    duration: '12:10', 
    imageUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Deep Red Space/Nebula
    videoUrl: 'https://www.youtube.com/watch?v=CQUs61L3xko'
  },
  { 
    id: 'v12', 
    title: 'ClearSpace-1 Mission Launch Update', 
    category: 'DURABILITÉ', 
    duration: '04:20', 
    imageUrl: 'https://images.unsplash.com/photo-1579935110378-8cb1d5c07b6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Abstract Tech/Space
    videoUrl: 'https://www.youtube.com/watch?v=03ZZdJf2nDA'
  },
];

export const ARTICLES: Article[] = [
  { 
    id: 'a1', 
    title: 'Pourquoi Toulouse est la capitale du spatial', 
    summary: 'Analyse économique et structurelle de l\'écosystème Aerospace Valley.', 
    date: '10 OCT 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1517976547714-720226b864c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Cockpit/City
  },
  { 
    id: 'a2', 
    title: 'Interview exclusive : Le DG de l\'ESA', 
    summary: 'Vision stratégique pour l\'autonomie européenne à l\'horizon 2030.', 
    date: '05 OCT 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Business/Tech
  },
  { 
    id: 'a3', 
    title: 'Propulsion Ionique : Le dossier technique', 
    summary: 'Comment les moteurs électriques redéfinissent les voyages lointains.', 
    date: '28 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Engineering
  },
  { 
    id: 'a4', 
    title: 'Retour sur la Lune : Mission Argonaut', 
    summary: 'Les détails de l\'atterrisseur logistique européen lourd.', 
    date: '20 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Moon surface
  },
  { 
    id: 'a5', 
    title: 'Loi Spatiale et Débris Orbitaux', 
    summary: 'Les nouvelles réglementations pour un espace durable (Zéro Débris).', 
    date: '15 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Orbit
  },
];

export const PARTNERS: Partner[] = [
  { 
    id: 'p1', 
    name: 'CNES', 
    role: 'Agence Spatiale', 
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Satellite
  },
  { 
    id: 'p2', 
    name: 'Airbus', 
    role: 'Constructeur', 
    imageUrl: 'https://images.unsplash.com/photo-1559087316-6b2633ccfd92?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Plane/Industry
  },
  { 
    id: 'p3', 
    name: 'Thales Alenia', 
    role: 'Satellites', 
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Chip/Tech
  },
  { 
    id: 'p4', 
    name: 'ISAE-SUPAERO', 
    role: 'Excellence', 
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Campus/Modern
  },
  { 
    id: 'p5', 
    name: 'Cité de l\'Espace', 
    role: 'Culture', 
    imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' // Space Exhibition
  },
];