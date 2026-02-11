'use client';

import type { HomeStore } from '@/types/store';
import { MapPin } from 'lucide-react';
import LinkButton from '@/components/ui/button/Button';

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

  // iOS / macOS → Apple Maps ネイティブ
  if (isAppleDevice()) {
    return `maps://?q=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}`;
  }

  // Android → Google Maps アプリ
  if (isAndroid()) {
    return `intent://maps.google.com/maps?q=${query}` +
           `#Intent;scheme=https;package=com.google.android.apps.maps;end`;
  }

  // PC / その他 → Google Maps Web
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
    <section className="text-dark-4 flex flex-col gap-4 p-4 text-sm">
      <h2 className="text-dark-5 py-0.5 text-lg font-bold tracking-widest">
        アクセス
      </h2>

      {/* 店名＋住所 */}
      <div className="flex flex-col gap-1">
        <p className="text-dark-5 font-bold">{store.name}</p>
        {store.postcode && <p>〒{store.postcode}</p>}
        {store.address && (
          <p className="whitespace-pre-line">{store.address}</p>
        )}
      </div>

      {/* アクセス説明 */}
      {store.access && (
        <p className="whitespace-pre-line">{store.access}</p>
      )}

      {/* 地図を開く（同一タブ） */}
      {mapUrl && (
        <LinkButton
          href={mapUrl}
          priority="secondary"
          label="地図を開く"
          leftIcon={MapPin}
        />
      )}
    </section>
  );
}