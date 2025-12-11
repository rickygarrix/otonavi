"use client"

import { useRouter } from "next/navigation"
import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore
  query?: string // ← 追加（検索条件を受け取る）
}

export default function StoreCard({ store, query }: Props) {
  const router = useRouter()

  // =========================
  // 店舗詳細へ遷移（検索条件維持）
  // =========================
  const handleClick = () => {
    if (query && query.trim() !== "") {
      router.push(`/stores/${store.id}?${query}`)
    } else {
      router.push(`/stores/${store.id}`)
    }
  }

  // =========================
  // 画像の安全取得
  // =========================
  const imageUrl =
    store.image_url && store.image_url.trim() !== ""
      ? store.image_url
      : "/defaultshop.svg"

  // =========================
  // ロケーション表示
  // =========================
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
      {/* 画像 */}
      <div className="w-full h-[140px] flex items-center justify-center bg-gray-200">
        <img
          src={imageUrl}
          alt={store.name}
          className="w-full h-full object-contain"
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