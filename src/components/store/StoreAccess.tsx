'use client';

import type { HomeStore } from '@/types/store';
import { MapPin } from 'lucide-react';

/* =========================
   Utils
========================= */
function isAppleDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('iphone') || ua.includes('ipad') || ua.includes('macintosh');
}

function isAndroid() {
  if (typeof navigator === 'undefined') return false;
  return /android/.test(navigator.userAgent.toLowerCase());
}

function buildMapUrl(store: HomeStore) {
  const name = store.name;
  const address = store.address ?? '';
  const query = encodeURIComponent(`${name} ${address}`);

  // iOS / macOS → Apple Maps ネイティブ（ピン表示・店名あり）
  if (isAppleDevice()) {
    return `maps://?q=${encodeURIComponent(name)}&address=${encodeURIComponent(
      address,
    )}`;
  }

  // Android → Google Maps アプリ強制起動（ピン表示）
  if (isAndroid()) {
    return `intent://maps.google.com/maps?q=${query}#Intent;scheme=https;package=com.google.android.apps.maps;end`;
  }

  // Windows / その他 → Google Maps Web
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/* =========================
   Component
========================= */

type Props = {
  store: HomeStore;
};

export default function StoreAccess({ store }: Props) {
  if (!store.address && !store.access) {
    return null;
  }

  const mapUrl = buildMapUrl(store);

  return (
    <section className="flex flex-col gap-4 p-4 text-sm text-dark-4">
      <h2 className="py-0.5 text-lg font-bold tracking-widest text-dark-5">
        アクセス
      </h2>

      {/* 店名＋住所（ここで認知を完結させる） */}
      <div className="flex flex-col gap-1">
        <p className="font-bold text-dark-5">{store.name}</p>
        {store.postcode && <p>〒{store.postcode}</p>}
        {store.address && (
          <p className="whitespace-pre-line">{store.address}</p>
        )}
      </div>

      {/* アクセス説明 */}
      {store.access && (
        <p className="whitespace-pre-line">{store.access}</p>
      )}

      {/* 地図を開く */}
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-light-1 px-4 text-sm transition hover:bg-light-2"
        >
          <MapPin className="h-4 w-4" strokeWidth={1.2} />
          <span>地図で場所を確認</span>
        </a>
      )}
    </section>
  );
}