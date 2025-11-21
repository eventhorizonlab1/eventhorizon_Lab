
import { Video, Article, Partner } from './types';

export const NAV_LINKS = [
  { label: 'Vidéos', href: '#videos' },
  { label: 'Articles', href: '#articles' },
  { label: 'Écosystème', href: '#ecosystem' },
  { label: 'Studio', href: '#oracle' },
];

export const FEATURED_VIDEO: Video = {
  id: 'feat-1',
  title: 'Ariane 6 : Le défi du premier vol',
  category: 'LANCEURS',
  duration: '14:20',
  // Image de lancement de fusée massive pour représenter Ariane 6 (Kourou vibe)
  imageUrl: 'https://images.unsplash.com/photo-1541185933-710f50933984?auto=format&fit=crop&w=1600&q=80'
};

export const VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Airbus Defence and Space : Visite guidée', 
    category: 'INDUSTRIE', 
    duration: '08:45', 
    // Salle blanche propre à l'industrie
    imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'v2', 
    title: 'L\'ESA et l\'exploration lunaire', 
    category: 'EXPLORATION', 
    duration: '12:10', 
    // Surface lunaire
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'v3', 
    title: 'Thales Alenia Space : Nouveaux horizons', 
    category: 'INNOVATION', 
    duration: '09:30', 
    // Vue orbitale / Satellite
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'v4', 
    title: 'Les startups du NewSpace', 
    category: 'NEWSPACE', 
    duration: '06:15', 
    // Technologie de pointe / Fusée
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'v5', 
    title: 'Observation de la Terre : Sentinel', 
    category: 'DATA', 
    duration: '10:00', 
    // Vue Terre depuis l'espace (Copernicus style)
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'v6', 
    title: 'Le futur des constellations', 
    category: 'TECH', 
    duration: '11:25', 
    // Réseau / Abstract
    imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'v7', 
    title: 'Euclid : Dévoiler l\'Univers sombre', 
    category: 'SCIENCE', 
    duration: '13:45', 
    // Deep Space / Nebula
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80' 
  },
];

export const ARTICLES: Article[] = [
  { id: 'a1', title: 'Pourquoi Toulouse est la capitale du spatial', summary: 'Analyse approfondie de l\'écosystème local.', date: '10 OCT 2023', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' },
  { id: 'a2', title: 'Interview exclusive : Directeur de l\'ESA', summary: 'Vision stratégique pour 2030.', date: '05 OCT 2023', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
  { id: 'a3', title: 'La propulsion ionique expliquée', summary: 'Dossier technique sur les moteurs du futur.', date: '28 SEP 2023', imageUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&w=800&q=80' },
  { id: 'a4', title: 'Le retour de l\'Europe sur la Lune', summary: 'Les missions Argonaut et EL3.', date: '20 SEP 2023', imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80' },
  { id: 'a5', title: 'Sécurité spatiale et débris', summary: 'Comment nettoyer l\'orbite basse.', date: '15 SEP 2023', imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80' },
];

export const PARTNERS: Partner[] = [
  { id: 'p1', name: 'CNES', role: 'Agence Spatiale', imageUrl: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&w=600&q=80' },
  { id: 'p2', name: 'Aerospace Valley', role: 'Pôle de Compétitivité', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
  { id: 'p3', name: 'Cité de l\'Espace', role: 'Culture Scientifique', imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80' },
  { id: 'p4', name: 'ISAE-SUPAERO', role: 'Formation & Recherche', imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80' },
  { id: 'p5', name: 'Loft Orbital', role: 'Opérateur Satellitaire', imageUrl: 'https://images.unsplash.com/photo-1614726365162-4e5d86d7d943?auto=format&fit=crop&w=600&q=80' },
];

export const MILESTONES = [
  { year: '1975', title: 'Création de l\'ESA', description: 'L\'Europe unit ses forces spatiales.' },
  { year: '1979', title: 'Ariane 1', description: 'Premier vol qui ouvre l\'accès à l\'espace.' },
  { year: '2004', title: 'Mission Rosetta', description: 'Première orbite autour d\'une comète.' },
  { year: '2016', title: 'Galileo', description: 'Le GPS européen devient opérationnel.' },
  { year: '2024', title: 'Ariane 6', description: 'La souveraineté retrouvée.' },
];