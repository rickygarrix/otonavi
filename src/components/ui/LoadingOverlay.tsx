'use client';

import Image from 'next/image';

const TEXT = '読み込み中';

export default function LoadingOverlay() {
  return (
    <div className="bg-light-1/90 fixed inset-0 z-[999] flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-10">
        <div className="relative h-30 w-30">
          <Image
            src="/symbol-loading.svg"
            alt="オトナビ"
            fill
            priority
            className="animate-spin-slow motion-reduce:animate-none"
          />
        </div>

        <div className="h-10">
          <p className="text-dark-3 text-sm tracking-widest">
            {Array.from(TEXT).map((ch, i) => (
              <span
                key={i}
                className="animate-wave inline-block motion-reduce:animate-none"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {ch}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
