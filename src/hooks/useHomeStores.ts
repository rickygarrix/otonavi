"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { HomeStore } from "@/types/store"

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

          store_type_id,
          price_range_id,
          hospitality,

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

          special_hours:store_special_open_hours!store_special_open_hours_store_id_fkey (
            start_date,
            end_date,
            open_time,
            close_time,
            last_order_time,
            is_closed,
            reason
          ),

          prefecture:prefecture_id ( id, name_ja ),
          area:area_id ( id, name ),

          event_trends:store_event_trends ( event_trend_definitions ( key, label ) ),
          rules:store_rules ( rule_definitions ( key, label ) ),

          store_images:store_images (
            image_url,
            is_main,
            order_num
          )
        `)

      if (error) {
        console.error("Supabase error:", error)
        setLoading(false)
        return
      }

      const arr = (src: any, field: string) =>
        Array.isArray(src)
          ? src.map((v: any) => v[field]?.key).filter(Boolean)
          : []

      const arrLabel = (src: any, field: string) =>
        Array.isArray(src)
          ? src.map((v: any) => v[field]?.label).filter(Boolean)
          : []

      const formatted: HomeStore[] = (data ?? []).map((s: any) => {
        let imageUrl: string | null = null
        if (Array.isArray(s.store_images) && s.store_images.length > 0) {
          const main = s.store_images.find((img: any) => img.is_main)
          imageUrl =
            main?.image_url ??
            [...s.store_images].sort(
              (a, b) => (a.order_num ?? 999) - (b.order_num ?? 999)
            )[0]?.image_url ??
            null
        }
        if (!imageUrl) imageUrl = "/default_shop.svg"

        return {
          id: s.id,
          name: s.name,
          name_kana: s.name_kana ?? null,

          // ✅ prefecture / area → uuid + label
          prefecture_id: s.prefecture?.id ?? null,
          prefecture_label: s.prefecture?.name_ja ?? null,

          area_id: s.area?.id ?? null,
          area_label: s.area?.name ?? null,

          // ✅ type
          store_type_id: s.store_type?.id ?? null,
          type_label: s.store_type?.label ?? null,

          // ✅ price
          price_range_id: s.price_range?.id ?? null,
          price_range_label: s.price_range?.label ?? null,

          image_url: imageUrl,
          description: s.description ?? null,

          instagram_url: s.instagram_url ?? null,
          x_url: s.x_url ?? null,
          facebook_url: s.facebook_url ?? null,
          tiktok_url: s.tiktok_url ?? null,
          official_site_url: s.official_site_url ?? null,

          access: s.access ?? null,
          google_map_url: s.google_map_url ?? null,
          address: s.address ?? null,

          open_hours: s.open_hours ?? [],
          special_hours: s.special_hours ?? [],

          hasAward: Array.isArray(s.awards) && s.awards.length > 0,
          hasMedia: Array.isArray(s.media) && s.media.length > 0,

          updated_at: s.updated_at,

          // ✅ 以下 M2M
          event_trend_keys: arr(s.event_trends, "event_trend_definitions"),
          event_trend_labels: arrLabel(s.event_trends, "event_trend_definitions"),

          rule_keys: arr(s.rules, "rule_definitions"),
          rule_labels: arrLabel(s.rules, "rule_definitions"),

          seat_type_keys: [],
          seat_type_labels: [],

          smoking_keys: [],
          smoking_labels: [],

          environment_keys: [],
          environment_labels: [],

          other_keys: [],
          other_labels: [],

          baggage_keys: [],
          baggage_labels: [],

          security_keys: [],
          security_labels: [],

          toilet_keys: [],
          toilet_labels: [],

          floor_keys: [],
          floor_labels: [],

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

          hospitality_key: s.hospitality_def?.key ?? null,
          hospitality_label: s.hospitality_def?.label ?? null,

          size_key: s.size?.key ?? null,
          size_label: s.size?.label ?? null,
        }
      })

      setStores(formatted)
      setLoading(false)
    }

    load()
  }, [])

  return { stores, loading }
}