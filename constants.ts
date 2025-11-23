import { Video, Article, Partner } from './types';

// Removed History, Studio and Oracle as requested
export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos', key: 'nav_videos' },
  { label: 'Articles', href: '#articles', key: 'nav_articles' },
  { label: 'Écosystème', href: '#ecosystem', key: 'nav_ecosystem' },
];

export const FEATURED_VIDEO: Video = {
  id: 'feat-1',
  title: 'Cap sur 2025 : Les Vœux du CNES',
  category: 'INSTITUTIONNEL',
  duration: '01:08',
  imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', // Earth Orbit
  videoUrl: 'https://youtu.be/2FF0SRT7NW8?si=2XuKZ5DpK6Iqz0s7'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Décollage réussi pour JUICE', 
    category: 'EXPLORATION', 
    duration: '04:12', 
    imageUrl: 'https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Jupiter
    videoUrl: 'https://www.youtube.com/watch?v=M9jM_w0Yh9I' 
  },
  { 
    id: 'v2', 
    title: 'SWOT : L\'eau vue de l\'espace', 
    category: 'CLIMAT', 
    duration: '03:45', 
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Tech/Satellite View
    videoUrl: 'https://www.youtube.com/watch?v=g7zFqO0sBqE'
  },
  { 
    id: 'v3', 
    title: 'Thomas Pesquet : Retour sur Alpha', 
    category: 'ASTRONAUTE', 
    duration: '26:30', 
    imageUrl: 'https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Astronaut/Suit
    videoUrl: 'https://www.youtube.com/watch?v=h4aOaLzL-p8'
  },
  { 
    id: 'v4', 
    title: 'Le Centre Spatial Guyanais (CSG)', 
    category: 'INFRASTRUCTURE', 
    duration: '08:15', 
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rocket Launch
    videoUrl: 'https://www.youtube.com/watch?v=7_8qj1y2wz4'
  },
  { 
    id: 'v5', 
    title: 'MicroCarb : Piéger le CO2', 
    category: 'SCIENCE', 
    duration: '05:00', 
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Lab/Science
    videoUrl: 'https://www.youtube.com/watch?v=hQ_rRj6d-kU'
  },
  { 
    id: 'v6', 
    title: 'Les Rovers Martiens : Perseverance', 
    category: 'MARS', 
    duration: '11:25', 
    imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mars Surface
    videoUrl: 'https://www.youtube.com/watch?v=4czjS9h4Fpg'
  },
  { 
    id: 'v7', 
    title: 'Nanosatellites : La Révolution Angels', 
    category: 'NEWSPACE', 
    duration: '06:45', 
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Satellite array
    videoUrl: 'https://www.youtube.com/watch?v=r8s8hZ1_w0Y'
  },
  { 
    id: 'v8', 
    title: 'Gaia : Cartographier la Voie Lactée', 
    category: 'ASTRONOMIE', 
    duration: '09:10', 
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Galaxy/Stars
    videoUrl: 'https://www.youtube.com/watch?v=oGjMyWv9s1c'
  },
  { 
    id: 'v9', 
    title: 'Le Ballon Stratosphérique', 
    category: 'INNOVATION', 
    duration: '07:20', 
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Sky/Atmosphere
    videoUrl: 'https://www.youtube.com/watch?v=d3J7X5l6g6E'
  },
  { 
    id: 'v10', 
    title: 'Ariane 6 : Préparatifs', 
    category: 'LANCEURS', 
    duration: '02:30', 
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rocket Engine
    videoUrl: 'https://www.youtube.com/watch?v=phVjD3d2yGg'
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

export const MILESTONES = [
  { year: '1961' },
  { year: '1979' },
  { year: '2004' },
  { year: '2014' },
  { year: '2021' },
  { year: '2024' }
];