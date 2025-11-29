"use client"

import type { HomeStore } from "@/types/store"
import Image from "next/image"

type Props = {
  isOpen: boolean
  onClose: () => void
  onCloseAll: () => void         // ← 追加！
  stores: HomeStore[]
  selectedFilters: string[]
  onSelectStore: (store: HomeStore) => void
}

export default function SearchResultPanel({
  isOpen,
  onClose,
  onCloseAll,          // ← 受け取る
  stores,
  selectedFilters,
  onSelectStore,
}: Props) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full max-w-[480px]
        bg-white shadow-2xl z-[60]
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        flex flex-col
      `}
    >

      {/* ==================================================== */}
      {/* 🎨 ヘッダー */}
      {/* ==================================================== */}
      <div className="px-4 py-4 flex items-center gap-4 border-b">
        <button onClick={onClose} className="active:scale-95">
          <div className="w-14 h-14 rounded-full flex justify-center items-center">
            <div className="w-14 h-14 bg-white/10 rounded-full shadow outline outline-1 outline-white/10 backdrop-blur-sm flex justify-center items-center">
              <div className="w-8 h-8 relative mix-blend-difference">
                <Image src="/logo4.svg" alt="back" fill className="object-contain" />
              </div>
            </div>
          </div>
        </button>

        <div className="flex flex-col">
          <div className="text-slate-900 font-bold text-lg tracking-widest leading-none">
            {stores.length}
            <span className="text-[10px] font-bold tracking-wide ml-1">件</span>
          </div>
        </div>

        <div className="flex-1 text-blue-800 text-xs line-clamp-2">
          {selectedFilters.join(", ")}
        </div>
      </div>


      {/* ==================================================== */}
      {/* 🏠 店舗一覧 */}
      {/* ==================================================== */}
      <div className="overflow-y-auto px-4 py-4 flex-1">
        <div className="grid grid-cols-2 gap-4 pb-20">
          {stores.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectStore(s)}
              className="text-left"
            >
              <div className="w-full bg-white rounded-xl shadow-sm border hover:shadow-md transition">

                {/* 画像 */}
                <div className="w-full h-32 bg-slate-100 rounded-t-xl overflow-hidden">
                  <img
                    src={s.image_url ?? "/default_shop.svg"}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* テキスト */}
                <div className="p-3">
                  <div className="font-semibold text-sm text-slate-900 line-clamp-1">
                    {s.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {s.prefecture} {s.area} ・ {s.type}
                  </div>
                </div>

              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 🔍 別の条件で探す（← ホームへ戻る） */}
      {/* ==================================================== */}
      <div className="px-6 pb-8">
        <button
          onClick={onCloseAll}   // ← これが超重要
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
            border border-slate-300 text-slate-700 text-lg font-medium
            hover:bg-slate-50 transition"
        >
          <span className="text-xl">🔍</span>
          別の条件で探す
        </button>
      </div>

    </div>
  )
}