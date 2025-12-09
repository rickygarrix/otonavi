// /hooks/useHomeMasters.ts
"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

type Prefecture = { id: string; name_ja: string }
type Area = { id: string; name: string }
type DrinkMaster = { key: string; label: string }
type GenericMaster = { id: string; label: string }

export function useHomeMasters() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [drinkMasters, setDrinkMasters] = useState<DrinkMaster[]>([])
  const [genericMasters, setGenericMasters] = useState<Map<string, string>>(new Map())

  // 都道府県・エリア
  useEffect(() => {
    const load = async () => {
      const { data: prefData } = await supabase.from("prefectures").select("id, name_ja")
      const { data: areaData } = await supabase.from("areas").select("id, name")
      setPrefectures(prefData ?? [])
      setAreas(areaData ?? [])
    }
    load()
  }, [])

  // ドリンク
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("drink_definitions")
        .select("key, label")
        .eq("is_active", true)

      setDrinkMasters(data ?? [])
    }
    load()
  }, [])

  // Generic 全マスタ
  useEffect(() => {
    const tables = [
      "store_types",
      "event_trend_definitions",
      "rule_definitions",
      "baggage_definitions",
      "security_definitions",
      "toilet_definitions",
      "size_definitions",
      "floor_definitions",
      "seat_type_definitions",
      "smoking_definitions",
      "environment_definitions",
      "other_definitions",
      "price_range_definitions",
      "pricing_system_definitions",
      "discount_definitions",
      "vip_definitions",
      "payment_method_definitions",
      "sound_definitions",
      "lighting_definitions",
      "production_definitions",
      "food_definitions",
      "service_definitions",
      "customer_definitions",
      "atmosphere_definitions",
      "hospitality_definitions",
    ]

    const loadAll = async () => {
      const map = new Map<string, string>()

      for (const table of tables) {
        const { data } = await supabase
          .from(table)
          .select("id, label")
          .eq("is_active", true)

        data?.forEach((item: GenericMaster) => {
          map.set(item.id, item.label)
        })
      }

      setGenericMasters(map)
    }

    loadAll()
  }, [])

  // ✅ 外部ラベルマップここで完成させる
  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>()
    prefectures.forEach((p) => map.set(p.id, p.name_ja))
    areas.forEach((a) => map.set(a.id, a.name))
    drinkMasters.forEach((d) => map.set(d.key, d.label))
    genericMasters.forEach((v, k) => map.set(k, v))
    return map
  }, [prefectures, areas, drinkMasters, genericMasters])

  return { externalLabelMap }
}