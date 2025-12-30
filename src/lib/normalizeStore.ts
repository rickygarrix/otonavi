// lib/normalizeStore.ts
import type { HomeStore } from "@/types/store"
import type { StoreRow } from "@/types/store-db"

const asString = (v: unknown): string | null =>
  typeof v === "string" ? v : null

const asNumber = (v: unknown): number | null =>
  typeof v === "number" ? v : null

const asArray = <T>(v: unknown): T[] =>
  Array.isArray(v) ? (v as T[]) : []

type DefinitionRef = {
  key?: unknown
  label?: unknown
}

type M2MRow = Record<string, DefinitionRef | undefined>

function extractM2M(
  list: unknown,
  defKey: string
): { keys: string[]; labels: string[] } {
  const keys: string[] = []
  const labels: string[] = []

  if (!Array.isArray(list)) {
    return { keys, labels }
  }

  for (const row of list as M2MRow[]) {
    const def = row[defKey]
    if (!def) continue

    if (typeof def.key === "string") keys.push(def.key)
    if (typeof def.label === "string") labels.push(def.label)
  }

  return { keys, labels }
}

function selectImage(store_images: StoreRow["store_images"]): string {
  if (!store_images?.length) return "/noshop.svg"

  const main = store_images.find((i) => i.is_main)
  if (main?.image_url) return main.image_url

  const sorted = [...store_images].sort(
    (a, b) => (a.order_num ?? 999) - (b.order_num ?? 999)
  )

  return sorted[0]?.image_url ?? "/default_shop.svg"
}

export function normalizeStore(raw: StoreRow): HomeStore {
  const store_awards = asArray<{
    id?: unknown
    title?: unknown
    organization?: unknown
    year?: unknown
    url?: unknown
  }>(raw.store_awards).map((a) => ({
    id: String(a.id ?? ""),
    title: String(a.title ?? ""),
    organization: asString(a.organization),
    year: asNumber(a.year),
    url: asString(a.url),
  }))

  const store_media_mentions = asArray<{
    id?: unknown
    media_name?: unknown
    year?: unknown
  }>(raw.store_media_mentions).map((m) => ({
    id: String(m.id ?? ""),
    media_name: String(m.media_name ?? ""),
    year: asNumber(m.year),
  }))

  const drink = extractM2M(raw.store_drinks, "drink_definitions")

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

    price_range_id: raw.price_range_definitions?.id ?? null,
    price_range_label: raw.price_range_definitions?.label ?? null,

    payment_method_keys: extractM2M(
      raw.store_payment_methods,
      "payment_method_definitions"
    ).keys,
    payment_method_labels: extractM2M(
      raw.store_payment_methods,
      "payment_method_definitions"
    ).labels,
    payment_method_other: raw.payment_method_other,

    image_url: selectImage(raw.store_images),
    description: raw.description,

    instagram_url: raw.instagram_url,
    x_url: raw.x_url,
    facebook_url: raw.facebook_url,
    tiktok_url: raw.tiktok_url,
    official_site_url: raw.official_site_url,

    access: raw.access,
    google_map_url: raw.google_map_url,
    address: raw.address,
    postcode: raw.postcode,
    business_hours: raw.business_hours,

    hasAward: store_awards.length > 0,
    hasMedia: store_media_mentions.length > 0,
    store_awards,
    store_media_mentions,

    event_trend_keys: extractM2M(
      raw.store_event_trends,
      "event_trend_definitions"
    ).keys,
    event_trend_labels: extractM2M(
      raw.store_event_trends,
      "event_trend_definitions"
    ).labels,

    baggage_keys: extractM2M(raw.store_baggage, "baggage_definitions").keys,
    baggage_labels: extractM2M(raw.store_baggage, "baggage_definitions").labels,

    toilet_keys: extractM2M(raw.store_toilet, "toilet_definitions").keys,
    toilet_labels: extractM2M(raw.store_toilet, "toilet_definitions").labels,

    smoking_keys: extractM2M(raw.store_smoking, "smoking_definitions").keys,
    smoking_labels: extractM2M(raw.store_smoking, "smoking_definitions").labels,

    environment_keys: extractM2M(
      raw.store_environment,
      "environment_definitions"
    ).keys,
    environment_labels: extractM2M(
      raw.store_environment,
      "environment_definitions"
    ).labels,

    other_keys: extractM2M(raw.store_other, "other_definitions").keys,
    other_labels: extractM2M(raw.store_other, "other_definitions").labels,

    customer_keys: extractM2M(raw.store_customers, "customer_definitions").keys,
    customer_labels: extractM2M(
      raw.store_customers,
      "customer_definitions"
    ).labels,

    atmosphere_keys: extractM2M(
      raw.store_atmospheres,
      "atmosphere_definitions"
    ).keys,
    atmosphere_labels: extractM2M(
      raw.store_atmospheres,
      "atmosphere_definitions"
    ).labels,

    // ✅ ここが今回ちゃんと入る
    drink_keys: drink.keys,
    drink_labels: drink.labels,

    size_key: raw.size_definitions?.key ?? null,
    size_label: raw.size_definitions?.label ?? null,

    updated_at: raw.updated_at,
  }
}