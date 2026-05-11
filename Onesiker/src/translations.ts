// UI strings (nav labels, button text, form placeholders, etc.) — owned by the
// codebase and shipped at build time. Editable content (bio, news, artworks,
// contact) lives in public/data/*.json, edited via the back-office, and read at
// runtime via useJsonData(). Don't move section content here, and don't move UI
// chrome to JSON: a clean split keeps the back-office focused on what the client
// actually edits.
export const translations = {
  en: {
    nav: { artworks: "Artworks", news: "News", shop: "Shop", contact: "Contact", wip: "Coming soon" },
    search: {
      open: "Search",
      title: "Search",
      placeholder: "Search news, artworks, bio…",
      hint: "Type at least 2 characters to start searching.",
      noResults: "No results found.",
      close: "Close",
    },
    hero: { subtitle: "Premium Graffiti Art since 1990" },
    about: {
      title: "Onesiker",
      baseline: "Biography",
      subtitle: "A singular artist and iconic figure of the Toulouse graffiti scene, ONESIKER turns his own existence into a work in perpetual creation, a living canvas where every experience, every spray can stroke tells a part of his story.",
      paragraphs: [
        "Born in Saigon, Onesiker arrived in Toulouse at the age of 5, a city that would become his home, his playground, and his source of inspiration. It is in the streets of the 'Pink City' that he forged his artistic identity, becoming from the early 90s one of the pioneers and Kings of vandal graffiti in the South of France.",
        "In 1999, he founded South Painters, a graffiti shop, urban art gallery, and true headquarters for a whole generation of artists and graffiti writers. This unique place had a considerable impact on local urban culture and beyond, welcoming figures from the international graffiti scene. The South Painters adventure ended in 2024, after more than 25 years of resistance, passion, and transmission.",
        "Parallel to his work in the street, Onesiker develops an intense pictorial universe, where his instinct guides his hand like a plotter. Emotion bursts through the surface of the canvas. His works capture a raw energy, an inner tension that he transforms into compositions that are both free and perfectly mastered. He deconstructs his own mythical tags and iconic throw-ups, extracts fragments to give birth to a calligraphic abstraction, where the letter becomes form, and the form becomes an externalized inner feeling.",
        "For Onesiker, each work is an intimate barometer, a heartbeat. His style oscillates between dazzling speed and precision, between chaos and balance. He paints as he breathes, with urgency and sincerity. Like a modern calligrapher, he plays with emptiness and fullness, rage and peace, injury and healing.",
        "Master of his adrenaline, he traces his pain as much as he sublimates it. In his works resonates a visceral poetry, that of a man who has made graffiti a language, the street a sanctuary, and his life a continuous creation."
      ],
      readMore: "Read more",
      readLess: "Read less"
    },
    artworks: {
      title: "Artwork",
      subtitle: "Portfolio 2026",
      viewGallery: "View Gallery",
      interestedText: "Interested in this artwork, ",
      generalInterestedText: "Interested in one of his artworks, ",
      contactLinkText: "contact us!",
      items: [
        { title: "Deep Blue", category: "Blueism" },
        { title: "Street Kingz", category: "Collabs" },
        { title: "Total Obscur", category: "B&W" },
        { title: "Win or Lose", category: "Drips" },
        { title: "Self Made", category: "Throw-ups" },
        { title: "The Bikini", category: "Miami Vibes" },
        { title: "Like a Movie Star", category: "Large-scale" }
      ]
    },
    news: {
      title: "Latest News",
      subtitle: "Updates & Announcements",
      viewAll: "View All",
      items: []
    },
    shop: {
      title: "Shop",
      subtitle: "Premium Graffiti Art since 1990",
      enter: "Enter the Shop"
    },
    contact: {
      title: "Get in Touch",
      desc: "Find Onesiker's work at his studio.",
      formIntro: "If you have a crush on a piece or a project, leave us your contact details and the subject of your request, and we will get back to you as soon as possible.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      placeholderName: "Jane Doe",
      placeholderEmail: "jane@example.com",
      placeholderMessage: "How can we help you?"
    },
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    }
  },
  fr: {
    nav: { artworks: "Atelier", news: "Actualités", shop: "Boutique", contact: "Contact", wip: "En cours" },
    search: {
      open: "Rechercher",
      title: "Rechercher",
      placeholder: "Rechercher actualités, œuvres, bio…",
      hint: "Tapez au moins 2 caractères pour lancer la recherche.",
      noResults: "Aucun résultat.",
      close: "Fermer",
    },
    hero: { subtitle: "Graffiti Art Premium depuis 1990" },
    about: {
      title: "Onesiker",
      baseline: "Biographie",
      subtitle: "Artiste singulier et figure emblématique de la scène graffiti toulousaine, ONESIKER fait de sa propre existence une œuvre en perpétuelle création, une toile vivante où chaque expérience, chaque tracé de bombe raconte une partie de son histoire.",
      paragraphs: [
        "Onesiker, né à Saïgon, arrive à Toulouse à l’âge de 5 ans, ville qui deviendra à la fois son lieu de vie, son terrain de jeu et sa source d’inspiration. C’est dans les rues de la ville rose qu’il forge son identité artistique, devenant dès le début des années 90 l’un des pionniers et des Kings du graffiti vandale du Sud de la France.",
        "En 1999, il fonde South Painters, à la fois magasin de graffiti, galerie d’art urbain et véritable QG pour toute une génération d’artistes et de graffeurs. Ce lieu unique aura un impact considérable sur la culture urbaine locale et au-delà, en accueillant des figures de la scène graffiti internationale. L’aventure South Painters prendra fin en 2024, après plus de 25 ans de résistance, de passion et de transmission.",
        "Parallèlement à son travail dans la rue, Onesiker développe un univers pictural intense, où son instinct guide sa main comme un traceur. L’émotion crève la surface de la toile. Ses œuvres capturent une énergie brute, une tension intérieure qu’il transforme en compositions à la fois libres et parfaitement maîtrisées. Il déconstruit ses propres tags mythiques et throw-ups iconiques, en extrait des fragments pour en faire naître une abstraction calligraphique, où la lettre devient forme, et la forme devient un ressenti intérieur extériorisé.",
        "Chez Onesiker, chaque œuvre est un baromètre intime, une pulsation du cœur. Son style oscille entre fulgurance et précision, entre chaos et équilibre. Il peint comme il respire, avec urgence et sincérité. Tel un calligraphe moderne, il joue avec le vide et le plein, la rage et la paix, la blessure et la guérison.",
        "Maître de son adrénaline, il trace sa douleur autant qu’il la sublime. Dans ses œuvres résonne une poésie viscérale, celle d’un homme qui a fait du graffiti un langage, de la rue un sanctuaire, et de sa vie une création continue."
      ],
      readMore: "Lire la suite",
      readLess: "Réduire"
    },
    artworks: {
      title: "Atelier",
      subtitle: "Portfolio 2026",
      viewGallery: "Voir la Galerie",
      interestedText: "Cette œuvre vous intéresse, ",
      generalInterestedText: "Une de ces œuvres vous intéresse, ",
      contactLinkText: "contactez-nous !",
      items: [
        { title: "Deep Blue", category: "Blueism" },
        { title: "Street Kingz", category: "Collabs" },
        { title: "Total Obscur", category: "N&B" },
        { title: "Win or Lose", category: "Drips" },
        { title: "Self Made", category: "Throw-ups" },
        { title: "The Bikini", category: "Miami Vibes" },
        { title: "Like a Movie Star", category: "Grands Formats" }
      ]
    },
    news: {
      title: "Actualités",
      subtitle: "Mises à jour & Annonces",
      viewAll: "Voir tout",
      items: []
    },
    shop: {
      title: "Boutique",
      subtitle: "Graffiti Art Premium depuis 1990",
      enter: "Entrer dans la boutique"
    },
    contact: {
      title: "Contactez-nous",
      desc: "Retrouvez le travail de Onesiker à son atelier.",
      formIntro: "Vous avez un coup de cœur, un projet ? Laissez-nous vos coordonnées et l'objet de votre demande, nous vous recontacterons dans les meilleurs délais.",
      name: "Nom",
      email: "Email",
      message: "Message",
      send: "Envoyer le message",
      placeholderName: "Jeanne Dupont",
      placeholderEmail: "jeanne@exemple.com",
      placeholderMessage: "Comment pouvons-nous vous aider ?"
    },
    footer: {
      rights: "Tous droits réservés.",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation"
    }
  }
};
