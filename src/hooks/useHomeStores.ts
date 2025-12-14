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

  prefecture: { id: string; name_ja: string } | null
  area: { id: string; name: string } | null

  store_type: { id: string; label: string } | null
  price_range: { id: string; label: string } | null

  size: DefinitionKV | null
  hospitality_def: DefinitionKV | null

  open_hours: {
    day_of_week: number
    open_time: string | null
    close_time: string | null
    last_order_time: string | null
    is_closed: boolean
  }[]

  special_hours: {
    start_date: string
    end_date: string
    open_time: string | null
    close_time: string | null
    last_order_time: string | null
    is_closed: boolean
    reason: string | null
  }[]

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

          prefecture:prefecture_id ( id, name_ja ),
          area:area_id ( id, name ),

          store_type:store_type_id ( id, label ),
          price_range:price_range_id ( id, label ),
          size:size ( key, label ),
          hospitality_def:hospitality ( key, label ),

          open_hours:store_open_hours (
            day_of_week,
            open_time,
            close_time,
            last_order_time,
            is_closed
          ),

          special_hours:store_special_open_hours (
            start_date,
            end_date,
            open_time,
            close_time,
            last_order_time,
            is_closed,
            reason
          ),

          event_trends:store_event_trends ( event_trend_definitions ( key, label ) ),
          rules:store_rules ( rule_definitions ( key, label ) ),

          store_images:store_images (
            image_url,
            is_main,
            order_num
          )
        `)

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      // 👇 ここだけ追加
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
          open_hours: s.open_hours,
          special_hours: s.special_hours,

          // ============================
          // 実績（一覧では空でOK）
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

          rule_keys: extractKeys(s.rules, "rule_definitions"),
          rule_labels: extractLabels(s.rules, "rule_definitions"),

          // ============================
          // M2M（未取得：空配列で埋める）
          // ============================
          baggage_keys: [],
          baggage_labels: [],

          security_keys: [],
          security_labels: [],

          toilet_keys: [],
          toilet_labels: [],

          floor_keys: [],
          floor_labels: [],

          seat_type_keys: [],
          seat_type_labels: [],

          smoking_keys: [],
          smoking_labels: [],

          environment_keys: [],
          environment_labels: [],

          other_keys: [],
          other_labels: [],

          pricing_system_keys: [],
          pricing_system_labels: [],

          discount_keys: [],
          discount_labels: [],

          vip_keys: [],
          vip_labels: [],

          payment_method_keys: [],
          payment_method_labels: [],

          sound_keys: [],
          sound_labels: [],

          lighting_keys: [],
          lighting_labels: [],

          production_keys: [],
          production_labels: [],

          customer_keys: [],
          customer_labels: [],

          atmosphere_keys: [],
          atmosphere_labels: [],

          food_keys: [],
          food_labels: [],

          service_keys: [],
          service_labels: [],

          drink_keys: [],
          drink_labels: [],
          drink_categories: {},

          // ============================
          // 単一選択
          // ============================
          hospitality_key: s.hospitality_def?.key ?? null,
          hospitality_label: s.hospitality_def?.label ?? null,

          size_key: s.size?.key ?? null,
          size_label: s.size?.label ?? null,

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