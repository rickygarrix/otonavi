'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
    <Button
      onClick={handleClick}
      priority="secondary"
      label="別の条件で探す"
      leftIcon={Search}
    ></Button>
  );
}
