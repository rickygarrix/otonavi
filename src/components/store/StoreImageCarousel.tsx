'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type Props = {
  storeId: string;
  storeName: string;
};

type StoreImage = {
  id: string;
  image_url: string;
};

export default function StoreImageCarousel({ storeId, storeName }: Props) {
  const [images, setImages] = useState<StoreImage[]>([]);
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!storeId) return;

    supabase
      .from('store_images')
      .select('id, image_url')
      .eq('store_id', storeId)
      .order('order_num')
      .then(({ data }) => setImages(data ?? []));
  }, [storeId]);

  if (images.length === 0) {
    return <div className="h-20" />;
  } else {
    return (
      <div className="relative">
        {/* カルーセル */}
        <div
          ref={containerRef}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-scroll"
          onScroll={(e) => {
            const el = e.currentTarget;
            setCurrent(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((img) => (
            <div key={img.id} className="relative aspect-[3/4] min-w-full snap-start">
              <Image
                src={img.image_url}
                alt={storeName}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>

        {/* インジケーター */}
        <div className="absolute inset-x-0 bottom-0 flex h-6 items-center justify-center gap-1">
          {images.map((_, i) => {
            const diff = Math.abs(i - current);

            const bg =
              diff === 0
                ? 'bg-white/80'
                : diff === 1
                  ? 'bg-white/60'
                  : diff === 2
                    ? 'bg-white/50'
                    : diff === 3
                      ? 'bg-white/40'
                      : 'bg-white/30';

            const width = diff === 0 ? 'w-2' : 'w-1';

            return (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-400 ease-out ${width} ${bg}`}
                aria-label={`画像 ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
