import Home from '@/src/views/Home';
import Cart from '@/src/views/Cart';
import Checkout from '@/src/views/Checkout';
import Confirm from '@/src/views/Confirm';
import Success from '@/src/views/Success';
import Account from '@/src/views/Account';
import RouteRenderer, { fetchSeoMetaForItem } from '@/src/app/RouteRenderer';
import { allowedLangs, defaultLang, HOME_CONTENT_ID } from '@/src/config';
import { fetchFeetchyRoutes, findRouteItem, getRouteLabel, getRouteMetadata } from '@/src/app/route-utils';
import { fetchHomeData, fetchHomeMetadata } from '@/src/app/route-data';

const staticPages = {
  cart: Cart,
  checkout: Checkout,
  confirm: Confirm,
  success: Success,
  account: Account,
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

  if (staticPages[slug]) {
    return { title: `Feetchy - ${slug}`, description: 'Feetchy' };
  }

  const items = await fetchFeetchyRoutes();
  const item = findRouteItem(items, lang, slug);
  const seoMeta = await fetchSeoMetaForItem(item);
  return getRouteMetadata(item, lang, seoMeta);
}

export default async function Page({ params }) {
  const { segments = [] } = await params;
  const { lang, slug } = parseSegments(segments);

  if (!slug) {
    const homeData = await fetchHomeData(lang, HOME_CONTENT_ID);
    return <Home lang={lang} {...homeData} />;
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
