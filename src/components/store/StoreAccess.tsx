'use client';

import type { HomeStore } from '@/types/store';

function GoogleMapEmbed({ url }: { url: string }) {
  const match = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  const lat = match[1];
  const lng = match[2];

  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div className="my-2 overflow-hidden rounded-lg shadow-sm">
      <iframe
        src={embedUrl}
        className="h-112 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
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
      <h2 className="text-dark-5 py-0.5 text-lg font-bold tracking-widest">アクセス</h2>

      {store.access && <p className="whitespace-pre-line">{store.access}</p>}

      {/* 地図 */}
      {store.google_map_url && <GoogleMapEmbed url={store.google_map_url} />}

      <div>
        {/* 郵便番号 */}
        {store.postcode && <p>〒{store.postcode}</p>}

        {/* 所在地 */}
        {store.address && <p className="whitespace-pre-line">{store.address}</p>}
      </div>
    </section>
  );
}
