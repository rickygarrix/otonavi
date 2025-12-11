"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

import type { HomeStore } from "@/types/store"
import StoreDetailView from "@/components/store/StoreDetailView"
import HomeButton from "@/components/ui/HomeButton"

export default function StoreDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  const storeId = params?.id as string

  const [store, setStore] = useState<HomeStore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!storeId) return

    const load = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("stores")
        .select(`
          *,
          store_types:store_type_id ( label ),
          prefectures:prefecture_id ( name_ja ),
          areas:area_id ( name )
        `)
        .eq("id", storeId)
        .single()

      if (error) {
        console.error("店舗取得エラー:", error)
        setStore(null)
        setLoading(false)
        return
      }

      // ------------------------
      // HomeStore にマッピング
      // ------------------------
      const mapped: HomeStore = {
        ...data,

        prefecture_label: data.prefectures?.name_ja ?? "",
        area_label: data.areas?.name ?? "",
        type_label: data.store_types?.label ?? "",

        // ★ 保険：存在しない場合は空配列にしておく
        open_hours: data.open_hours ?? [],
        special_hours: data.special_hours ?? [],

        event_trend_labels: data.event_trend_labels ?? [],
        rule_labels: data.rule_labels ?? [],
        baggage_labels: data.baggage_labels ?? [],
        security_labels: data.security_labels ?? [],
        toilet_labels: data.toilet_labels ?? [],
        floor_labels: data.floor_labels ?? [],
        seat_type_labels: data.seat_type_labels ?? [],
        smoking_labels: data.smoking_labels ?? [],
        environment_labels: data.environment_labels ?? [],
        pricing_system_labels: data.pricing_system_labels ?? [],
        discount_labels: data.discount_labels ?? [],
        vip_labels: data.vip_labels ?? [],
        payment_method_labels: data.payment_method_labels ?? [],
        sound_labels: data.sound_labels ?? [],
        lighting_labels: data.lighting_labels ?? [],
        production_labels: data.production_labels ?? [],
        food_labels: data.food_labels ?? [],
        service_labels: data.service_labels ?? [],
      }

      setStore(mapped)
      setLoading(false)
    }

    load()
  }, [storeId])

  if (loading || !store) {
    return <div className="p-10 text-center">読み込み中...</div>
  }

  return (
    <div className="relative min-h-screen bg-white">

      {/* ヘッダー */}
      <div className="fixed top-0 left-0 right-0 z-[90] flex items-center gap-3 px-4 py-4 pt-[calc(env(safe-area-inset-top)+8px)] bg-black/40 text-white backdrop-blur">

        <HomeButton
          onHome={() => {
            if (query) router.push(`/`)
            else router.back()
          }}
          size={48}
          iconSize={24}
        />

        <div className="font-semibold text-lg truncate">{store.name}</div>
      </div>

      <div className="pt-[90px]">
        <StoreDetailView store={store} />
      </div>
    </div>
  )
}