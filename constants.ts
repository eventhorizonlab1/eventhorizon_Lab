
import { Video, Article, Partner } from './types';

// Navigation simplifiée : Vidéos, Articles, Écosystème
export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos', key: 'nav_videos' },
  { label: 'Articles', href: '#articles', key: 'nav_articles' },
  { label: 'Écosystème', href: '#ecosystem', key: 'nav_ecosystem' },
];

export const FEATURED_VIDEO: Video = {
  id: 'feat-1',
  title: 'Lancement Ariane 6 : Sentinel-1D (VA265)',
  category: 'LANCEURS',
  duration: 'Live',
  imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', // Rocket Launch Night
  videoUrl: 'https://www.youtube.com/watch?v=ukoMgE_8heo'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Ariane 6 : la fusée européenne a réussi son 3ème envol', 
    category: 'ACTUALITÉ', 
    duration: '12:30', 
    imageUrl: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rocket in hangar/prep
    videoUrl: 'https://www.youtube.com/watch?v=hCg8hox12C4' 
  },
  { 
    id: 'v2', 
    title: 'Pourquoi Ariane s\'acharne face à SpaceX ?', 
    category: 'STRATÉGIE', 
    duration: '10:15', 
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Analytics/Data
    videoUrl: 'https://www.youtube.com/watch?v=0StUZuq0K5Y'
  },
  { 
    id: 'v3', 
    title: 'MaiaSpace, l\'entreprise française qui veut rivaliser avec SpaceX', 
    category: 'NEWSPACE', 
    duration: '03:45', 
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rocket Engine
    videoUrl: 'https://www.youtube.com/watch?v=5nUehsleKQA'
  },
  { 
    id: 'v4', 
    title: 'Enfin une FUSÉE RÉUTILISABLE en EUROPE ! MAIA SPACE', 
    category: 'TECH', 
    duration: '18:20', 
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Engineering/Lab
    videoUrl: 'https://www.youtube.com/watch?v=1sjA4krnCDY'
  },
  { 
    id: 'v5', 
    title: 'La France a ENFIN son SpaceX ( Baguette One, Latitude.. ) ?', 
    category: 'STARTUP', 
    duration: '15:10', 
    imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39714aeb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Startup/Office/Space
    videoUrl: 'https://www.youtube.com/watch?v=4akJfQCpsFA'
  },
  { 
    id: 'v6', 
    title: 'Space Startup News: The Exploration Company Nyx Crew Vehicle', 
    category: 'CARGO', 
    duration: '08:45', 
    imageUrl: 'https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Astronaut/Capsule
    videoUrl: 'https://www.youtube.com/watch?v=XP4VjQBPlqQ'
  },
  { 
    id: 'v7', 
    title: 'NASA should use The Exploration Company Nyx to backup Starship!', 
    category: 'OPINION', 
    duration: '11:30', 
    imageUrl: 'https://images.unsplash.com/photo-1454789548728-85d2696cf667?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Moon/Orbit
    videoUrl: 'https://www.youtube.com/watch?v=nvEMhxTceQs'
  },
  { 
    id: 'v8', 
    title: 'Euclid discovers a stunning Einstein ring', 
    category: 'SCIENCE', 
    duration: '01:15', 
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Deep Space Galaxy
    videoUrl: 'https://www.youtube.com/watch?v=pyCw_fhSndI'
  },
  { 
    id: 'v9', 
    title: 'The Telescope Images Scientists Have Been Waiting 12 Years For | Euclid', 
    category: 'DOCUMENTAIRE', 
    duration: '22:00', 
    imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8bcbf67cc77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Telescope lens/Space
    videoUrl: 'https://www.youtube.com/watch?v=N1AY3iCYkGs'
  },
  { 
    id: 'v10', 
    title: 'Incroyable ! JAMES WEBB détecte les toutes premières étoiles de l\'univers !', 
    category: 'ASTRONOMIE', 
    duration: '14:50', 
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Starfield
    videoUrl: 'https://www.youtube.com/watch?v=35lR0Wg5FII'
  },
  { 
    id: 'v11', 
    title: 'James Webb observe des points rouges que personne ne comprend !', 
    category: 'MYSTÈRE', 
    duration: '12:10', 
    imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Deep Red Space
    videoUrl: 'https://www.youtube.com/watch?v=CQUs61L3xko'
  },
  { 
    id: 'v12', 
    title: 'ClearSpace-1 Mission Launch Update', 
    category: 'DURABILITÉ', 
    duration: '04:20', 
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Earth/Debris/Orbit
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

export const MILESTONES = [
  { year: '1961' },
  { year: '1979' },
  { year: '2014' },
  { year: '2021' },
];
