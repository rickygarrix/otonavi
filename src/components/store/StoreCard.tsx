"use client"

import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore
  onClick?: () => void
}

export default function StoreCard({ store, onClick }: Props) {
  const raw =
    store.image_url ??
    (store as any).image ??
    ""

  const imageUrl = raw && raw.trim() !== "" ? raw : "/defaultshop.svg"

  return (
    <button
      onClick={onClick}
      className="
        w-full bg-white rounded-2xl
        border border-black/10
        shadow-sm hover:shadow-md transition
        text-left overflow-hidden
      "
    >
      {/* 画像エリア */}
      <div className="w-full h-[140px] flex items-center justify-center bg-gray-200">
        <img
          src={imageUrl}
          alt={store.name}
          className="
            w-full h-full
            object-contain   /* ← これが重要 */
          "
        />
      </div>

      {/* テキスト */}
      <div className="px-3 py-2 flex flex-col gap-1">

        <div className="px-1">
          <p className="text-slate-900 text-sm font-bold leading-5 line-clamp-1">
            {store.name}
          </p>
        </div>

        <div className="px-1 flex items-center gap-1 text-xs text-slate-600 leading-4">
          <span>
            {store.prefecture}
            {store.prefecture === "東京都" && store.area ? ` ${store.area}` : ""}
          </span>
          <span>・</span>
          <span className="line-clamp-1">{store.type}</span>
        </div>
      </div>
    </button>
  )
}