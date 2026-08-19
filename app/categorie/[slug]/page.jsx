import ProductCard from '@/components/product/ProductCard';
import JsonLd from '@/components/seo/JsonLd';
import { getCategories, getCategory } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return buildMetadata({
      title: 'Catégorie introuvable',
      description: 'La catégorie demandée est introuvable.',
      path: `/categorie/${slug}`
    });
  }

  return buildMetadata({
    title: category.seo?.title || category.name,
    description: category.seo?.description || category.description,
    path: `/categorie/${slug}`,
    type: 'website'
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const products = category.products || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: absoluteUrl(`/categorie/${slug}`)
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">Catégorie</p>
          <h1>{category.name}</h1>
          <p className="lead">{category.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            {products.length ? (
              products.map((product) => <ProductCard key={product.slug} product={product} />)
            ) : (
              <p>Aucun produit trouvé pour cette catégorie.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
