import Cart from '@/src/views/Cart';

export const metadata = {
  title: 'Mon panier | Feetchy',
  description: 'Consultez et modifiez le contenu de votre panier Feetchy avant de passer commande.',
  alternates: {
    canonical: '/cart',
    languages: {
      fr: '/cart',
      en: '/en/cart',
      it: '/it/cart',
      de: '/de/cart',
      es: '/es/cart',
    },
  },
};

export default function Page() {
  return <Cart />;
}
