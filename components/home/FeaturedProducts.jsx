import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProducts({ products = [] }) {
  return (
    <section id="products" className="section alt-section">
      <div className="container">
        <div className="section-heading">
          <h2>Produits mis en avant</h2>
          <p>Chaque produit peut avoir sa propre page SEO et ses données structurées.</p>
        </div>

        <div className="card-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
