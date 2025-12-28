"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { RegionKey } from "@/types/region"
import type { Prefecture, Area, DrinkDefinition, GenericMaster, } from "@/types/master"

const TABLE_TO_SECTION: Record<string, string> = {
  store_types: "店舗タイプ",
  event_trend_definitions: "イベントの傾向",
  baggage_definitions: "荷物預かり",
  toilet_definitions: "トイレ",
  size_definitions: "広さ",
  smoking_definitions: "喫煙",
  environment_definitions: "周辺環境",
  other_definitions: "その他",
  price_range_definitions: "価格帯",
  payment_method_definitions: "支払い方法",
  customer_definitions: "客層",
  atmosphere_definitions: "雰囲気",
}

// ================================
// Generic Master Loader（★ key を取る）
// ================================
async function loadGenericMasters() {
  const map = new Map<string, GenericMaster>()

  await Promise.all(
    Object.keys(TABLE_TO_SECTION).map(async (table) => {
      const { data, error } = await supabase
        .from(table)
        .select("id, key, label")
        .eq("is_active", true)

      if (error) {
        console.error(`loadGenericMasters error (${table}):`, error)
        return
      }

      data?.forEach((item) => {
        map.set(item.key, {
          id: item.id,
          key: item.key,
          label: item.label,
          table,
        })
      })
    })
  )

  return map
}

// ================================
// Hook
// ================================
export function useHomeMasters() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [drinkMasters, setDrinkMasters] = useState<DrinkDefinition[]>([])
  const [genericMasters, setGenericMasters] =
    useState<Map<string, GenericMaster>>(new Map())

  // ============================
  // 初期ロード
  // ============================
  useEffect(() => {
    const load = async () => {
      const [
        { data: prefData },
        { data: areaData },
        { data: drinkData },
      ] = await Promise.all([
        supabase.from("prefectures").select("id, name_ja, region"),
        supabase.from("areas").select("id, name, is_23ward"),
        supabase
          .from("drink_definitions")
          .select("key, label")
          .eq("is_active", true),
      ])

      setPrefectures(prefData ?? [])
      setAreas(areaData ?? [])
      setDrinkMasters(drinkData ?? [])

      const genericMap = await loadGenericMasters()
      setGenericMasters(genericMap)
    }

    load()
  }, [])

  // ============================
  // key / id → 表示ラベル（★ key 基準）
  // ============================
  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>()

    // prefecture / area は id
    prefectures.forEach((p) => map.set(p.id, p.name_ja))
    areas.forEach((a) => map.set(a.id, a.name))

    // drink / generic は key
    drinkMasters.forEach((d) => map.set(d.key, d.label))
    genericMasters.forEach((v) => map.set(v.key, v.label))

    return map
  }, [prefectures, areas, drinkMasters, genericMasters])

  // ============================
  // label → セクション名（スクロール用）
  // ============================
  const labelToSectionMap = useMemo(() => {
    const map = new Map<string, string>()

    genericMasters.forEach(({ label, table }) => {
      const section = TABLE_TO_SECTION[table]
      if (section) {
        map.set(label, section)
      }
    })

    prefectures.forEach((p) => map.set(p.name_ja, "エリア"))
    areas.forEach((a) => map.set(a.name, "エリア"))
    drinkMasters.forEach((d) => map.set(d.label, "ドリンク"))

    return map
  }, [genericMasters, prefectures, areas, drinkMasters])

  // ============================
  // 都道府県名 → 地方
  // ============================
  const prefectureRegionMap = useMemo(() => {
    const map = new Map<string, RegionKey>()
    prefectures.forEach((p) => {
      map.set(p.name_ja, p.region as RegionKey)
    })
    return map
  }, [prefectures])

  // ============================
  // エリア名 → Area
  // ============================
  const areaMap = useMemo(() => {
    const map = new Map<string, Area>()
    areas.forEach((a) => map.set(a.name, a))
    return map
  }, [areas])

  // ============================
  // return
  // ============================
  return {
    externalLabelMap,
    prefectureRegionMap,
    areaMap,
    labelToSectionMap,
  }
}