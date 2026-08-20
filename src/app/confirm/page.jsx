import Confirm from '@/src/views/Confirm';

export const metadata = {
  title: 'Confirmation de commande | Feetchy',
  description: 'Vérifiez le récapitulatif de votre commande Feetchy avant paiement.',
  alternates: {
    canonical: '/confirm',
    languages: {
      fr: '/confirm',
      en: '/en/confirm',
      it: '/it/confirm',
      de: '/de/confirm',
      es: '/es/confirm',
    },
  },
};

export default function Page() {
  return <Confirm />;
}
