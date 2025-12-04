// src/components/home/HomeStoreCard.tsx
'use client'

import type { HomeStore } from '@/types/store'

export default function HomeStoreCard({ store }: { store: HomeStore }) {
  // 画像URLのフォールバック処理
  const imageUrl =
    store.image_url && store.image_url.trim() !== ""
      ? store.image_url
      : "/noshop.svg"

  // 東京なら「東京 渋谷区」それ以外は「大阪府」など
  const locationLabel =
    store.prefecture === '東京都'
      ? `東京 ${store.area}`
      : store.prefecture

  return (
    <div className="w-[260px] text-center flex flex-col items-center">
      {/* 画像（正方形 + 丸み + 切り抜き） */}
      <div className="w-full aspect-square overflow-hidden rounded-3xl">
        <img
          src={imageUrl}
          alt={store.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 店舗情報 */}
      <div className="mt-4 text-white">
        <p className="font-bold text-lg">{store.name}</p>

        <p className="text-sm opacity-80 mt-1">
          {locationLabel} ・ {store.type}
        </p>
      </div>
    </div>
  )
}