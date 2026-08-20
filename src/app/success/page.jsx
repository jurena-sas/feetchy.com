import { Suspense } from 'react';
import Success from '@/src/views/Success';

export const metadata = {
  title: 'Commande confirmée | Feetchy',
  description: 'Votre commande Feetchy a bien été enregistrée.',
  alternates: {
    canonical: '/success',
    languages: {
      fr: '/success',
      en: '/en/success',
      it: '/it/success',
      de: '/de/success',
    },
  },
};

export default function Page() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
