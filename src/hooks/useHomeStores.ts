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

        store_type:store_type_id ( label ),
        price_range:price_range_id ( label ),
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

        prefecture:prefecture_id ( name_ja ),
        area:area_id ( name ),

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

        const drinkKeys: string[] = []
        const drinkLabels: string[] = []
        const drinkCategories: Record<string, { keys: string[], labels: string[] }> = {}

        if (Array.isArray(s.drinks)) {
          for (const d of s.drinks) {
            const def = d.drink_definitions
            if (!def?.key) continue

            drinkKeys.push(def.key)
            drinkLabels.push(def.label ?? def.key)

            const cat = def.category ?? "その他"
            if (!drinkCategories[cat]) {
              drinkCategories[cat] = { keys: [], labels: [] }
            }
            drinkCategories[cat].keys.push(def.key)
            drinkCategories[cat].labels.push(def.label ?? def.key)
          }
        }

        return {
          id: s.id,
          name: s.name,
          name_kana: s.name_kana ?? null,

          prefecture: s.prefecture?.name_ja ?? null,
          area: s.area?.name ?? null,

          store_type_id: s.store_type_id ?? null,
          type: s.store_type?.label ?? null,

          price_range_id: s.price_range_id ?? null,
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

          updated_at: s.updated_at,   // ✅ 最重要

          event_trend_keys: arr(s.event_trends, "event_trend_definitions"),
          event_trend_labels: arrLabel(s.event_trends, "event_trend_definitions"),

          rule_keys: arr(s.rules, "rule_definitions"),
          rule_labels: arrLabel(s.rules, "rule_definitions"),

          seat_type_keys: arr(s.seat_types, "seat_type_definitions"),
          seat_type_labels: arrLabel(s.seat_types, "seat_type_definitions"),

          smoking_keys: arr(s.smoking, "smoking_definitions"),
          smoking_labels: arrLabel(s.smoking, "smoking_definitions"),

          environment_keys: arr(s.environments, "environment_definitions"),
          environment_labels: arrLabel(s.environments, "environment_definitions"),

          other_keys: arr(s.others, "other_definitions"),
          other_labels: arrLabel(s.others, "other_definitions"),

          baggage_keys: arr(s.baggage, "baggage_definitions"),
          baggage_labels: arrLabel(s.baggage, "baggage_definitions"),

          security_keys: arr(s.security, "security_definitions"),
          security_labels: arrLabel(s.security, "security_definitions"),

          toilet_keys: arr(s.toilets, "toilet_definitions"),
          toilet_labels: arrLabel(s.toilets, "toilet_definitions"),

          floor_keys: arr(s.floors, "floor_definitions"),
          floor_labels: arrLabel(s.floors, "floor_definitions"),

          pricing_system_keys: arr(s.pricing_systems, "pricing_system_definitions"),
          pricing_system_labels: arrLabel(s.pricing_systems, "pricing_system_definitions"),

          discount_keys: arr(s.discounts, "discount_definitions"),
          discount_labels: arrLabel(s.discounts, "discount_definitions"),

          vip_keys: arr(s.vips, "vip_definitions"),
          vip_labels: arrLabel(s.vips, "vip_definitions"),

          payment_method_keys: arr(s.payment_methods, "payment_method_definitions"),
          payment_method_labels: arrLabel(s.payment_methods, "payment_method_definitions"),

          sound_keys: arr(s.sounds, "sound_definitions"),
          sound_labels: arrLabel(s.sounds, "sound_definitions"),

          lighting_keys: arr(s.lightings, "lighting_definitions"),
          lighting_labels: arrLabel(s.lightings, "lighting_definitions"),

          production_keys: arr(s.productions, "production_definitions"),
          production_labels: arrLabel(s.productions, "production_definitions"),

          customer_keys: arr(s.customers, "customer_definitions"),
          customer_labels: arrLabel(s.customers, "customer_definitions"),

          atmosphere_keys: arr(s.atmospheres, "atmosphere_definitions"),
          atmosphere_labels: arrLabel(s.atmospheres, "atmosphere_definitions"),

          food_keys: arr(s.foods, "food_definitions"),
          food_labels: arrLabel(s.foods, "food_definitions"),

          service_keys: arr(s.services, "service_definitions"),
          service_labels: arrLabel(s.services, "service_definitions"),

          drink_keys: drinkKeys,
          drink_labels: drinkLabels,
          drink_categories: drinkCategories,

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