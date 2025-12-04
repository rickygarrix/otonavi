// src/components/store/StoreCard.tsx
"use client"

import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore
  onClick?: () => void
}

export default function StoreCard({ store, onClick }: Props) {
  // 画像URLのフォールバック処理
  const imageUrl =
    store.image_url && store.image_url.trim() !== ""
      ? store.image_url
      : "/noshop.svg"

  return (
    <button
      onClick={onClick}
      className="
        w-full bg-white rounded-2xl shadow-sm
        border border-black/10
        hover:shadow-md transition text-left
        overflow-hidden
      "
    >
      {/* 画像 */}
      <div className="w-full h-40 p-2 flex justify-center items-center">
        <img
          src={imageUrl}
          alt={store.name}
          className="
            w-full h-36 object-cover rounded-2xl
            shadow-[0px_1px_2px_rgba(0,0,0,0.10)]
            shadow-[0px_0px_4px_rgba(0,0,0,0.10)]
            border border-black/10
          "
        />
      </div>

      {/* テキスト */}
      <div className="px-3 py-1 flex flex-col items-start gap-1">

        {/* 店名 */}
        <div className="w-full px-1 flex items-center">
          <div className="
            text-slate-900 text-sm font-bold
            leading-5 line-clamp-1
          ">
            {store.name}
          </div>
        </div>

        {/* 都道府県・エリア（東京のみ）・店タイプ */}
        <div className="w-full px-1 flex items-center gap-1">
          <div className="text-xs text-slate-600 leading-4">
            {store.prefecture}
            {store.prefecture === "東京都" && store.area ? ` ${store.area}` : ""}
          </div>

          <div className="text-xs text-slate-600">・</div>

          <div className="text-xs text-slate-600 leading-4 line-clamp-1">
            {store.type}
          </div>
        </div>
      </div>
    </button>
  )
}