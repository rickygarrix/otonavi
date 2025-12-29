'use client'

import Image from 'next/image'
import type { HomeStore } from '@/types/store'

type Props = {
  store: HomeStore
}

export default function HomeStoreCard({ store }: Props) {
  const imageUrl =
    store.image_url && store.image_url.trim() !== ''
      ? store.image_url
      : '/noshop.svg'

  // ✅ 「東京都 + エリア」表記 or 都道府県のみ
  const locationLabel =
    store.prefecture_label === '東京都' && store.area_label
      ? `東京 ${store.area_label}`
      : store.prefecture_label ?? ''

  return (
    <div className="w-full text-center flex flex-col items-center">
      {/* ✅ 正方形カード */}
      <div className="relative w-full aspect-square overflow-hidden rounded-3xl">
        <Image
          src={imageUrl}
          alt={store.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          priority
        />
      </div>

      {/* ✅ 店舗情報 */}
      <div className="mt-2 text-white w-full">
        <p className="font-bold text-xs line-clamp-1">
          {store.name}
        </p>

        <p className="text-[10px] opacity-80 mt-0.5 line-clamp-1">
          {locationLabel} ・ {store.type_label}
        </p>
      </div>
    </div>
  )
}