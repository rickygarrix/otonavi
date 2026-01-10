'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { SearchStore } from '@/types/store';

type Props = {
  store: SearchStore;
  query?: string;
};

export default function StoreCard({ store, query }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (query && query.trim() !== '') {
      router.push(`/stores/${store.id}?${query}`);
    } else {
      router.push(`/stores/${store.id}`);
    }
  };

  const imageUrl =
    store.image_url && store.image_url.trim() !== '' ? store.image_url : '/noshop.svg';

  const locationLabel =
    store.prefecture_label === '東京都' && store.area_label
      ? `東京 ${store.area_label}`
      : (store.prefecture_label ?? '');

  return (
    <button
      onClick={handleClick}
      className="active:bg-light-1 w-full rounded-3xl py-2 text-left transition active:scale-95"
    >
      {/* 画像 */}
      <div className="p-2">
        <div
          className={`relative aspect-square overflow-hidden rounded-2xl ${imageUrl === '/noshop.svg' ? 'shadow-none' : 'shadow-sm'}`}
        >
          <Image
            src={imageUrl}
            alt={store.name}
            fill
            sizes="(max-width: 420px) 50vw, 210px"
            className="object-cover"
          />
        </div>
      </div>

      {/* テキスト */}
      <div className="flex flex-col gap-1 px-4 py-1">
        <p className="line-clamp-1 text-sm leading-[1.5] font-bold">{store.name}</p>

        <div className="text-dark-4 line-clamp-1 text-xs leading-[1.5]">
          {locationLabel}
          {store.type_label && ` ・ ${store.type_label}`}
        </div>
      </div>
    </button>
  );
}
