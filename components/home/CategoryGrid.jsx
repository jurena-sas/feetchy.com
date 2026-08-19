import Link from 'next/link';

export default function CategoryGrid({ categories = [] }) {
  return (
    <section id="categories" className="section">
      <div className="container">
        <div className="section-heading">
          <h2>Catégories</h2>
          <p>Des pages de catégories dynamiques, propres et indexables.</p>
        </div>

        <div className="card-grid">
          {categories.map((category) => (
            <article key={category.slug} className="card">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <Link href={`/categorie/${category.slug}`} className="text-link">
                Voir la catégorie
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
