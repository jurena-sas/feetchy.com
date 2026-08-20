// Server-side data fetching for route content, so pages ship with real
// HTML for SEO/crawlers instead of an empty shell that only fills in
// client-side. These run in Server Components (no CORS concerns) and
// hit laceter.com directly.

const API_BASE = 'https://www.laceter.com/api';

const safeFetchJson = async (url) => {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('route-data fetch error:', url, error.message);
    return null;
  }
};

export const fetchProductList = async () => {
  const data = await safeFetchJson(`${API_BASE}/list.product.json`);
  return Array.isArray(data?.items) ? data.items : [];
};

export const fetchContentById = async (id) => {
  if (!id) return null;
  const data = await safeFetchJson(`${API_BASE}/content.${id}.json`);
  return data?.item || data || null;
};

export const fetchProductRangeList = async (rangeId) => {
  if (!rangeId) return [];
  const data = await safeFetchJson(`${API_BASE}/list.product.range.${rangeId}.json`);
  return Array.isArray(data?.items) ? data.items : [];
};

export const fetchProductColorList = async (colorId) => {
  if (!colorId) return [];
  const data = await safeFetchJson(`${API_BASE}/list.product.color.${colorId}.json`);
  return Array.isArray(data?.items) ? data.items : [];
};

export const fetchProductRangeSizeList = async (rangeId, size) => {
  if (!rangeId || !size) return [];
  const data = await safeFetchJson(
    `${API_BASE}/list.product.range.size.${rangeId}.${size}.json`
  );
  return Array.isArray(data?.items) ? data.items : [];
};

export const fetchProductDetail = async (productId) => {
  if (!productId) return null;
  const data = await safeFetchJson(
    `https://www.laceter.com/myusenet-new/api/content.php?id=${productId}`
  );
  return data?.item || data || null;
};

export const fetchBlogPostsRaw = async () => {
  const data = await safeFetchJson(`${API_BASE}/list.post_feetchy.json`);
  return Array.isArray(data?.items) ? data.items : [];
};

const cleanCmsUrl = (url) => {
  if (!url) return '/';
  return `/${url.replace(/\.html$/i, '').replace(/^\/+/, '')}`;
};

export const fetchHomeSlides = async (homeContent) => {
  const rawSlides = homeContent?.metas?.content_slider_feetchy || [];

  return Promise.all(
    rawSlides.map(async (slide) => {
      const langs = ['fr', 'en', 'it', 'de', 'es'];
      const targetId = langs
        .map((l) => slide?.[l]?.btn_1_target)
        .find(Boolean);

      if (!targetId) {
        return { ...slide, buttonUrls: {} };
      }

      const target = await fetchContentById(targetId);
      const metas = target?.metas || {};

      const buttonUrls = {};
      langs.forEach((l) => {
        buttonUrls[l] = cleanCmsUrl(
          metas.content_url_feetchy?.[l] || metas.content_url?.[l]
        );
      });

      return { ...slide, buttonUrls };
    })
  );
};

export const fetchHomeMetadata = async (lang, HOME_CONTENT_ID) => {
  const homeContent = await fetchContentById(HOME_CONTENT_ID);
  const seoFeetchy = homeContent?.metas?.content_seo_feetchy;

  const title = seoFeetchy?.title?.[lang]?.trim() || 'Feetchy';
  const description = seoFeetchy?.description?.[lang]?.trim() || 'Feetchy';

  return { title, description };
};

export const fetchHomeData = async (lang, HOME_CONTENT_ID) => {
  const [homeContent, productList, blogPostsRaw] = await Promise.all([
    fetchContentById(HOME_CONTENT_ID),
    fetchProductList(),
    fetchBlogPostsRaw(),
  ]);

  const gallery = homeContent?.metas?.content_gallery_feetchy || [];
  const bannerItems = gallery
    .filter((img) => img?.file)
    .slice(0, 4)
    .map((img) => ({ image: img.file, label: '', url: '#' }));

  const [slides, newProducts] = await Promise.all([
    fetchHomeSlides(homeContent),
    Promise.resolve(pickRandomProducts(productList, lang, 6)),
  ]);

  const seoHtml = homeContent?.content?.content_html?.[lang]
    || homeContent?.content?.content_html?.fr
    || '';

  return {
    initialSlides: slides,
    initialNewProductItems: newProducts,
    initialBannerItems: bannerItems,
    initialBlogRawItems: blogPostsRaw,
    initialSeoHtml: seoHtml,
  };
};

const SITEMAP_STATUT_ALLOWED = ['publish', 'home'];

const mapSitemapItem = (item, lang) => {
  const title =
    item?.content?.content_title?.[lang]?.trim() ||
    item?.content?.content_title?.fr?.trim() ||
    '';

  const url =
    item?.metas?.content_url_feetchy?.[lang] ||
    item?.metas?.content_url_feetchy?.fr ||
    '';

  return { id: item.id, title, url };
};

const sortByTitle = (items, lang) =>
  [...items].sort((a, b) => a.title.localeCompare(b.title, lang));

export const fetchSitemapData = async (lang) => {
  const [pages, categories, colors, products, posts] = await Promise.all([
    safeFetchJson(`${API_BASE}/list.page_feetchy.json`),
    safeFetchJson(`${API_BASE}/list.category.json`),
    safeFetchJson(`${API_BASE}/list.color.json`),
    safeFetchJson(`${API_BASE}/list.product.json`),
    safeFetchJson(`${API_BASE}/list.post_feetchy.json`),
  ]);

  const isVisible = (item) =>
    SITEMAP_STATUT_ALLOWED.includes(item?.content?.content_statut);

  const mapAndFilter = (items) =>
    (items || [])
      .filter(isVisible)
      .map((item) => mapSitemapItem(item, lang))
      .filter((item) => item.title && item.url);

  const categoryItems = mapAndFilter(categories?.items);

  const categoryTitleById = new Map(
    (categories?.items || []).map((item) => [
      String(item.id),
      item?.content?.content_title?.[lang]?.trim() ||
        item?.content?.content_title?.fr?.trim() ||
        '',
    ])
  );

  const productGroups = new Map();
  (products?.items || [])
    .filter(isVisible)
    .forEach((item) => {
      const mapped = mapSitemapItem(item, lang);
      if (!mapped.title || !mapped.url) return;

      const rangeId = String(item?.metas?.content_range || '0');
      const groupLabel = categoryTitleById.get(rangeId);
      if (!groupLabel) return;

      if (!productGroups.has(groupLabel)) {
        productGroups.set(groupLabel, []);
      }
      productGroups.get(groupLabel).push(mapped);
    });

  const productGroupList = Array.from(productGroups.entries())
    .map(([label, items]) => ({ label, items: sortByTitle(items, lang) }))
    .sort((a, b) => a.label.localeCompare(b.label, lang));

  return {
    pages: sortByTitle(mapAndFilter(pages?.items), lang),
    categories: sortByTitle(categoryItems, lang),
    colors: sortByTitle(mapAndFilter(colors?.items), lang),
    productGroups: productGroupList,
    posts: sortByTitle(mapAndFilter(posts?.items), lang),
  };
};

export const pickRandomProducts = (items, lang, count = 6) => {
  const eligible = items.filter((product) => {
    const isPublished = product?.content?.content_statut === 'publish';

    const url =
      product?.metas?.content_url_feetchy?.[lang] ||
      product?.metas?.content_url_feetchy?.fr;

    const hasImage = Boolean(
      (product?.metas?.content_gallery_feetchy ||
        product?.metas?.content_gallery ||
        [])[0]?.file
    );

    return isPublished && Boolean(url) && hasImage;
  });

  const shuffled = [...eligible];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};
