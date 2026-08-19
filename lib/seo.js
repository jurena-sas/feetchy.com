import { siteConfig } from '@/lib/site';
import { absoluteUrl, stripHtml } from '@/lib/utils';

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website'
}) {
  const finalTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | Catalogue SEO-ready`;

  const finalDescription =
    stripHtml(description) || siteConfig.description;

  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image || siteConfig.defaultOgImage);

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: ogImage }]
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogImage]
    }
  };
}
