// src/lib/normalize/normalizeSearchStore.ts
import type { StoreRow } from "@/types/store-db"
import type { SearchStore } from "@/types/store"

type DefinitionRef = {
  key?: unknown
  label?: unknown
  display_order?: unknown
}

type M2MRow = Record<string, DefinitionRef | undefined>

function extractKeys(list: unknown, defKey: string): string[] {
  if (!Array.isArray(list)) return []

  return (list as M2MRow[])
    .map((row) => row?.[defKey]?.key)
    .filter((k): k is string => typeof k === "string")
}

function selectImage(
  store_images: StoreRow["store_images"]
): string {
  if (!store_images?.length) return "/noshop.svg"

  const sorted = [...store_images].sort(
    (a, b) => (a.order_num ?? 999) - (b.order_num ?? 999)
  )

  return sorted[0]?.image_url ?? "/noshop.svg"
}

export function normalizeSearchStore(
  raw: StoreRow
): SearchStore {
  return {
    id: raw.id,
    name: raw.name,
    name_kana: raw.name_kana,

    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name_ja ?? null,

    area_id: raw.areas?.id ?? null,
    area_label: raw.areas?.name ?? null,

    store_type_id: raw.store_types?.id ?? null,
    type_label: raw.store_types?.label ?? null,

    // ★ サムネは order_num 最小
    image_url: selectImage(raw.store_images),

    price_range_key: raw.price_range_definitions?.key ?? null,
    size_key: raw.size_definitions?.key ?? null,

    customer_keys: extractKeys(raw.store_customers, "customer_definitions"),
    atmosphere_keys: extractKeys(raw.store_atmospheres, "atmosphere_definitions"),
    environment_keys: extractKeys(raw.store_environment, "environment_definitions"),
    drink_keys: extractKeys(raw.store_drinks, "drink_definitions"),
    payment_method_keys: extractKeys(raw.store_payment_methods, "payment_method_definitions"),
    event_trend_keys: extractKeys(raw.store_event_trends, "event_trend_definitions"),
    baggage_keys: extractKeys(raw.store_baggage, "baggage_definitions"),
    smoking_keys: extractKeys(raw.store_smoking, "smoking_definitions"),
    toilet_keys: extractKeys(raw.store_toilet, "toilet_definitions"),
    other_keys: extractKeys(raw.store_other, "other_definitions"),

    updated_at: raw.updated_at,
  }
}