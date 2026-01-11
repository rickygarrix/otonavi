'use client';

import type { HomeStore } from '@/types/store';

/**
 * Google Maps Embed
 * - place モードで「店舗名 + 住所」から正確なピン表示
 * - 拡大しても「35°39'...」のような座標表示を回避
 * - スマホ対応
 */
function GoogleMapEmbed({ store }: { store: HomeStore }) {
  if (!store?.name) return null;

  // 店舗名 + 住所で検索（最も安定）
  const query = `${store.name} ${store.address ?? ''}`.trim();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY が設定されていません');
    return null;
  }

  /**
   * place → 店舗ピンあり（推奨）
   * view  → 中心点表示のみ（ピンなし）
   */
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    query
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

export default function StoreAccess({ store }: Props) {
  if (!store.access && !store.address && !store.google_map_url) return null;

  return (
    <section className="text-dark-4 flex flex-col gap-4 p-4 text-sm">
      <h2 className="text-dark-5 py-0.5 text-lg font-bold tracking-widest">
        アクセス
      </h2>

      {store.access && <p className="whitespace-pre-line">{store.access}</p>}

      {/* 地図 */}
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