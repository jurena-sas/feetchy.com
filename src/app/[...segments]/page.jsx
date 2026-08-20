import Home from '@/src/views/Home';
import Cart from '@/src/views/Cart';
import Checkout from '@/src/views/Checkout';
import Confirm from '@/src/views/Confirm';
import Success from '@/src/views/Success';
import Account from '@/src/views/Account';
import Sitemap from '@/src/views/Sitemap';
import RouteRenderer, { fetchSeoMetaForItem } from '@/src/app/RouteRenderer';
import { allowedLangs, buildLocalizedPath, defaultLang, HOME_CONTENT_ID } from '@/src/config';
import { buildAlternates, buildItemAlternates, fetchFeetchyRoutes, findRouteItem, findRouteItemWithSize, getRouteLabel, getRouteMetadata } from '@/src/app/route-utils';
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

const staticPageMetadataByLang = {
  cart: {
    fr: { title: 'Mon panier | Feetchy', description: 'Consultez et modifiez le contenu de votre panier Feetchy avant de passer commande.' },
    en: { title: 'My cart | Feetchy', description: 'Review and edit your Feetchy cart before checking out.' },
    it: { title: 'Il mio carrello | Feetchy', description: 'Consulta e modifica il contenuto del tuo carrello Feetchy prima di ordinare.' },
    de: { title: 'Mein Warenkorb | Feetchy', description: 'Überprüfen und ändern Sie Ihren Feetchy-Warenkorb vor dem Bezahlen.' },
  },
  checkout: {
    fr: { title: 'Livraison | Feetchy', description: 'Renseignez vos informations de livraison pour finaliser votre commande Feetchy.' },
    en: { title: 'Shipping | Feetchy', description: 'Enter your shipping details to complete your Feetchy order.' },
    it: { title: 'Consegna | Feetchy', description: 'Inserisci i tuoi dati di consegna per completare il tuo ordine Feetchy.' },
    de: { title: 'Versand | Feetchy', description: 'Geben Sie Ihre Lieferdaten ein, um Ihre Feetchy-Bestellung abzuschließen.' },
  },
  confirm: {
    fr: { title: 'Confirmation de commande | Feetchy', description: 'Vérifiez le récapitulatif de votre commande Feetchy avant paiement.' },
    en: { title: 'Order confirmation | Feetchy', description: 'Review your Feetchy order summary before payment.' },
    it: { title: 'Conferma ordine | Feetchy', description: 'Verifica il riepilogo del tuo ordine Feetchy prima del pagamento.' },
    de: { title: 'Bestellbestätigung | Feetchy', description: 'Überprüfen Sie Ihre Feetchy-Bestellübersicht vor der Zahlung.' },
  },
  success: {
    fr: { title: 'Commande confirmée | Feetchy', description: 'Votre commande Feetchy a bien été enregistrée.' },
    en: { title: 'Order confirmed | Feetchy', description: 'Your Feetchy order has been successfully placed.' },
    it: { title: 'Ordine confermato | Feetchy', description: 'Il tuo ordine Feetchy è stato registrato con successo.' },
    de: { title: 'Bestellung bestätigt | Feetchy', description: 'Ihre Feetchy-Bestellung wurde erfolgreich aufgegeben.' },
  },
  account: {
    fr: { title: 'Mon compte | Feetchy', description: 'Connectez-vous à votre compte Feetchy pour suivre vos commandes et télécharger vos factures.' },
    en: { title: 'My account | Feetchy', description: 'Sign in to your Feetchy account to track orders and download invoices.' },
    it: { title: 'Il mio account | Feetchy', description: 'Accedi al tuo account Feetchy per seguire gli ordini e scaricare le fatture.' },
    de: { title: 'Mein Konto | Feetchy', description: 'Melden Sie sich bei Ihrem Feetchy-Konto an, um Bestellungen zu verfolgen und Rechnungen herunterzuladen.' },
  },
};

const staticPageAlternatePaths = (slug) => ({
  fr: `/${slug}`,
  en: `/en/${slug}`,
  it: `/it/${slug}`,
  de: `/de/${slug}`,
});

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
    const homeMeta = await fetchHomeMetadata(lang, HOME_CONTENT_ID);
    const alternates = buildAlternates({ fr: '/', en: '/en', it: '/it', de: '/de' }, lang);
    return alternates ? { ...homeMeta, alternates } : homeMeta;
  }

  if (slug === 'sitemap') {
    const sitemapMeta = sitemapMetadataByLang[lang] || sitemapMetadataByLang[defaultLang];
    const alternates = buildAlternates(staticPageAlternatePaths('sitemap'), lang);
    return alternates ? { ...sitemapMeta, alternates } : sitemapMeta;
  }

  if (staticPages[slug]) {
    const staticMeta =
      staticPageMetadataByLang[slug]?.[lang] ||
      staticPageMetadataByLang[slug]?.[defaultLang] ||
      { title: `Feetchy - ${slug}`, description: 'Feetchy' };
    const alternates = buildAlternates(staticPageAlternatePaths(slug), lang);
    return alternates ? { ...staticMeta, alternates } : staticMeta;
  }

  const items = await fetchFeetchyRoutes();
  const item = findRouteItem(items, lang, slug);

  if (item) {
    const seoMeta = await fetchSeoMetaForItem(item);
    const metadata = getRouteMetadata(item, lang, seoMeta);
    const alternates = buildItemAlternates(item, lang);
    return alternates ? { ...metadata, alternates } : metadata;
  }

  // Size-filtered variant of a category (e.g. "category-slug-75") — reuse
  // the parent category's title/description instead of a generic fallback,
  // and keep it out of the index since it's duplicate content.
  const sizeMatch = findRouteItemWithSize(items, lang, slug);
  if (sizeMatch) {
    const categoryItem = items.find((entry) => entry.id === sizeMatch.id) || null;
    const seoMeta = await fetchSeoMetaForItem(categoryItem);
    const metadata = getRouteMetadata(categoryItem, lang, seoMeta);
    const categoryPath = categoryItem?.urls?.[lang]
      ? buildLocalizedPath(lang, categoryItem.urls[lang])
      : null;

    return {
      ...metadata,
      robots: { index: false, follow: true },
      ...(categoryPath ? { alternates: { canonical: categoryPath } } : {}),
    };
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
