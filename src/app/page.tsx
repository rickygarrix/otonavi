import { Suspense } from 'react';
import HomePage from './home/HomePage';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <HomePage />
    </Suspense>

  );
}