'use client'

import type { HomeStore } from '@/types/store'

export default function HomeStoreCard({ store }: { store: HomeStore }) {
  const imageUrl =
    store.image_url && store.image_url.trim() !== ''
      ? store.image_url
      : '/noshop.svg'

  const locationLabel =
    store.prefecture === '東京都'
      ? `東京 ${store.area}`
      : store.prefecture

  return (
    // ✅ 固定 w-[260px] を完全撤去
    <div className="w-full text-center flex flex-col items-center">
      {/* ✅ 正方形カード */}
      <div className="w-full aspect-square overflow-hidden rounded-3xl">
        <img
          src={imageUrl}
          alt={store.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 店舗情報 */}
      <div className="mt-2 text-white w-full">
        <p className="font-bold text-xs line-clamp-1">
          {store.name}
        </p>

        <p className="text-[10px] opacity-80 mt-0.5 line-clamp-1">
          {locationLabel} ・ {store.type}
        </p>
      </div>
    </div>
  )
}