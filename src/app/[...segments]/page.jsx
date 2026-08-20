import Home from '@/src/views/Home';
import Cart from '@/src/views/Cart';
import Checkout from '@/src/views/Checkout';
import Confirm from '@/src/views/Confirm';
import Success from '@/src/views/Success';
import Account from '@/src/views/Account';
import Sitemap from '@/src/views/Sitemap';
import RouteRenderer, { fetchSeoMetaForItem } from '@/src/app/RouteRenderer';
import { allowedLangs, defaultLang, HOME_CONTENT_ID } from '@/src/config';
import { fetchFeetchyRoutes, findRouteItem, findRouteItemWithSize, getRouteLabel, getRouteMetadata } from '@/src/app/route-utils';
import { fetchHomeData, fetchHomeMetadata, fetchSitemapData } from '@/src/app/route-data';

const staticPages = {
  cart: Cart,
  checkout: Checkout,
  confirm: Confirm,
  success: Success,
  account: Account,
};

const sitemapMetadataByLang = {
  fr: {
    title: 'Plan du site | Feetchy',
    description: 'Retrouvez toutes les pages, catégories, couleurs et produits Feetchy sur notre plan du site.',
  },
  en: {
    title: 'Sitemap | Feetchy',
    description: 'Browse all Feetchy pages, categories, colors and products on our sitemap.',
  },
  it: {
    title: 'Mappa del sito | Feetchy',
    description: 'Trova tutte le pagine, categorie, colori e prodotti Feetchy nella nostra mappa del sito.',
  },
  de: {
    title: 'Seitenplan | Feetchy',
    description: 'Finden Sie alle Feetchy-Seiten, Kategorien, Farben und Produkte auf unserem Seitenplan.',
  },
};

const parseSegments = (segments = []) => {
  const first = segments[0];
  const hasLang = allowedLangs.includes(first);
  const lang = hasLang ? first : defaultLang;
  const pageSegments = hasLang ? segments.slice(1) : segments;
  const slug = pageSegments.join('/');

  return { lang, slug };
};

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  const { lang, slug } = parseSegments(segments);

  if (!slug) {
    return fetchHomeMetadata(lang, HOME_CONTENT_ID);
  }

  if (slug === 'sitemap') {
    return sitemapMetadataByLang[lang] || sitemapMetadataByLang[defaultLang];
  }

  if (staticPages[slug]) {
    return { title: `Feetchy - ${slug}`, description: 'Feetchy' };
  }

  const items = await fetchFeetchyRoutes();
  const item = findRouteItem(items, lang, slug);

  if (item) {
    const seoMeta = await fetchSeoMetaForItem(item);
    return getRouteMetadata(item, lang, seoMeta);
  }

  // Size-filtered variant of a category (e.g. "category-slug-75") — reuse
  // the parent category's title/description instead of a generic fallback,
  // and keep it out of the index since it's duplicate content.
  const sizeMatch = findRouteItemWithSize(items, lang, slug);
  if (sizeMatch) {
    const categoryItem = items.find((entry) => entry.id === sizeMatch.id) || null;
    const seoMeta = await fetchSeoMetaForItem(categoryItem);
    const metadata = getRouteMetadata(categoryItem, lang, seoMeta);
    return { ...metadata, robots: { index: false, follow: true } };
  }

  return getRouteMetadata(item, lang, null);
}

export default async function Page({ params }) {
  const { segments = [] } = await params;
  const { lang, slug } = parseSegments(segments);

  if (!slug) {
    const homeData = await fetchHomeData(lang, HOME_CONTENT_ID);
    return <Home lang={lang} {...homeData} />;
  }

  if (slug === 'sitemap') {
    const sitemapData = await fetchSitemapData(lang);
    return <Sitemap lang={lang} {...sitemapData} />;
  }

  const StaticPage = staticPages[slug];
  if (StaticPage) {
    return <StaticPage lang={lang} />;
  }

  const items = await fetchFeetchyRoutes();
  const item = findRouteItem(items, lang, slug);

  return (
    <RouteRenderer
      item={item || null}
      items={items}
      lang={lang}
      slugWithSize={slug}
      label={getRouteLabel(item, lang)}
    />
  );
}
