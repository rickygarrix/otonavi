// lib/normalize/normalizeStoreDetail.ts
import type { StoreRow } from "@/types/store-db"
import type { HomeStore } from "@/types/store"

const asString = (v: unknown): string | null =>
  typeof v === "string" ? v : null

const asNumber = (v: unknown): number | null =>
  typeof v === "number" ? v : null

const asArray = <T>(v: unknown): T[] =>
  Array.isArray(v) ? (v as T[]) : []

type DefinitionRef = {
  key?: unknown
  label?: unknown
  display_order?: unknown
}

type M2MRow = Record<string, DefinitionRef | undefined>

function extractM2MOrdered(
  list: unknown,
  defKey: string
): { keys: string[]; labels: string[] } {
  if (!Array.isArray(list)) {
    return { keys: [], labels: [] }
  }

  const defs = (list as M2MRow[])
    .map((row) => row?.[defKey])
    .filter(
      (d): d is {
        key: string
        label: string
        display_order?: number
      } =>
        typeof d?.key === "string" &&
        typeof d?.label === "string"
    )
    .sort(
      (a, b) =>
        (a.display_order ?? 0) - (b.display_order ?? 0)
    )

  return {
    keys: defs.map((d) => d.key),
    labels: defs.map((d) => d.label),
  }
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

type StoreAwardRow = {
  id?: unknown
  title?: unknown
  organization?: unknown
  year?: unknown
  url?: unknown
}

type StoreMediaRow = {
  id?: unknown
  media_name?: unknown
  year?: unknown
}

export function normalizeStoreDetail(
  raw: StoreRow
): HomeStore {
  const store_awards = asArray<StoreAwardRow>(
    raw.store_awards
  ).map((a) => ({
    id: String(a.id ?? ""),
    title: String(a.title ?? ""),
    organization: asString(a.organization),
    year: asNumber(a.year),
    url: asString(a.url),
  }))

  const store_media_mentions = asArray<StoreMediaRow>(
    raw.store_media_mentions
  ).map((m) => ({
    id: String(m.id ?? ""),
    media_name: String(m.media_name ?? ""),
    year: asNumber(m.year),
  }))

  const drinks = extractM2MOrdered(
    raw.store_drinks,
    "drink_definitions"
  )

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

    price_range_key: raw.price_range_definitions?.key ?? null,
    price_range_label: raw.price_range_definitions?.label ?? null,

    payment_method_keys: extractM2MOrdered(
      raw.store_payment_methods,
      "payment_method_definitions"
    ).keys,
    payment_method_labels: extractM2MOrdered(
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

    event_trend_keys: extractM2MOrdered(
      raw.store_event_trends,
      "event_trend_definitions"
    ).keys,
    event_trend_labels: extractM2MOrdered(
      raw.store_event_trends,
      "event_trend_definitions"
    ).labels,

    baggage_keys: extractM2MOrdered(
      raw.store_baggage,
      "baggage_definitions"
    ).keys,
    baggage_labels: extractM2MOrdered(
      raw.store_baggage,
      "baggage_definitions"
    ).labels,

    toilet_keys: extractM2MOrdered(
      raw.store_toilet,
      "toilet_definitions"
    ).keys,
    toilet_labels: extractM2MOrdered(
      raw.store_toilet,
      "toilet_definitions"
    ).labels,

    smoking_keys: extractM2MOrdered(
      raw.store_smoking,
      "smoking_definitions"
    ).keys,
    smoking_labels: extractM2MOrdered(
      raw.store_smoking,
      "smoking_definitions"
    ).labels,

    environment_keys: extractM2MOrdered(
      raw.store_environment,
      "environment_definitions"
    ).keys,
    environment_labels: extractM2MOrdered(
      raw.store_environment,
      "environment_definitions"
    ).labels,

    other_keys: extractM2MOrdered(
      raw.store_other,
      "other_definitions"
    ).keys,
    other_labels: extractM2MOrdered(
      raw.store_other,
      "other_definitions"
    ).labels,

    customer_keys: extractM2MOrdered(
      raw.store_customers,
      "customer_definitions"
    ).keys,
    customer_labels: extractM2MOrdered(
      raw.store_customers,
      "customer_definitions"
    ).labels,

    atmosphere_keys: extractM2MOrdered(
      raw.store_atmospheres,
      "atmosphere_definitions"
    ).keys,
    atmosphere_labels: extractM2MOrdered(
      raw.store_atmospheres,
      "atmosphere_definitions"
    ).labels,

    drink_keys: drinks.keys,
    drink_labels: drinks.labels,

    size_key: raw.size_definitions?.key ?? null,
    size_label: raw.size_definitions?.label ?? null,

    updated_at: raw.updated_at,
  }
}