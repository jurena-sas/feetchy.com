export const mockSite = {
  heroTitle: 'Catalogue e-commerce SEO-ready',
  heroText:
    'Base Next.js pensée comme un projet d\'entreprise, connectée à une API externe et structurée pour le SEO.',
  heroCtaLabel: 'Voir les produits',
  heroCtaHref: '/categorie/accessoires'
};

export const mockCategories = [
  {
    id: 1,
    name: 'Accessoires',
    slug: 'accessoires',
    description: 'Sélection d\'accessoires premium pour la maison et le bureau.',
    image: '/images/category-accessoires.svg'
  },
  {
    id: 2,
    name: 'Papeterie',
    slug: 'papeterie',
    description: 'Papeterie design et produits du quotidien.',
    image: '/images/category-papeterie.svg'
  }
];

export const mockProducts = [
  {
    id: 101,
    name: 'Carnet Signature',
    slug: 'carnet-signature',
    short_description: 'Carnet relié premium pour bureau et organisation.',
    description:
      'Un carnet au format idéal pour les prises de notes, avec une couverture élégante et une fabrication soignée.',
    price: 24.9,
    image: '/images/product-carnet.svg',
    images: ['/images/product-carnet.svg'],
    category: { name: 'Papeterie', slug: 'papeterie' },
    seo: {
      title: 'Carnet Signature',
      description: 'Carnet premium élégant, pensé pour un usage quotidien.'
    }
  },
  {
    id: 102,
    name: 'Plateau Atelier',
    slug: 'plateau-atelier',
    short_description: 'Plateau décoratif minimaliste.',
    description:
      'Un plateau utile et décoratif, facile à intégrer dans un intérieur moderne.',
    price: 39.9,
    image: '/images/product-plateau.svg',
    images: ['/images/product-plateau.svg'],
    category: { name: 'Accessoires', slug: 'accessoires' },
    seo: {
      title: 'Plateau Atelier',
      description: 'Plateau décoratif premium au design épuré.'
    }
  }
];
