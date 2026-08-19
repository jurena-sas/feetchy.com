export function absoluteUrl(path = '') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.feetchy.com';
  if (!path) return base;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function formatPrice(price, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(Number(price || 0));
}

export function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
