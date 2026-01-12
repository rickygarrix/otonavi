import Image from 'next/image';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-light-1">
      {/* スケルトン風の背景 */}
      <div className="absolute inset-0 animate-pulse-soft bg-gradient-to-b from-white via-light-1 to-white opacity-80" />

      {/* 中央ロゴ */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative h-16 w-16">
          <Image
            src="/symbol.svg"
            alt="オトナビ"
            fill
            priority
            className="animate-spin-slow object-contain"
          />
        </div>
        <p className="text-xs tracking-widest text-dark-3">Loading...</p>
      </div>
    </div>
  );
}