"use client"

import type { HomeStore } from "@/types/store"

function GoogleMapEmbed({ url }: { url: string }) {

  const match = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)

  if (!match) {

    return null
  }

  const lat = match[1]
  const lng = match[2]

  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`

  return (
    <div className="mt-4">
      <iframe
        src={embedUrl}
        className="w-full h-[240px] rounded-xl border border-slate-200"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

type Props = {
  store: HomeStore
}

export default function StoreAccess({ store }: Props) {
  if (!store.access && !store.address && !store.google_map_url) return null

  return (
    <div className="px-4 mt-10">
      <h2 className="text-xl font-bold mb-3">アクセス</h2>

      {store.access && (
        <p className="text-slate-700 whitespace-pre-line mb-3">
          {store.access}
        </p>
      )}

      {/* 地図 */}
      {store.google_map_url && (
        <GoogleMapEmbed url={store.google_map_url} />
      )}

      {/* 郵便番号 */}
      {store.postcode && (
        <p className="text-slate-500 text-sm mb-1">
          〒{store.postcode}
        </p>
      )}

      {/* 住所 */}
      {store.address && (
        <p className="text-slate-700 whitespace-pre-line mb-3">
          {store.address}
        </p>
      )}
    </div>
  )
}