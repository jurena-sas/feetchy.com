import Link from 'next/link';

const navigation = [
  { label: 'Accueil', href: '/' },
  { label: 'Catégories', href: '/#categories' },
  { label: 'Produits', href: '/#products' }
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          Feetchy
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
