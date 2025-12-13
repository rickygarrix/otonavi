// lib/normalizeStore.ts
import type { HomeStore } from "@/types/store"

type DefinitionKV = {
  key: string
  label: string
  category?: string
}

type M2MRow = Record<string, DefinitionKV | null>

function extractM2M(
  list: unknown,
  defKey: string
): { keys: string[]; labels: string[] } {
  if (!Array.isArray(list)) return { keys: [], labels: [] }

  const keys: string[] = []
  const labels: string[] = []

  for (const row of list as M2MRow[]) {
    const def = row[defKey]
    if (!def) continue
    if (def.key) keys.push(def.key)
    if (def.label) labels.push(def.label)
  }

  return { keys, labels }
}

const asString = (v: unknown): string | null =>
  typeof v === "string" ? v : null

const asArray = <T>(v: unknown): T[] =>
  Array.isArray(v) ? (v as T[]) : []

export function normalizeStore(raw: unknown): HomeStore {
  if (!raw || typeof raw !== "object") {
    throw new Error("normalizeStore: raw is invalid")
  }

  const r = raw as any

  const awards = Array.isArray(r.store_awards)
    ? r.store_awards.map((a: any) => ({
      id: String(a.id),
      title: String(a.title),
      organization: a.organization ?? null,
      year: typeof a.year === "number" ? a.year : null,
      url: a.url ?? null,
    }))
    : []
  const media = Array.isArray(r.store_media_mentions)
    ? r.store_media_mentions.map((m: any) => ({
      id: String(m.id),
      media_name: String(m.media_name),
      year: typeof m.year === "number" ? m.year : null,
    }))
    : []

  return {
    id: asString(r.id) ?? "",
    name: asString(r.name) ?? "",
    name_kana: asString(r.name_kana),

    prefecture_id: asString(r.prefecture_id),
    prefecture_label: r.prefectures?.name_ja ?? null,

    area_id: asString(r.area_id),
    area_label: r.areas?.name ?? null,

    store_type_id: asString(r.store_type_id),
    type_label: r.store_types?.label ?? null,

    price_range_id: asString(r.price_range_id),
    price_range_label: r.price_range_definitions?.label ?? null,

    image_url: asString(r.image_url) ?? "",
    description: asString(r.description),

    instagram_url: asString(r.instagram_url),
    x_url: asString(r.x_url),
    facebook_url: asString(r.facebook_url),
    tiktok_url: asString(r.tiktok_url),
    official_site_url: asString(r.official_site_url),

    access: asString(r.access),
    google_map_url: asString(r.google_map_url),
    address: asString(r.address),

    open_hours: asArray(r.store_open_hours),
    special_hours: asArray(r.store_special_open_hours),

    updated_at: asString(r.updated_at) ?? "",

    // ===== 実績 =====
    hasAward: awards.length > 0,
    hasMedia: media.length > 0,
    store_awards: awards,
    store_media_mentions: media,

    // ===== 以下 M2M は今まで通り =====
    event_trend_keys: extractM2M(r.store_event_trends, "event_trend_definitions").keys,
    event_trend_labels: extractM2M(r.store_event_trends, "event_trend_definitions").labels,
    rule_keys: extractM2M(r.store_rules, "rule_definitions").keys,
    rule_labels: extractM2M(r.store_rules, "rule_definitions").labels,

    baggage_keys: extractM2M(r.store_baggage, "baggage_definitions").keys,
    baggage_labels: extractM2M(r.store_baggage, "baggage_definitions").labels,

    security_keys: extractM2M(r.store_security, "security_definitions").keys,
    security_labels: extractM2M(r.store_security, "security_definitions").labels,

    toilet_keys: extractM2M(r.store_toilet, "toilet_definitions").keys,
    toilet_labels: extractM2M(r.store_toilet, "toilet_definitions").labels,

    floor_keys: extractM2M(r.store_floor, "floor_definitions").keys,
    floor_labels: extractM2M(r.store_floor, "floor_definitions").labels,

    seat_type_keys: extractM2M(r.store_seat_type, "seat_type_definitions").keys,
    seat_type_labels: extractM2M(r.store_seat_type, "seat_type_definitions").labels,

    smoking_keys: extractM2M(r.store_smoking, "smoking_definitions").keys,
    smoking_labels: extractM2M(r.store_smoking, "smoking_definitions").labels,

    environment_keys: extractM2M(r.store_environment, "environment_definitions").keys,
    environment_labels: extractM2M(r.store_environment, "environment_definitions").labels,

    other_keys: extractM2M(r.store_other, "other_definitions").keys,
    other_labels: extractM2M(r.store_other, "other_definitions").labels,

    pricing_system_keys: extractM2M(r.store_pricing_system, "pricing_system_definitions").keys,
    pricing_system_labels: extractM2M(r.store_pricing_system, "pricing_system_definitions").labels,

    discount_keys: extractM2M(r.store_discounts, "discount_definitions").keys,
    discount_labels: extractM2M(r.store_discounts, "discount_definitions").labels,

    vip_keys: extractM2M(r.store_vips, "vip_definitions").keys,
    vip_labels: extractM2M(r.store_vips, "vip_definitions").labels,

    payment_method_keys: extractM2M(r.store_payment_methods, "payment_method_definitions").keys,
    payment_method_labels: extractM2M(r.store_payment_methods, "payment_method_definitions").labels,

    sound_keys: extractM2M(r.store_sounds, "sound_definitions").keys,
    sound_labels: extractM2M(r.store_sounds, "sound_definitions").labels,

    lighting_keys: extractM2M(r.store_lightings, "lighting_definitions").keys,
    lighting_labels: extractM2M(r.store_lightings, "lighting_definitions").labels,

    production_keys: extractM2M(r.store_productions, "production_definitions").keys,
    production_labels: extractM2M(r.store_productions, "production_definitions").labels,

    customer_keys: extractM2M(r.store_customers, "customer_definitions").keys,
    customer_labels: extractM2M(r.store_customers, "customer_definitions").labels,

    atmosphere_keys: extractM2M(r.store_atmospheres, "atmosphere_definitions").keys,
    atmosphere_labels: extractM2M(r.store_atmospheres, "atmosphere_definitions").labels,

    food_keys: extractM2M(r.store_foods, "food_definitions").keys,
    food_labels: extractM2M(r.store_foods, "food_definitions").labels,

    service_keys: extractM2M(r.store_services, "service_definitions").keys,
    service_labels: extractM2M(r.store_services, "service_definitions").labels,

    drink_keys: [],
    drink_labels: [],
    drink_categories: {},

    hospitality_key: asString(r.hospitality),
    hospitality_label: r.hospitality_definitions?.label ?? null,

    size_key: asString(r.size),
    size_label: r.size_definitions?.label ?? null,
  }
}