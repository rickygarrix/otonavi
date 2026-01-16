'use client';

import type { HomeStore } from '@/types/store';

/**
 * Google Maps Embed
 * ルール:
 * - 表示は常に google_place_id のみを使用
 * - URL / 緯度経度 / 店舗名検索は一切使わない
 */
function GoogleMapEmbed({ store }: { store: HomeStore }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY が設定されていません');
    return null;
  }

  if (!store.google_place_id) {
    // Place ID が無い店舗は地図を出さない
    return null;
  }

  const q = `place_id:${store.google_place_id}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    q
  )}`;

  return (
    <div className="my-2 overflow-hidden rounded-lg shadow-sm">
      <iframe
        src={embedUrl}
        className="h-112 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        title="Google Map"
      />
    </div>
  );
}

type Props = {
  store: HomeStore;
};

/**
 * 店舗アクセス情報 + Google Map
 */
export default function StoreAccess({ store }: Props) {
  // 地図も住所もアクセスも何も無ければ非表示
  if (!store.access && !store.address && !store.google_place_id) {
    return null;
  }

  return (
    <section className="text-dark-4 flex flex-col gap-4 p-4 text-sm">
      <h2 className="text-dark-5 py-0.5 text-lg font-bold tracking-widest">
        アクセス
      </h2>

      {store.access && <p className="whitespace-pre-line">{store.access}</p>}

      {/* 地図（Place ID のみ） */}
      <GoogleMapEmbed store={store} />

      <div>
        {store.postcode && <p>〒{store.postcode}</p>}
        {store.address && (
          <p className="whitespace-pre-line">{store.address}</p>
        )}
      </div>
    </section>
  );
}