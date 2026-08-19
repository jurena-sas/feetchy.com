import Home from '@/src/views/Home';
import { defaultLang, HOME_CONTENT_ID } from '@/src/config';
import { fetchHomeData, fetchHomeMetadata } from '@/src/app/route-data';

export async function generateMetadata() {
  return fetchHomeMetadata(defaultLang, HOME_CONTENT_ID);
}

export default async function Page() {
  const homeData = await fetchHomeData(defaultLang, HOME_CONTENT_ID);

  return <Home lang={defaultLang} {...homeData} />;
}
