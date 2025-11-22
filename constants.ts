
import { Video, Article, Partner } from './types';

export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos' },
  { label: 'Articles', href: '#articles' },
  { label: 'Écosystème', href: '#ecosystem' },
];

export const FEATURED_VIDEO: Video = {
  id: 'feat-1',
  title: 'Cap sur 2025 : Les Vœux du CNES',
  category: 'INSTITUTIONNEL',
  duration: '01:08',
  imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
  videoUrl: 'https://youtu.be/2FF0SRT7NW8?si=2XuKZ5DpK6Iqz0s7'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Décollage réussi pour JUICE', 
    category: 'EXPLORATION', 
    duration: '04:12', 
    imageUrl: 'https://images.unsplash.com/photo-1614728853975-69c960c72abc?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=M9jM_w0Yh9I' 
  },
  { 
    id: 'v2', 
    title: 'SWOT : L\'eau vue de l\'espace', 
    category: 'CLIMAT', 
    duration: '03:45', 
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=g7zFqO0sBqE'
  },
  { 
    id: 'v3', 
    title: 'Thomas Pesquet : Retour sur Alpha', 
    category: 'ASTRONAUTE', 
    duration: '26:30', 
    imageUrl: 'https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=h4aOaLzL-p8'
  },
  { 
    id: 'v4', 
    title: 'Le Centre Spatial Guyanais (CSG)', 
    category: 'INFRASTRUCTURE', 
    duration: '08:15', 
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=7_8qj1y2wz4'
  },
  { 
    id: 'v5', 
    title: 'MicroCarb : Piéger le CO2', 
    category: 'SCIENCE', 
    duration: '05:00', 
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=hQ_rRj6d-kU'
  },
  { 
    id: 'v6', 
    title: 'Les Rovers Martiens : Perseverance', 
    category: 'MARS', 
    duration: '11:25', 
    imageUrl: 'https://images.unsplash.com/photo-1614726365723-49cfa9565196?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=4czjS9h4Fpg'
  },
  { 
    id: 'v7', 
    title: 'Nanosatellites : La Révolution Angels', 
    category: 'NEWSPACE', 
    duration: '06:45', 
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=r8s8hZ1_w0Y'
  },
  { 
    id: 'v8', 
    title: 'Gaia : Cartographier la Voie Lactée', 
    category: 'ASTRONOMIE', 
    duration: '09:10', 
    imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=oGjMyWv9s1c'
  },
  { 
    id: 'v9', 
    title: 'Le Ballon Stratosphérique', 
    category: 'INNOVATION', 
    duration: '07:20', 
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=d3J7X5l6g6E'
  },
  { 
    id: 'v10', 
    title: 'Ariane 6 : Préparatifs', 
    category: 'LANCEURS', 
    duration: '02:30', 
    imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=phVjD3d2yGg'
  },
];

export const ARTICLES: Article[] = [
  { id: 'a1', title: 'Pourquoi Toulouse est la capitale du spatial', summary: 'Analyse économique et structurelle de l\'écosystème Aerospace Valley.', date: '10 OCT 2023', imageUrl: '' },
  { id: 'a2', title: 'Interview exclusive : Le DG de l\'ESA', summary: 'Vision stratégique pour l\'autonomie européenne à l\'horizon 2030.', date: '05 OCT 2023', imageUrl: '' },
  { id: 'a3', title: 'Propulsion Ionique : Le dossier technique', summary: 'Comment les moteurs électriques redéfinissent les voyages lointains.', date: '28 SEP 2023', imageUrl: '' },
  { id: 'a4', title: 'Retour sur la Lune : Mission Argonaut', summary: 'Les détails de l\'atterrisseur logistique européen lourd.', date: '20 SEP 2023', imageUrl: '' },
  { id: 'a5', title: 'Loi Spatiale et Débris Orbitaux', summary: 'Les nouvelles réglementations pour un espace durable (Zéro Débris).', date: '15 SEP 2023', imageUrl: '' },
];

export const PARTNERS: Partner[] = [
  { id: 'p1', name: 'CNES', role: 'Agence Spatiale', imageUrl: 'https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=600&q=80' },
  { id: 'p2', name: 'Airbus', role: 'Constructeur', imageUrl: 'https://images.unsplash.com/photo-1559689549-e979dc929c8d?auto=format&fit=crop&w=600&q=80' },
  { id: 'p3', name: 'Thales Alenia', role: 'Satellites', imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?auto=format&fit=crop&w=600&q=80' },
  { id: 'p4', name: 'ISAE-SUPAERO', role: 'Excellence', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80' },
  { id: 'p5', name: 'Cité de l\'Espace', role: 'Culture', imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=600&q=80' },
];

export const MILESTONES = [
  { year: '1975', title: 'Création de l\'ESA', description: 'L\'Europe unit ses forces spatiales.' },
  { year: '1979', title: 'Ariane 1', description: 'Premier vol qui ouvre l\'accès à l\'espace.' },
  { year: '2004', title: 'Mission Rosetta', description: 'Première orbite autour d\'une comète.' },
  { year: '2016', title: 'Galileo', description: 'Le GPS européen devient opérationnel.' },
  { year: '2024', title: 'Ariane 6', description: 'La souveraineté retrouvée.' },
];
