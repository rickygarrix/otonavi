'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Props = {
  onHome?: () => void; // ← optional にする
  size?: number;
  iconSize?: number;
  className?: string;
};

export default function HomeButton({ onHome, size = 56, iconSize = 32, className = '' }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (onHome) {
      onHome();
    } else {
      router.push('/'); // ★ デフォルトでホームへ
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="ホームへ戻る"
      className={`flex items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-md backdrop-blur-sm transition-all duration-200 ease-out active:scale-[1.1] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src="/symbol.svg" alt="" width={iconSize} height={iconSize} />
    </button>
  );
}
