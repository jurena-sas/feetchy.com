import { allowedLangs, buildLocalizedPath, defaultLang, normalizePath } from '@/src/config';

export const fetchFeetchyRoutes = async () => {
  try {
    const response = await fetch('https://www.laceter.com/api/urls_feetchy.json', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.error('Erreur chargement routes Next:', error);
    return [];
  }
};

export const findRouteItem = (items, lang = defaultLang, slug = '') => {
  const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;
  const normalizedSlug = normalizePath(slug);

  return items.find((item) => {
    const rawUrl = item?.urls?.[currentLang] || item?.urls?.[defaultLang];
    if (!rawUrl) return false;

    let normalizedUrl = normalizePath(rawUrl);
    if (normalizedUrl.startsWith(`${currentLang}/`)) {
      normalizedUrl = normalizedUrl.slice(currentLang.length + 1);
    }

    return normalizedUrl === normalizedSlug;
  });
};

// Matches URLs like "category-slug-120" (base category slug + trailing
// size) that don't exist as their own route item.
export const findRouteItemWithSize = (items, lang = defaultLang, slug = '') => {
  const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;
  const normalizedSlug = normalizePath(slug);

  for (const entry of items) {
    const rawBase =
      entry?.content_url_feetchy?.[currentLang] ||
      entry?.content_url_feetchy?.[defaultLang] ||
      entry?.urls?.[currentLang] ||
      entry?.urls?.[defaultLang];

    if (!rawBase) continue;

    const cleanBase = normalizePath(rawBase);

    if (normalizedSlug === cleanBase || !normalizedSlug.startsWith(`${cleanBase}-`)) {
      continue;
    }

    const sizePart = normalizedSlug.slice(cleanBase.length + 1);
    if (!sizePart) continue;

    return {
      id: entry.id,
      label: entry?.label?.[currentLang] || entry?.label?.[defaultLang] || '',
      categorySlug: cleanBase,
      size: sizePart,
    };
  }

  return null;
};

export const getRouteLabel = (item, lang = defaultLang) =>
  item?.label?.[lang] || item?.label?.[defaultLang] || '';

// Builds the `alternates.canonical` / `alternates.languages` (hreflang) pair
// from a { lang: path } map, restricted to the languages this site actually
// serves (allowedLangs). Paths are relative — resolved against metadataBase.
export const buildAlternates = (pathsByLang = {}, currentLang = defaultLang) => {
  const languages = {};

  allowedLangs.forEach((l) => {
    if (pathsByLang[l]) {
      languages[l] = pathsByLang[l];
    }
  });

  if (Object.keys(languages).length === 0) return null;

  return {
    canonical: languages[currentLang] || pathsByLang[currentLang] || undefined,
    languages,
  };
};

// Same as buildAlternates, but derived from a CMS route item's per-lang
// `urls` map (as returned by urls_feetchy.json / fetchFeetchyRoutes()).
export const buildItemAlternates = (item, currentLang = defaultLang) => {
  if (!item?.urls) return null;

  const pathsByLang = {};
  allowedLangs.forEach((l) => {
    const rawUrl = item.urls[l];
    if (rawUrl) {
      pathsByLang[l] = buildLocalizedPath(l, rawUrl);
    }
  });

  return buildAlternates(pathsByLang, currentLang);
};

// seoMeta = { seoFeetchy, titleFeetchy, isProduct } from fetchSeoMetaForItem().
// content_seo_feetchy only wins when actually filled in for that language —
// an empty string falls through to the rest of the chain. For products,
// the next fallback (before the generic ones) is content_title_feetchy + ", Feetchy".
export const getRouteMetadata = (item, lang = defaultLang, seoMeta = null) => {
  const seoTitle = seoMeta?.seoFeetchy?.title?.[lang]?.trim();
  const seoDescription = seoMeta?.seoFeetchy?.description?.[lang]?.trim();

  const productTitle = seoMeta?.isProduct
    ? seoMeta?.titleFeetchy?.[lang]?.trim() || seoMeta?.titleFeetchy?.[defaultLang]?.trim()
    : '';

  const title =
    seoTitle ||
    (productTitle && `${productTitle}, Feetchy`) ||
    item?.seo?.title?.[lang] ||
    item?.metas?.seo_title?.[lang] ||
    item?.content?.content_title?.[lang] ||
    item?.label?.[lang] ||
    item?.label?.[defaultLang] ||
    'Feetchy';

  const description =
    seoDescription ||
    item?.seo?.description?.[lang] ||
    item?.metas?.seo_description?.[lang] ||
    item?.content?.content_description?.[lang] ||
    '';

  return {
    title,
    description,
  };
};
