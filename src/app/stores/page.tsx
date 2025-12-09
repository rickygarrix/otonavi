"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import type { HomeStore } from "@/types/store"
import StoreCard from "@/components/store/StoreCard"
import Footer from "@/components/Footer"
import BackToHomeButton from "@/components/ui/BackToHomeButton"

import { useStoreFilters } from "@/hooks/useStoreFilters"
import { useHomeStores } from "@/hooks/useHomeStores"

export default function StoresPage() {
  const router = useRouter()
  const { stores } = useHomeStores()

  // ✅ Home と完全に同じフィルター状態を使う前提（Zustand or Context 前提）
  const {
    filteredStores,
    selectedFilters,
    handleSelectStore,
  } = useStoreFilters(stores)

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* 固定ヘッダー */}
      <div className="px-4 py-4 flex items-center gap-4 border-b sticky top-0 bg-white z-50">
        <BackToHomeButton onClick={() => router.push("/")} />

        <div className="text-slate-900 font-bold text-lg tracking-widest leading-none">
          {filteredStores.length}
          <span className="text-[10px] ml-1">件</span>
        </div>

        <div className="flex-1 text-blue-800 text-xs line-clamp-2">
          {selectedFilters.join(", ")}
        </div>
      </div>

      {/* 店舗一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredStores.map((s) => (
            <div key={s.id} className="min-h-[250px] flex">
              <StoreCard
                store={s}
                onClick={() => handleSelectStore(s)}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}