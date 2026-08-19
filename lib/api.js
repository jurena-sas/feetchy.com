import { mockCategories, mockProducts, mockSite } from '@/lib/mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchJson(path, options = {}) {
  if (!API_BASE) {
    throw new Error('API base URL manquante');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status} on ${path}`);
  }

  return response.json();
}

export async function getSite() {
  try {
    return await fetchJson('/site.php', {
      next: { revalidate: 3600 }
    });
  } catch {
    return mockSite;
  }
}

export async function getCategories() {
  try {
    const data = await fetchJson('/categories.php', {
      next: { revalidate: 3600 }
    });
    return Array.isArray(data) ? data : data?.items || mockCategories;
  } catch {
    return mockCategories;
  }
}

export async function getCategory(slug) {
  try {
    const data = await fetchJson(`/category.php?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 }
    });
    return data?.item || data;
  } catch {
    const category = mockCategories.find((item) => item.slug === slug);
    if (!category) return null;
    return {
      ...category,
      products: mockProducts.filter((item) => item.category?.slug === slug)
    };
  }
}

export async function getProducts() {
  try {
    const data = await fetchJson('/products.php', {
      next: { revalidate: 3600 }
    });
    return Array.isArray(data) ? data : data?.items || mockProducts;
  } catch {
    return mockProducts;
  }
}

export async function getProduct(slug) {
  try {
    const data = await fetchJson(`/product.php?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 }
    });
    return data?.item || data;
  } catch {
    return mockProducts.find((item) => item.slug === slug) || null;
  }
}
