"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore
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
      : "/defaultshop.svg"

  const locationLabel =
    store.prefecture_label === "東京都" && store.area_label
      ? `東京 ${store.area_label}`
      : store.prefecture_label ?? ""

  return (
    <button
      onClick={handleClick}
      className="
        w-full bg-white rounded-2xl
        border border-black/10
        shadow-sm hover:shadow-md transition
        text-left overflow-hidden
      "
    >
      <div className="relative w-full h-[140px] bg-gray-200">
        <Image
          src={imageUrl}
          alt={store.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain"
        />
      </div>

      <div className="px-3 py-2 flex flex-col gap-1">
        <div className="px-1">
          <p className="text-slate-900 text-sm font-bold leading-5 line-clamp-1">
            {store.name}
          </p>
        </div>

        <div className="px-1 flex items-center gap-1 text-xs text-slate-600 leading-4">
          <span>{locationLabel}</span>
          {store.type_label && (
            <>
              <span>・</span>
              <span className="line-clamp-1">{store.type_label}</span>
            </>
          )}
        </div>
      </div>
    </button>
  )
}