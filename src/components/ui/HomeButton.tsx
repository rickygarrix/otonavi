'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

type HomeButtonProps = {
  onHome?: () => void;
};

export default function HomeButton({ onHome }: HomeButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onHome) {
      onHome();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="ホームへ戻る"
      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-md backdrop-blur-sm transition-all duration-200 ease-out active:scale-[1.1]"
    >
      <Image src="/symbol.svg" alt="" width={32} height={32} />
    </button>
  );
}