"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

import type { HomeStore } from "@/types/store"
import StoreDetailView from "@/components/store/StoreDetailView"
import HomeButton from "@/components/ui/HomeButton"

export default function StoreDetailPage() {
  const router = useRouter()
  const params = useParams()   // ✅ ここが重要
  const storeId = params?.id as string

  const [store, setStore] = useState<HomeStore | null>(null)

  useEffect(() => {
    if (!storeId) return

    const load = async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .single()

      if (error) {
        console.error("店舗取得エラー:", error)
        return
      }

      setStore(data)
    }

    load()
  }, [storeId])

  if (!store) {
    return <div className="p-10 text-center">読み込み中...</div>
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* ================= ヘッダー ================= */}
      <div
        className="
          fixed top-0 left-0 right-0 z-[90]
          flex items-center gap-3
          px-4 py-4 pt-[calc(env(safe-area-inset-top)+8px)]
          bg-black/40 text-white backdrop-blur
        "
      >
        <HomeButton onHome={() => router.back()} size={48} iconSize={24} />
        <div className="font-semibold text-lg truncate">{store.name}</div>
      </div>

      {/* ================= 本体 ================= */}
      <div className="pt-[90px]">
        <StoreDetailView store={store} />
      </div>
    </div>
  )
}