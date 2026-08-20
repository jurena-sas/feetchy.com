import Account from '@/src/views/Account';

export const metadata = {
  title: 'Mon compte | Feetchy',
  description: 'Connectez-vous à votre compte Feetchy pour suivre vos commandes et télécharger vos factures.',
  alternates: {
    canonical: '/account',
    languages: {
      fr: '/account',
      en: '/en/account',
      it: '/it/account',
      de: '/de/account',
    },
  },
};

export default function Page() {
  return <Account />;
}
