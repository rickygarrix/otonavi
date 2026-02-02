'use client';

import Image from 'next/image';
import type { HomeStore } from '@/types/store';

type Props = {
  store: HomeStore;
};

const STATUS_BADGE_MAP: Record<
  NonNullable<HomeStore['status_key']>,
  { bg: string; text: string; label: string }
> = {
  normal: {
    bg: 'bg-green-700',
    text: 'text-green-100',
    label: '通常営業',
  },
  temporary: {
    bg: 'bg-yellow-600',
    text: 'text-yellow-50',
    label: '一時休業',
  },
  closed: {
    bg: 'bg-red-800',
    text: 'text-rose-100',
    label: '閉店',
  },
  irregular: {
    bg: 'bg-purple-800',
    text: 'text-violet-100',
    label: '不定期営業',
  },
};

export default function StoreBasicInfo({ store }: Props) {
  const status = store.status_key
    ? STATUS_BADGE_MAP[store.status_key]
    : null;

  return (
    <div
      className={`flex flex-col gap-4 p-4 text-center ${store.id === 'default' ? 'mt-20' : 'mt-8'
        }`}
    >
      {/* ===== ステータス + ロケーション ===== */}
      <div className="flex flex-wrap items-center justify-center text-xs text-dark-2">
        {status && (
          <div className="pr-2 inline-flex flex-col justify-center items-center">
            <div
              className={`px-2 py-1 rounded-[99px] inline-flex justify-center items-center ${status.bg}`}
            >
              <span className={`${status.text} text-xs leading-3`}>
                {status.label}
              </span>
            </div>
          </div>
        )}

        <span>{store.prefecture_label}</span>
        <span>{store.city_label}</span>
        <span>・</span>
        <span>{store.type_label}</span>
      </div>

      {/* ===== 店舗名 ===== */}
      <div className="flex flex-col gap-2 font-bold">
        <h1 className="text-2xl leading-[1.5]">{store.name}</h1>

        {store.kana && (
          <p className="text-dark-3 text-[10px] leading-[1.5] tracking-widest">
            {store.kana}
          </p>
        )}
      </div>

      {/* ===== 説明文 ===== */}
      {store.description && (
        <p className="text-dark-2 text-xs whitespace-pre-line">
          {store.description}
        </p>
      )}

      {/* ===== シェア ===== */}
      <div className="flex items-center justify-center gap-2 py-2">
        {store.official_site_url && (
          <ShareButton href={store.official_site_url} image="/web@2x.png" alt="公式サイト" />
        )}
        {store.instagram_url && (
          <ShareButton href={store.instagram_url} image="/instagram@2x.png" alt="Instagram" />
        )}
        {store.x_url && (
          <ShareButton href={store.x_url} image="/x@2x.png" alt="X" />
        )}
        {store.facebook_url && (
          <ShareButton href={store.facebook_url} image="/facebook@2x.png" alt="Facebook" />
        )}
        {store.tiktok_url && (
          <ShareButton href={store.tiktok_url} image="/tiktok@2x.png" alt="TikTok" />
        )}
      </div>
    </div>
  );
}

function ShareButton({
  href,
  image,
  alt,
}: {
  href: string;
  image: string;
  alt: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="relative h-14 w-14">
      <Image src={image} alt={alt} fill className="object-contain" />
    </a>
  );
}