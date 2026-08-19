import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import JsonLd from '@/components/seo/JsonLd';
import { getCategories, getProducts, getSite } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Accueil',
  description:
    'Accueil du catalogue Feetchy construit avec Next.js, composants séparés et pages SEO server-rendered.',
  path: '/'
});

export default async function HomePage() {
  const [site, categories, products] = await Promise.all([
    getSite(),
    getCategories(),
    getProducts()
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Feetchy',
    url: absoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/')}recherche?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero site={site} />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} />
    </>
  );
}
