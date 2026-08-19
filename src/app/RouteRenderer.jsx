import Page from '@/src/views/Page';
import Product from '@/src/views/Product';
import Category from '@/src/views/Category';
import Color from '@/src/views/Color';
import PageFeetchy from '@/src/views/PageFeetchy';
import PostFeetchy from '@/src/views/PostFeetchy';
import List from '@/src/views/List';
import BlogList from '@/src/views/BlogList';
import CategorySize from '@/src/views/CategorySize';
import NotFound from '@/src/views/NotFound';
import { findRouteItemWithSize } from '@/src/app/route-utils';
import {
  fetchBlogPostsRaw,
  fetchContentById,
  fetchProductColorList,
  fetchProductDetail,
  fetchProductList,
  fetchProductRangeList,
  fetchProductRangeSizeList,
} from '@/src/app/route-data';

const components = {
  page: Page,
  product: Product,
  category: Category,
  color: Color,
  pagefeetchy: PageFeetchy,
  postfeetchy: PostFeetchy,
  list: List,
  listjs: List,
  bloglist: BlogList,
  bloglistjs: BlogList,
};

const normalizeComponentKey = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/\.jsx?$/i, '')
    .replace(/[-_\s]/g, '')
    .trim();

export const resolveComponentKey = (item) => {
  const jsFile = normalizeComponentKey(item?.js_file);
  const fileName = normalizeComponentKey(item?.file);
  const typeName = normalizeComponentKey(item?.content_type);

  if (components[jsFile]) return jsFile;
  if (components[fileName]) return fileName;
  if (components[typeName]) return typeName;
  return null;
};

// Fetches the SEO-relevant metas for a route item, for generateMetadata()
// — reuses the same content fetch RouteRenderer itself does, which
// Next.js dedupes within the same request.
export const fetchSeoMetaForItem = async (item) => {
  if (!item) return null;

  const key = resolveComponentKey(item);
  const isProduct = key === 'product';

  const content = isProduct
    ? await fetchProductDetail(item.id)
    : await fetchContentById(item.id);

  return {
    seoFeetchy: content?.metas?.content_seo_feetchy || null,
    titleFeetchy: isProduct ? content?.metas?.content_title_feetchy || null : null,
    isProduct,
  };
};

// Fetches whatever server-side data each page type needs so the initial
// HTML already contains real content (SEO), instead of relying on a
// client-side useEffect fetch.
const fetchInitialProps = async (key, id) => {
  switch (key) {
    case 'list':
    case 'listjs': {
      const [items, contentData] = await Promise.all([
        fetchProductList(),
        fetchContentById(id),
      ]);
      return { initialItems: items, initialContentData: contentData };
    }

    case 'category': {
      const [items, contentData] = await Promise.all([
        fetchProductRangeList(id),
        fetchContentById(id),
      ]);
      return { initialItems: items, initialContentData: contentData };
    }

    case 'color': {
      const items = await fetchProductColorList(id);
      return { initialItems: items };
    }

    case 'pagefeetchy':
    case 'postfeetchy':
    case 'page': {
      const contentData = await fetchContentById(id);
      return { initialContentData: contentData };
    }

    case 'product': {
      const product = await fetchProductDetail(id);
      const rangeId = product?.metas?.content_range || product?.range || null;
      const rangeProducts = rangeId ? await fetchProductRangeList(rangeId) : [];
      return { initialProduct: product, initialRangeProducts: rangeProducts };
    }

    case 'bloglist':
    case 'bloglistjs': {
      const rawItems = await fetchBlogPostsRaw();
      return { initialBlogRawItems: rawItems };
    }

    default:
      return {};
  }
};

export default async function RouteRenderer({
  item,
  items = [],
  lang = 'fr',
  slugWithSize = '',
  label = '',
}) {
  const key = item ? resolveComponentKey(item) : null;

  if (key) {
    const Component = components[key];
    const initialProps = await fetchInitialProps(key, item.id);

    return (
      <Component
        item={item}
        id={item.id}
        lang={lang}
        label={label}
        {...initialProps}
      />
    );
  }

  const sizeMatch = findRouteItemWithSize(items, lang, slugWithSize);

  if (!sizeMatch) {
    return <NotFound />;
  }

  const normalizedSize = String(sizeMatch.size).replace(/cm$/i, '');
  const initialItems = await fetchProductRangeSizeList(sizeMatch.id, normalizedSize);

  return (
    <CategorySize
      id={sizeMatch.id}
      size={sizeMatch.size}
      lang={lang}
      label={sizeMatch.label}
      categorySlug={sizeMatch.categorySlug}
      initialItems={initialItems}
    />
  );
}
