import { getCategories, getProducts } from '@/lib/api';
import { siteConfig } from '@/lib/site';

export default async function sitemap() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const base = siteConfig.siteUrl;

  const staticRoutes = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      priority: 1
    }
  ];

  const categoryRoutes = categories.map((category) => ({
    url: `${base}/categorie/${category.slug}`,
    lastModified: new Date(),
    priority: 0.8
  }));

  const productRoutes = products.map((product) => ({
    url: `${base}/produit/${product.slug}`,
    lastModified: new Date(),
    priority: 0.7
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
