"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Area, RegionKey, Prefecture } from "@/types/location"
import type { DrinkDefinition, GenericMaster } from "@/types/master"

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

type GenericMasterRow = {
  id: string
  key: string
  label: string
  display_order: number
}

async function loadGenericMasters(): Promise<Map<string, GenericMaster>> {
  const map = new Map<string, GenericMaster>()

  await Promise.all(
    Object.keys(TABLE_TO_SECTION).map(async (table) => {
      const { data, error } = await supabase
        .from(table)
        .select("id, key, label, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) {
        return
      }

      ; (data as GenericMasterRow[] | null)?.forEach((item) => {
        const mapKey = `${table}:${item.key}`

        map.set(mapKey, {
          id: item.id,
          key: item.key,
          label: item.label,
          table,
          display_order: item.display_order,
        })
      })
    })
  )

  return map
}

export function useHomeMasters() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [drinkMasters, setDrinkMasters] = useState<DrinkDefinition[]>([])
  const [genericMasters, setGenericMasters] =
    useState<Map<string, GenericMaster>>(new Map())

  useEffect(() => {
    const load = async () => {
      const [
        { data: prefData },
        { data: areaData },
        { data: drinkData },
      ] = await Promise.all([
        supabase
          .from("prefectures")
          .select("id, name_ja, region, code")
          .order("code", { ascending: true }),
        supabase
          .from("areas")
          .select("id, name, is_23ward, display_order")
          .order("display_order", { ascending: true }),
        supabase
          .from("drink_definitions")
          .select("key, label, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true }),
      ])

      setPrefectures(prefData ?? [])
      setAreas(areaData ?? [])
      setDrinkMasters((drinkData ?? []) as DrinkDefinition[])

      const genericMap = await loadGenericMasters()
      setGenericMasters(genericMap)
    }

    load()
  }, [])

  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>()

    prefectures.forEach((p) => map.set(p.id, p.name_ja))
    areas.forEach((a) => map.set(a.id, a.name))
    drinkMasters.forEach((d) => map.set(d.key, d.label))
    genericMasters.forEach((v) => map.set(v.key, v.label))

    return map
  }, [prefectures, areas, drinkMasters, genericMasters])

  const labelToSectionMap = useMemo(() => {
    const map = new Map<string, string>()

    genericMasters.forEach(({ label, table }) => {
      const section = TABLE_TO_SECTION[table]
      if (section) map.set(label, section)
    })

    prefectures.forEach((p) => map.set(p.name_ja, "エリア"))
    areas.forEach((a) => map.set(a.name, "エリア"))
    drinkMasters.forEach((d) => map.set(d.label, "ドリンク"))

    return map
  }, [genericMasters, prefectures, areas, drinkMasters])

  const prefectureRegionMap = useMemo(() => {
    const map = new Map<string, RegionKey>()
    prefectures.forEach((p) => map.set(p.name_ja, p.region))
    return map
  }, [prefectures])

  const areaMap = useMemo(() => {
    const map = new Map<string, Area>()
    areas.forEach((a) => map.set(a.name, a))
    return map
  }, [areas])

  return {
    externalLabelMap,
    labelToSectionMap,
    prefectureRegionMap,
    areaMap,
    genericMasters,
    drinkMasters,
  }
}