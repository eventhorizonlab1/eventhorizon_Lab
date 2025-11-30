// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    const videos = [
      {
        title: "Ariane 6 - Le Vol Inaugural (Replay)",
        category: "Launchers",
        subcategory: "Ariane",
        duration: "03:45:00",
        imageUrl: "https://img.youtube.com/vi/B5mDezzc74M/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=B5mDezzc74M",
        description: "Replay intégral du vol inaugural historique d'Ariane 6 depuis le Centre Spatial Guyanais.",
      },
      {
        title: "Ariane 6 : Un succès (presque) complet ! (Hugo Lisoir)",
        category: "Analysis",
        subcategory: "Ariane",
        duration: "15:20",
        imageUrl: "https://img.youtube.com/vi/Tiqfj7QhKyI/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Tiqfj7QhKyI",
        description: "Analyse détaillée du premier vol d'Ariane 6 par Hugo Lisoir. Succès, anomalies et futur du lanceur.",
      },
      {
        title: "Lancement Inaugural Ariane 6 commenté (Stardust)",
        category: "Launchers",
        subcategory: "Ariane",
        duration: "04:10:00",
        imageUrl: "https://img.youtube.com/vi/MRGid8lylLc/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=MRGid8lylLc",
        description: "Vivez le lancement d'Ariane 6 avec les commentaires passionnés de Stardust.",
      },
      {
        title: "Décollage Ariane 6 - Vol VA265 / Sentinel-1D (Nov 2025)",
        category: "Launchers",
        subcategory: "Ariane",
        duration: "05:30",
        imageUrl: "https://img.youtube.com/vi/FDKbEavYCVk/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=FDKbEavYCVk",
        description: "Décollage spectaculaire d'Ariane 6 pour la mission VA265 emportant le satellite Sentinel-1D.",
      },
      {
        title: "Rêves d'Espace : Décollage Ariane 6 VA265",
        category: "Launchers",
        subcategory: "Ariane",
        duration: "04:45",
        imageUrl: "https://img.youtube.com/vi/ELTmiLg7gLw/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=ELTmiLg7gLw",
        description: "Images cinématographiques du décollage de la mission VA265.",
      },
      {
        title: "ESA Open Day 2025 (ESRIN)",
        category: "Events",
        subcategory: "ESA",
        duration: "12:00",
        imageUrl: "https://img.youtube.com/vi/LsX01klFlpU/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=LsX01klFlpU",
        description: "Retour sur la journée portes ouvertes de l'ESA à l'ESRIN en 2025.",
      },
      {
        title: "Hélène Huby (The Exploration Company) à BIG 2025",
        category: "Interviews",
        subcategory: "The Exploration Company",
        duration: "25:00",
        imageUrl: "https://img.youtube.com/vi/jUQ3qZNLXNg/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=jUQ3qZNLXNg",
        description: "Intervention inspirante d'Hélène Huby lors de l'événement BIG 2025.",
      },
      {
        title: "The Exploration Company : Présentation Capsule Nyx",
        category: "Tech",
        subcategory: "The Exploration Company",
        duration: "08:15",
        imageUrl: "https://img.youtube.com/vi/tqRHR6u2MpQ/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=tqRHR6u2MpQ",
        description: "Découvrez Nyx, la capsule cargo modulaire développée par The Exploration Company.",
      },
      {
        title: "MaiaSpace : Allocutions officielles (Juin 2025)",
        category: "Launchers",
        subcategory: "MaiaSpace",
        duration: "18:30",
        imageUrl: "https://img.youtube.com/vi/C4BdQ5n34Wo/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=C4BdQ5n34Wo",
        description: "Annonces et discours officiels concernant l'avancement du lanceur Maia.",
      },
      {
        title: "Yohann Leroy (CEO MaiaSpace) - Interview",
        category: "Interviews",
        subcategory: "MaiaSpace",
        duration: "22:10",
        imageUrl: "https://img.youtube.com/vi/GvL919qYTSY/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=GvL919qYTSY",
        description: "Entretien exclusif avec Yohann Leroy sur les ambitions de MaiaSpace.",
      },
      {
        title: "Latitude : Stanislas Maximin (CEO) - Interview",
        category: "Interviews",
        subcategory: "Latitude",
        duration: "20:00",
        imageUrl: "https://img.youtube.com/vi/E0eVosJGnjA/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=E0eVosJGnjA",
        description: "Stanislas Maximin détaille la feuille de route de Latitude et du lanceur Zephyr.",
      },
      {
        title: "Latitude à VivaTech 2025 (Short)",
        category: "Events",
        subcategory: "Latitude",
        duration: "01:00",
        imageUrl: "https://img.youtube.com/vi/5ImuM68aN5c/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/shorts/5ImuM68aN5c",
        description: "Aperçu rapide de la présence de Latitude à VivaTech 2025.",
      },
      {
        title: "Isar Aerospace : Premier vol Spectrum (Mars 2025)",
        category: "Launchers",
        subcategory: "Isar Aerospace",
        duration: "06:45",
        imageUrl: "https://img.youtube.com/vi/yAxzKhxqdWg/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=yAxzKhxqdWg",
        description: "Images du premier vol orbital du lanceur Spectrum d'Isar Aerospace.",
      },
      {
        title: "Analyse du crash Isar Aerospace",
        category: "Analysis",
        subcategory: "Isar Aerospace",
        duration: "12:30",
        imageUrl: "https://img.youtube.com/vi/LxC-BvAW5G4/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=LxC-BvAW5G4",
        description: "Retour technique sur les anomalies rencontrées lors du vol de test.",
      },
      {
        title: "HyImpulse : Premier tir (Mai 2024)",
        category: "Launchers",
        subcategory: "HyImpulse",
        duration: "05:15",
        imageUrl: "https://img.youtube.com/vi/IaxMjVpdAsY/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=IaxMjVpdAsY",
        description: "Lancement suborbital réussi pour la fusée hybride SR75 de HyImpulse.",
      },
      {
        title: "PLD Space : Miura 5 Update (Oct 2025)",
        category: "Launchers",
        subcategory: "PLD Space",
        duration: "01:00",
        imageUrl: "https://img.youtube.com/vi/7-r6yEgORes/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/shorts/7-r6yEgORes",
        description: "Mise à jour rapide sur le développement du lanceur Miura 5.",
      },
      {
        title: "Hugo Lisoir : Perspectives et défis 2025",
        category: "Analysis",
        subcategory: "Space Industry",
        duration: "18:00",
        imageUrl: "https://img.youtube.com/vi/86ufZvtsj8M/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=86ufZvtsj8M",
        description: "Hugo Lisoir dresse le bilan et les perspectives du spatial européen pour 2025.",
      },
      {
        title: "Latitude : A French Space Startup (Reportage)",
        category: "Launchers",
        subcategory: "Latitude",
        duration: "10:00",
        imageUrl: "https://img.youtube.com/vi/1jA1c7PyBDk/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1jA1c7PyBDk",
        description: "Reportage en immersion chez Latitude, la pépite française du NewSpace.",
      },
      {
        title: "Comprendre MaiaSpace en 30 secondes",
        category: "Launchers",
        subcategory: "MaiaSpace",
        duration: "00:30",
        imageUrl: "https://img.youtube.com/vi/7tyJPJkFvM8/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=7tyJPJkFvM8",
        description: "Vidéo explicative courte sur le positionnement de MaiaSpace.",
      },
      {
        title: "ESA Living Planet Symposium 2025",
        category: "Events",
        subcategory: "ESA",
        duration: "03:30",
        imageUrl: "https://img.youtube.com/vi/qhOfIy6PpH8/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=qhOfIy6PpH8",
        description: "Les moments forts du symposium Living Planet 2025 organisé par l'ESA.",
      },
    ];

    try {
      const count = await strapi.entityService.count('api::video.video');
      if (count === 0) {
        strapi.log.info('🚀 Seeding videos...');
        for (const video of videos) {
          await strapi.entityService.create('api::video.video', {
            data: {
              ...video,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info('✅ Seeding completed: 20 videos added.');
      } else {
        strapi.log.info('ℹ️ Videos already exist, skipping seed.');
      }
    } catch (error) {
      strapi.log.error('❌ Seeding failed:', error);
    }
  },
};
