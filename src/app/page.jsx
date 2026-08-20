import Home from '@/src/views/Home';
import { defaultLang, HOME_CONTENT_ID } from '@/src/config';
import { buildAlternates } from '@/src/app/route-utils';
import { fetchHomeData, fetchHomeMetadata } from '@/src/app/route-data';

export async function generateMetadata() {
  const homeMeta = await fetchHomeMetadata(defaultLang, HOME_CONTENT_ID);
  const alternates = buildAlternates({ fr: '/', en: '/en', it: '/it', de: '/de', es: '/es' }, defaultLang);
  return alternates ? { ...homeMeta, alternates } : homeMeta;
}

export default async function Page() {
  const homeData = await fetchHomeData(defaultLang, HOME_CONTENT_ID);

  return <Home lang={defaultLang} {...homeData} />;
}
