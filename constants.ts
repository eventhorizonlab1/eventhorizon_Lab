

import { Video, Article, Partner } from './types';

export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos' },
  { label: 'Articles', href: '#articles' },
  { label: 'Écosystème', href: '#ecosystem' },
  { label: 'Simulations', href: '#blackhole' },
];

export const FEATURED_VIDEO: Video = {
  id: 'feat-1',
  title: 'Cap sur 2025 : Les Vœux du CNES',
  category: 'INSTITUTIONNEL',
  duration: '01:08',
  imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1600&q=80',
  videoUrl: 'https://youtu.be/2FF0SRT7NW8?si=2XuKZ5DpK6Iqz0s7'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Décollage réussi pour JUICE', 
    category: 'EXPLORATION', 
    duration: '04:12', 
    imageUrl: 'https://images.unsplash.com/photo-1541185933-710f50031e42?auto=format&fit=crop&w=800&q=80', // Jupiter colors
    videoUrl: 'https://www.youtube.com/watch?v=M9jM_w0Yh9I' 
  },
  { 
    id: 'v2', 
    title: 'SWOT : L\'eau vue de l\'espace', 
    category: 'CLIMAT', 
    duration: '03:45', 
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Earth from space
    videoUrl: 'https://www.youtube.com/watch?v=g7zFqO0sBqE'
  },
  { 
    id: 'v3', 
    title: 'Thomas Pesquet : Retour sur Alpha', 
    category: 'ASTRONAUTE', 
    duration: '26:30', 
    imageUrl: 'https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=800&q=80', // Astronaut
    videoUrl: 'https://www.youtube.com/watch?v=h4aOaLzL-p8'
  },
  { 
    id: 'v4', 
    title: 'Le Centre Spatial Guyanais (CSG)', 
    category: 'INFRASTRUCTURE', 
    duration: '08:15', 
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80', // Rocket launchpad vibe
    videoUrl: 'https://www.youtube.com/watch?v=7_8qj1y2wz4'
  },
  { 
    id: 'v5', 
    title: 'MicroCarb : Piéger le CO2', 
    category: 'SCIENCE', 
    duration: '05:00', 
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80', // Earth atmosphere
    videoUrl: 'https://www.youtube.com/watch?v=hQ_rRj6d-kU'
  },
  { 
    id: 'v6', 
    title: 'Les Rovers Martiens : Perseverance', 
    category: 'MARS', 
    duration: '11:25', 
    imageUrl: 'https://images.unsplash.com/photo-1614726365723-49cfa9565196?auto=format&fit=crop&w=800&q=80', // Mars surface
    videoUrl: 'https://www.youtube.com/watch?v=4czjS9h4Fpg'
  },
  { 
    id: 'v7', 
    title: 'Nanosatellites : La Révolution Angels', 
    category: 'NEWSPACE', 
    duration: '06:45', 
    imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80', // Deep space / stars
    videoUrl: 'https://www.youtube.com/watch?v=r8s8hZ1_w0Y'
  },
  { 
    id: 'v8', 
    title: 'Gaia : Cartographier la Voie Lactée', 
    category: 'ASTRONOMIE', 
    duration: '09:10', 
    imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?auto=format&fit=crop&w=800&q=80', // Milky way
    videoUrl: 'https://www.youtube.com/watch?v=oGjMyWv9s1c'
  },
  { 
    id: 'v9', 
    title: 'Le Ballon Stratosphérique', 
    category: 'INNOVATION', 
    duration: '07:20', 
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80', // High altitude
    videoUrl: 'https://www.youtube.com/watch?v=d3J7X5l6g6E'
  },
  { 
    id: 'v10', 
    title: 'Ariane 6 : Préparatifs', 
    category: 'LANCEURS', 
    duration: '02:30', 
    imageUrl: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?auto=format&fit=crop&w=800&q=80', // Rocket engine/tech
    videoUrl: 'https://www.youtube.com/watch?v=phVjD3d2yGg'
  },
];

export const ARTICLES: Article[] = [
  { 
    id: 'a1', 
    title: 'Pourquoi Toulouse est la capitale du spatial', 
    summary: 'Analyse économique et structurelle de l\'écosystème Aerospace Valley.', 
    date: '10 OCT 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'a2', 
    title: 'Interview exclusive : Le DG de l\'ESA', 
    summary: 'Vision stratégique pour l\'autonomie européenne à l\'horizon 2030.', 
    date: '05 OCT 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'a3', 
    title: 'Propulsion Ionique : Le dossier technique', 
    summary: 'Comment les moteurs électriques redéfinissent les voyages lointains.', 
    date: '28 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'a4', 
    title: 'Retour sur la Lune : Mission Argonaut', 
    summary: 'Les détails de l\'atterrisseur logistique européen lourd.', 
    date: '20 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'a5', 
    title: 'Loi Spatiale et Débris Orbitaux', 
    summary: 'Les nouvelles réglementations pour un espace durable (Zéro Débris).', 
    date: '15 SEP 2023', 
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80' 
  },
];

export const PARTNERS: Partner[] = [
  { 
    id: 'p1', 
    name: 'CNES', 
    role: 'Agence Spatiale', 
    imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?auto=format&fit=crop&w=600&q=80' // Satellite dish/tech
  },
  { 
    id: 'p2', 
    name: 'Airbus', 
    role: 'Constructeur', 
    imageUrl: 'https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?auto=format&fit=crop&w=600&q=80' // Plane/Sky
  },
  { 
    id: 'p3', 
    name: 'Thales Alenia', 
    role: 'Satellites', 
    imageUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=600&q=80' // Lab/Clean room
  },
  { 
    id: 'p4', 
    name: 'ISAE-SUPAERO', 
    role: 'Excellence', 
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80' // University/Education
  },
  { 
    id: 'p5', 
    name: 'Cité de l\'Espace', 
    role: 'Culture', 
    imageUrl: 'https://images.unsplash.com/photo-1454789548728-85d2696cfb9e?auto=format&fit=crop&w=600&q=80' // Museum/Astronaut suit
  },
];

export const MILESTONES = [
  { year: '1975', title: 'Création de l\'ESA', description: 'L\'Europe unit ses forces spatiales.' },
  { year: '1979', title: 'Ariane 1', description: 'Premier vol qui ouvre l\'accès à l\'espace.' },
  { year: '2004', title: 'Mission Rosetta', description: 'Première orbite autour d\'une comète.' },
  { year: '2016', title: 'Galileo', description: 'Le GPS européen devient opérationnel.' },
  { year: '2024', title: 'Ariane 6', description: 'La souveraineté retrouvée.' },
];
