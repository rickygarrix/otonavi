'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BackToHomeButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = searchParams.toString();

    if (params) {
      router.push(`/?${params}`);
    } else {
      router.push('/');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        border-light-5 from-light-2 to-light-1 text-dark-5
        shadow-dark-1/20
        flex h-12 w-full items-center justify-center gap-2
        rounded-lg border bg-linear-to-t px-4 text-sm
        shadow-xs transition
        active:scale-102 active:shadow-md
      "
    >
      <Search className="h-4 w-4" strokeWidth={1.2} />
      別の条件で探す
    </button>
  );
}