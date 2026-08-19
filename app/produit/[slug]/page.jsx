import ProductDetails from '@/components/product/ProductDetails';
import JsonLd from '@/components/seo/JsonLd';
import { getProduct, getProducts } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl, stripHtml } from '@/lib/utils';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return buildMetadata({
      title: 'Produit introuvable',
      description: 'Le produit demandé est introuvable.',
      path: `/produit/${slug}`
    });
  }

  return buildMetadata({
    title: product.seo?.title || product.name,
    description:
      product.seo?.description ||
      product.short_description ||
      stripHtml(product.description),
    path: `/produit/${slug}`,
    image: product.image,
    type: 'product'
  });
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.short_description || product.description || ''),
    image: product.images?.length ? product.images : product.image ? [product.image] : [],
    sku: String(product.id || product.slug),
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: String(product.price || 0),
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/produit/${slug}`)
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetails product={product} />
    </>
  );
}
