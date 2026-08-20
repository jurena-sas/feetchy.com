import Checkout from '@/src/views/Checkout';

export const metadata = {
  title: 'Livraison | Feetchy',
  description: 'Renseignez vos informations de livraison pour finaliser votre commande Feetchy.',
  alternates: {
    canonical: '/checkout',
    languages: {
      fr: '/checkout',
      en: '/en/checkout',
      it: '/it/checkout',
      de: '/de/checkout',
      es: '/es/checkout',
    },
  },
};

export default function Page() {
  return <Checkout />;
}
