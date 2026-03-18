import { formatPrice } from '@/lib/utils';

export default function ProductDetails({ product }) {
  return (
    <section className="section">
      <div className="container product-page-grid">
        <div className="product-visual">
          <div className="visual-placeholder">Image produit</div>
        </div>

        <div>
          <p className="eyebrow">{product.category?.name || 'Produit'}</p>
          <h1>{product.name}</h1>
          <p className="lead">{product.short_description || product.description}</p>
          <p className="price">{formatPrice(product.price)}</p>
          <div className="prose">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
