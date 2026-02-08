'use client';

import type { HomeStore } from '@/types/store';
import { MapPin } from 'lucide-react';

/* =========================
   Utils
========================= */
function isAppleDevice() {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();

  return (
    ua.includes('iphone') ||
    ua.includes('ipad') ||
    ua.includes('macintosh')
  );
}
function buildMapUrl(store: HomeStore) {
  const name = store.name;
  const address = store.address ?? '';
  const destination = encodeURIComponent(`${name} ${address}`);

  // Apple Maps：現在地 → 徒歩
  if (isAppleDevice()) {
    return `https://maps.apple.com/?daddr=${destination}&dirflg=w`;
  }

  // Google Maps：現在地 → 徒歩
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
}

/* =========================
   Component
========================= */

type Props = {
  store: HomeStore;
};

export default function StoreAccess({ store }: Props) {
  if (!store.access && !store.address) {
    return null;
  }

  const mapUrl = buildMapUrl(store);

  return (
    <section className="flex flex-col gap-4 p-4 text-sm text-dark-4">
      <h2 className="py-0.5 text-lg font-bold tracking-widest text-dark-5">
        アクセス
      </h2>

      {/* ① 住所 */}
      <div>
        {store.postcode && <p>〒{store.postcode}</p>}
        {store.address && (
          <p className="whitespace-pre-line">{store.address}</p>
        )}
      </div>

      {/* ② 地図を開くボタン */}
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-Brand-Light-1 px-4 text-sm text-Brand-Dark-5 transition hover:bg-Brand-Light-2"
        >
          <MapPin className="h-4 w-4" />
          <span>地図を開く</span>
        </a>
      )}

      {/* ③ アクセス説明 */}
      {store.access && (
        <p className="whitespace-pre-line">{store.access}</p>
      )}
    </section>
  );
}