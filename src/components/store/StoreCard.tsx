'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { SearchStore } from '@/types/store';

const STATUS_COLOR_MAP: Record<
  NonNullable<SearchStore['status_key']>,
  string
> = {
  normal: 'bg-green-3',
  temporary: 'bg-yellow-3',
  closed: 'bg-red-3',
  irregular: 'bg-purple-3',
};

type Props = {
  store: SearchStore;
  query?: string;
};

export default function StoreCard({ store, query }: Props) {
  const router = useRouter();

  const handleClick = () => {
    const base = `/stores/${store.slug}`;
    router.push(query && query.trim() !== '' ? `${base}?${query}` : base);
  };

  const imageUrl =
    typeof store.gallery_url === 'string' && store.gallery_url.trim() !== ''
      ? store.gallery_url
      : '/noshop.svg';

  const locationLabel =
    store.prefecture_label === '東京都' && store.city_label
      ? `東京 ${store.city_label}`
      : store.prefecture_label ?? '';

  const statusColor =
    store.status_key ? STATUS_COLOR_MAP[store.status_key] : null;

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-3xl py-2 text-left transition active:scale-95 active:bg-light-1"
    >
      <div className="p-2">
        <div
          className={`relative aspect-square overflow-visible rounded-2xl ${imageUrl === '/noshop.svg' ? 'shadow-none' : 'shadow-sm'
            }`}
        >
          <Image
            src={imageUrl}
            alt={store.name}
            fill
            loading="lazy"
            sizes="(max-width: 420px) 50vw, 210px"
            className="object-cover rounded-2xl"
          />

          {statusColor && (
            <span
              className={`absolute left-0 bottom-0 h-1 w-1 rounded-full ${statusColor}`}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 px-4 py-1">
        <p className="line-clamp-1 text-sm font-bold leading-[1.5]">
          {store.name}
        </p>

        <div className="line-clamp-1 text-xs leading-[1.5] text-dark-4">
          {locationLabel}
          {store.type_label && ` ・ ${store.type_label}`}
        </div>
      </div>
    </button>
  );
}