'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { HomeStoreLite } from '@/types/store';

const STATUS_COLOR_MAP: Record<
  NonNullable<HomeStoreLite['status_key']>,
  string
> = {
  normal: 'bg-green-4',
  temporary: 'bg-yellow-4',
  closed: 'bg-red-4',
  irregular: 'bg-purple-4',
};

type Props = {
  store: HomeStoreLite;
};

export default function HomeStoreCard({ store }: Props) {

  const imageUrl =
    store.gallery_url && store.gallery_url.trim() !== ''
      ? store.gallery_url
      : '/noshop.svg';

  const isTokyo = store.prefecture_label === '東京都';

  const locationLabel = isTokyo
    ? store.city_label
      ? `東京 ${store.city_label}`
      : '東京'
    : store.prefecture_label ?? '';

  const statusColor =
    store.status_key ? STATUS_COLOR_MAP[store.status_key] : null;

  return (
    <Link
      href={`/stores/${store.slug}`}
      className="flex w-full flex-col items-center gap-2 p-2 text-center transition active:scale-95"
    >

      <div className="relative aspect-square w-full overflow-visible rounded-2xl border border-white/10 backdrop-blur-xl">
        <Image
          src={imageUrl}
          alt={store.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover rounded-2xl"
          priority
        />

        {statusColor && (
          <span
            className={`absolute left-0 bottom-0 h-1 w-1 rounded-full ${statusColor}`}
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-1 px-2 py-1">
        <div className="flex h-7 items-center justify-center">
          <p className="line-clamp-2 text-xs leading-[1.2]">{store.name}</p>
        </div>

        {locationLabel && (
          <p className="line-clamp-1 text-[10px] text-light-5">
            {locationLabel}
          </p>
        )}
      </div>
    </Link>
  );
}