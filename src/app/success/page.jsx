import { Suspense } from 'react';
import Success from '@/src/views/Success';

export default function Page() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
