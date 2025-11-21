// src/components/home/HomeStoreCard.tsx
'use client'

import type { HomeStore } from '@/types/store'

export default function HomeStoreCard({ store }: { store: HomeStore }) {
  // 東京なら「東京 渋谷区」それ以外は「青森県」「大阪府」など
  const locationLabel =
    store.prefecture === '東京都'
      ? `東京 ${store.area}`
      : store.prefecture

  return (
    <div className="w-[260px] text-center flex flex-col items-center">
      {/* 画像（正方形 + 丸み + 切り抜き） */}
      <div className="w-full aspect-square overflow-hidden rounded-3xl">
        {store.image_url ? (
          <img
            src={store.image_url}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-white">
            No Image
          </div>
        )}
      </div>

      {/* 店舗情報（背景なしでスッキリ） */}
      <div className="mt-4 text-white">
        <p className="font-bold text-lg">{store.name}</p>

        <p className="text-sm opacity-80 mt-1">
          {locationLabel} ・ {store.type}
        </p>
      </div>
    </div>
  )
}