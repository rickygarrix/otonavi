"use client"

import HomeStoreCard from "../store/HomeStoreCard"
import type { HomeStore } from "@/types/store"

type Props = {
  stores: HomeStore[]
  onSelectStore: (store: HomeStore) => void
}

export default function HomeLatestStores({ stores, onSelectStore }: Props) {
  // ✅ updated_at の新しい順に並び替え → 上位3件だけ取得
  const latestStores = [...stores]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 3)

  if (latestStores.length === 0) return null

  return (
    <div className="w-full px-6 mt-10">
      {/* ✅ 見出し */}
      <h2 className="text-white text-lg font-bold mb-4 text-center">
        最近更新された音箱
      </h2>

      {/* ✅ 横並び3カード（サイズ完全制御） */}
      <div className="grid grid-cols-3 gap-3 items-start">
        {latestStores.map((store) => (
          <div
            key={store.id}
            onClick={() => onSelectStore(store)}
            className="
              cursor-pointer
              active:scale-95
              transition-transform
              max-w-[110px]    // ✅ ここが最重要
              w-full
              mx-auto         // ✅ カードを中央寄せ
            "
          >
            <HomeStoreCard store={store} />
          </div>
        ))}
      </div>
    </div>
  )
}