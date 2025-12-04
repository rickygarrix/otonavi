"use client"

import type { HomeStore } from "@/types/store"
import StoreCard from "@/components/store/StoreCard"
import Footer from "@/components/Footer"
import HomeButton from "@/components/ui/HomeButton"
import BackToHomeButton from "@/components/ui/BackToHomeButton"

type Props = {
  isOpen: boolean
  onCloseAll: () => void
  stores: HomeStore[]
  selectedFilters: string[]
  onSelectStore: (store: HomeStore) => void
}

export default function SearchResultPanel({
  isOpen,
  onCloseAll,
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

      {/* 固定ヘッダー */}
      <div
        className="
          px-4 py-4 flex items-center gap-4 border-b
          sticky top-0 bg-white z-[70]
        "
      >
        <HomeButton onHome={onCloseAll} size={56} iconSize={26} />

        <div className="text-slate-900 font-bold text-lg tracking-widest leading-none">
          {stores.length}
          <span className="text-[10px] ml-1">件</span>
        </div>

        <div className="flex-1 text-blue-800 text-xs line-clamp-2">
          {selectedFilters.join(", ")}
        </div>
      </div>

      {/* 店舗一覧 */}
      <div className="overflow-y-auto px-4 py-4 flex-1">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {stores.map((s) => (
            <div key={s.id} className="min-h-[250px] flex">
              {/* 高さ固定で2列ズレ防止 */}
              <StoreCard store={s} onClick={() => onSelectStore(s)} />
            </div>
          ))}
        </div>
      </div>

      <BackToHomeButton onClick={onCloseAll} className="px-6 pb-8" />

      <Footer />
    </div>
  )
}