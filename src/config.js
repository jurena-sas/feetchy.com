export const allowedLangs = ['fr', 'en', 'it', 'de', 'es'];
export const defaultLang = 'fr';

// Content id where content_type = page_feetchy and content_statut = home
export const HOME_CONTENT_ID = 228;

export const normalizePath = (p = '') =>
  p.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');

export const buildLocalizedPath = (lang = defaultLang, rawUrl = '') => {
  const path = normalizePath(rawUrl);

  if (!path) return '/';

  if (lang === defaultLang) {
    return `/${path}`;
  }

  if (path.startsWith(`${lang}/`)) {
    return `/${path}`;
  }

  return `/${lang}/${path}`;
};

export const buildHomePath = (lang = defaultLang) =>
  lang === defaultLang ? '/' : `/${lang}`;

export const getLocalizedValue = (obj, lang = defaultLang, fallback = '') => {
  if (!obj || typeof obj !== 'object') return fallback;
  return obj[lang] || obj[defaultLang] || fallback;
};

export const uiTranslations = {
  freeShippingFromQty: {
    fr: 'Livraison offerte dès {qty} paires achetées',
    en: 'Free shipping from {qty} pairs purchased',
    it: 'Spedizione gratuita a partire da {qty} paia acquistate',
    de: 'Kostenloser Versand ab {qty} gekauften Paaren',
    es: 'Envío gratis a partir de {qty} pares comprados',
  },
};