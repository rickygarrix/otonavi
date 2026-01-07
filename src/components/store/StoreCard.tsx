"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import type { SearchStore } from "@/types/store"

type Props = {
  store: SearchStore
  query?: string
}

export default function StoreCard({ store, query }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (query && query.trim() !== "") {
      router.push(`/stores/${store.id}?${query}`)
    } else {
      router.push(`/stores/${store.id}`)
    }
  }

  const imageUrl =
    store.image_url && store.image_url.trim() !== ""
      ? store.image_url
      : "/noshop.svg"

  const locationLabel =
    store.prefecture_label === "東京都" && store.area_label
      ? `東京 ${store.area_label}`
      : store.prefecture_label ?? ""

  return (
    <button onClick={handleClick} className="w-full bg-white text-left">
      {/* 画像 */}
      <div className="relative w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={store.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* テキスト */}
      <div className="px-1 py-2">
        <p className="text-slate-900 text-sm font-bold leading-5 line-clamp-1">
          {store.name}
        </p>

        <div className="mt-0.5 text-xs text-slate-600 leading-4 line-clamp-1">
          {locationLabel}
          {store.type_label && ` ・ ${store.type_label}`}
        </div>
      </div>
    </button>
  )
}