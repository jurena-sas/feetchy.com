import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product }) {
  return (
    <article className="card product-card">
      <div className="product-meta">{product.category?.name || 'Produit'}</div>
      <h3>{product.name}</h3>
      <p>{product.short_description || product.description}</p>
      <div className="product-bottom">
        <strong>{formatPrice(product.price)}</strong>
        <Link href={`/produit/${product.slug}`} className="text-link">
          Voir le produit
        </Link>
      </div>
    </article>
  );
}
