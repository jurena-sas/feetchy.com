import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow">
        <h1>Page introuvable</h1>
        <p>La page demandée n'existe pas ou n'est plus disponible.</p>
        <Link href="/" className="button primary">Retour à l'accueil</Link>
      </div>
    </section>
  );
}
