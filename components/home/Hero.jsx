import Link from 'next/link';

export default function Hero({ site }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Next.js + React + SEO</span>
          <h1>{site?.heroTitle || 'Catalogue e-commerce entreprise'}</h1>
          <p>{site?.heroText}</p>
          <div className="hero-actions">
            <Link href={site?.heroCtaHref || '/#products'} className="button primary">
              {site?.heroCtaLabel || 'Découvrir'}
            </Link>
            <Link href="/#categories" className="button secondary">
              Voir les catégories
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <strong>Projet structuré</strong>
          <ul>
            <li>App Router</li>
            <li>Pages produits dynamiques</li>
            <li>SEO server-rendered</li>
            <li>Connexion API PHP</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
