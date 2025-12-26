"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { HomeStore } from "@/types/store"

// =====================
// Supabase 返却用の最小型
// =====================
type DefinitionKV = {
  key: string
  label: string
}

type StoreImageRow = {
  image_url: string | null
  is_main: boolean | null
  order_num: number | null
}

type StoreRow = {
  id: string
  name: string
  name_kana: string | null
  updated_at: string
  description: string | null
  access: string | null
  google_map_url: string | null
  address: string | null

  instagram_url: string | null
  x_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  official_site_url: string | null

  business_hours: string | null

  prefecture: { id: string; name_ja: string } | null
  area: { id: string; name: string } | null

  store_type: { id: string; label: string } | null
  price_range: { id: string; label: string } | null
  size: DefinitionKV | null


  event_trends: { event_trend_definitions: DefinitionKV | null }[]
  rules: { rule_definitions: DefinitionKV | null }[]

  store_images: StoreImageRow[]
}

// =====================
// util
// =====================
const extractKeys = <T extends Record<string, DefinitionKV | null>>(
  rows: T[],
  field: keyof T
): string[] =>
  rows.map((r) => r[field]?.key).filter((v): v is string => Boolean(v))

const extractLabels = <T extends Record<string, DefinitionKV | null>>(
  rows: T[],
  field: keyof T
): string[] =>
  rows.map((r) => r[field]?.label).filter((v): v is string => Boolean(v))

// =====================
// hook
// =====================
export function useHomeStores() {
  const [stores, setStores] = useState<HomeStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("stores")
        .select(`
          id,
          name,
          name_kana,
          updated_at,
          description,
          access,
          google_map_url,
          address,
          instagram_url,
          x_url,
          facebook_url,
          tiktok_url,
          official_site_url,
          business_hours,

          prefecture:prefecture_id ( id, name_ja ),
          area:area_id ( id, name ),

          store_type:store_type_id ( id, label ),
          price_range:price_range_id ( id, label ),
          size:size ( key, label ),

          event_trends:store_event_trends ( event_trend_definitions ( key, label ) ),

          store_images:store_images (
            image_url,
            is_main,
            order_num
          )
        `)

      if (error) {
        console.error("useHomeStores load error:", error)
        setStores([])
        setLoading(false)
        return
      }

      if (!data) {
        setStores([])
        setLoading(false)
        return
      }

      const rows = data as unknown as StoreRow[]

      const formatted: HomeStore[] = rows.map((s) => {
        let image_url = "/default_shop.svg"

        if (s.store_images.length > 0) {
          const main = s.store_images.find((i) => i.is_main)
          image_url =
            main?.image_url ??
            [...s.store_images]
              .sort((a, b) => (a.order_num ?? 999) - (b.order_num ?? 999))[0]
              ?.image_url ??
            image_url
        }

        return {
          // ============================
          // 基本
          // ============================
          id: s.id,
          name: s.name,
          name_kana: s.name_kana,

          prefecture_id: s.prefecture?.id ?? null,
          prefecture_label: s.prefecture?.name_ja ?? null,

          area_id: s.area?.id ?? null,
          area_label: s.area?.name ?? null,

          store_type_id: s.store_type?.id ?? null,
          type_label: s.store_type?.label ?? null,

          price_range_id: s.price_range?.id ?? null,
          price_range_label: s.price_range?.label ?? null,

          size_key: s.size?.key ?? null,
          size_label: s.size?.label ?? null,

          image_url,
          description: s.description,

          instagram_url: s.instagram_url,
          x_url: s.x_url,
          facebook_url: s.facebook_url,
          tiktok_url: s.tiktok_url,
          official_site_url: s.official_site_url,

          access: s.access,
          google_map_url: s.google_map_url,
          address: s.address,

          // ============================
          // 営業時間
          // ============================
          business_hours: s.business_hours,

          // ============================
          // 実績（仮）
          // ============================
          hasAward: false,
          hasMedia: false,
          store_awards: [],
          store_media_mentions: [],

          // ============================
          // M2M（取得済み）
          // ============================
          event_trend_keys: extractKeys(s.event_trends, "event_trend_definitions"),
          event_trend_labels: extractLabels(s.event_trends, "event_trend_definitions"),

          // ============================
          // M2M（未取得：空配列）
          // ============================
          baggage_keys: [],
          baggage_labels: [],

          toilet_keys: [],
          toilet_labels: [],

          smoking_keys: [],
          smoking_labels: [],

          environment_keys: [],
          environment_labels: [],

          other_keys: [],
          other_labels: [],

          payment_method_keys: [],
          payment_method_labels: [],

          customer_keys: [],
          customer_labels: [],

          atmosphere_keys: [],
          atmosphere_labels: [],

          drink_keys: [],
          drink_labels: [],

          // ============================
          // その他
          // ============================
          updated_at: s.updated_at,
        }
      })

      setStores(formatted)
      setLoading(false)
    }

    load()
  }, [])

  return { stores, loading }
}