"use client"

import { useRouter, useSearchParams } from "next/navigation"

import type { HomeStore } from "@/types/store"
import StoreCard from "@/components/store/StoreCard"
import Footer from "@/components/Footer"
import HomeButton from "@/components/ui/HomeButton"
import BackToHomeButton from "@/components/ui/BackToHomeButton"

import { useHomeStores } from "@/hooks/useHomeStores"

export default function StoresPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { stores } = useHomeStores()

  // Home から渡ってきた表示用ラベル
  const selectedFilters = searchParams.getAll("filters")
  // Home から渡ってきた「絞り込まれた store の id」
  const idParams = searchParams.getAll("ids")

  const filteredStores: HomeStore[] =
    idParams.length > 0
      ? stores.filter((s) => idParams.includes(s.id))
      : stores

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ================= 固定ヘッダー ================= */}
      <div
        className="
          px-4 py-4 flex items-center gap-4 border-b
          sticky top-0 bg-white z-[70]
        "
      >
        <HomeButton
          onHome={() => router.push("/")}
          size={56}
          iconSize={26}
        />

        <div className="text-slate-900 font-bold text-lg tracking-widest leading-none">
          {filteredStores.length}
          <span className="text-[10px] ml-1">件</span>
        </div>

        <div className="flex-1 text-blue-800 text-xs line-clamp-2">
          {selectedFilters.join(", ")}
        </div>
      </div>

      {/* ================= 店舗一覧 ================= */}
      <div className="overflow-y-auto px-4 py-4 flex-1">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredStores.map((s) => (
            <div key={s.id} className="min-h-[250px] flex">
              <StoreCard store={s} />
            </div>
          ))}
        </div>
      </div>

      {/* ================= 下部 戻るボタン ================= */}
      <BackToHomeButton
        onClick={() => router.push("/")}
        className="px-6 pb-8"
      />

      <Footer />
    </div>
  )
}