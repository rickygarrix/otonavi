// lib/normalizeStore.ts
import type { HomeStore } from "@/types/store"

// ================================
// 共通の最低限型
// ================================
type DefinitionKV = {
  key: string
  label: string
  category?: string
}

type M2MRow = Record<string, DefinitionKV | null>

// ================================
// 配列: [{definitions: {key, label}}...] → { keys, labels }
// ================================
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

// ================================
// ドリンク（カテゴリ別）
// ================================
function extractDrinks(
  list: unknown
): {
  keys: string[]
  labels: string[]
  drink_categories: Record<string, { keys: string[]; labels: string[] }>
} {
  const keys: string[] = []
  const labels: string[] = []
  const categories: Record<string, { keys: string[]; labels: string[] }> = {}

  if (!Array.isArray(list)) {
    return { keys, labels, drink_categories: categories }
  }

  for (const row of list as { drink_definitions?: DefinitionKV | null }[]) {
    const def = row.drink_definitions
    if (!def || !def.category) continue

    keys.push(def.key)
    labels.push(def.label)

    if (!categories[def.category]) {
      categories[def.category] = { keys: [], labels: [] }
    }

    categories[def.category].keys.push(def.key)
    categories[def.category].labels.push(def.label)
  }

  return { keys, labels, drink_categories: categories }
}

// ================================
// stores SELECT 結果 → HomeStore
// ================================
export function normalizeStore(raw: unknown): HomeStore {
  if (!raw || typeof raw !== "object") {
    throw new Error("normalizeStore: raw is invalid")
  }

  const r = raw as Record<string, unknown>

  const prefecture_label =
    (r.prefectures as { name_ja?: string } | null)?.name_ja ?? null

  const area_label =
    (r.areas as { name?: string } | null)?.name ?? null

  const type_label =
    (r.store_types as { label?: string } | null)?.label ?? null

  const price_range_label =
    (r.price_range_definitions as { label?: string } | null)?.label ?? null

  const hospitality_label =
    (r.hospitality_definitions as { label?: string } | null)?.label ?? null

  const size_label =
    (r.size_definitions as { label?: string } | null)?.label ?? null

  // M2M
  const baggage = extractM2M(r.store_baggage, "baggage_definitions")
  const rules = extractM2M(r.store_rules, "rule_definitions")
  const event = extractM2M(r.store_event_trends, "event_trend_definitions")
  const security = extractM2M(r.store_security, "security_definitions")
  const toilet = extractM2M(r.store_toilet, "toilet_definitions")
  const floor = extractM2M(r.store_floor, "floor_definitions")
  const seat = extractM2M(r.store_seat_type, "seat_type_definitions")
  const smoking = extractM2M(r.store_smoking, "smoking_definitions")
  const environment = extractM2M(r.store_environment, "environment_definitions")
  const other = extractM2M(r.store_other, "other_definitions")
  const pricing = extractM2M(r.store_pricing_system, "pricing_system_definitions")
  const discount = extractM2M(r.store_discounts, "discount_definitions")
  const vip = extractM2M(r.store_vips, "vip_definitions")
  const payment = extractM2M(r.store_payment_methods, "payment_method_definitions")
  const sound = extractM2M(r.store_sounds, "sound_definitions")
  const lighting = extractM2M(r.store_lightings, "lighting_definitions")
  const production = extractM2M(r.store_productions, "production_definitions")
  const customers = extractM2M(r.store_customers, "customer_definitions")
  const atmos = extractM2M(r.store_atmospheres, "atmosphere_definitions")
  const food = extractM2M(r.store_foods, "food_definitions")
  const service = extractM2M(r.store_services, "service_definitions")

  const drinks = extractDrinks(r.store_drinks)

  return {
    id: asString(r.id) ?? "",
    name: asString(r.name) ?? "",
    name_kana: asString(r.name_kana),

    prefecture_id: asString(r.prefecture_id),
    prefecture_label,

    area_id: asString(r.area_id),
    area_label,

    store_type_id: asString(r.store_type_id),
    type_label,

    price_range_id: asString(r.price_range_id),
    price_range_label,

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

    event_trend_keys: event.keys,
    event_trend_labels: event.labels,
    rule_keys: rules.keys,
    rule_labels: rules.labels,
    baggage_keys: baggage.keys,
    baggage_labels: baggage.labels,
    security_keys: security.keys,
    security_labels: security.labels,
    toilet_keys: toilet.keys,
    toilet_labels: toilet.labels,
    floor_keys: floor.keys,
    floor_labels: floor.labels,
    seat_type_keys: seat.keys,
    seat_type_labels: seat.labels,
    smoking_keys: smoking.keys,
    smoking_labels: smoking.labels,
    environment_keys: environment.keys,
    environment_labels: environment.labels,
    other_keys: other.keys,
    other_labels: other.labels,
    pricing_system_keys: pricing.keys,
    pricing_system_labels: pricing.labels,
    discount_keys: discount.keys,
    discount_labels: discount.labels,
    vip_keys: vip.keys,
    vip_labels: vip.labels,
    payment_method_keys: payment.keys,
    payment_method_labels: payment.labels,
    sound_keys: sound.keys,
    sound_labels: sound.labels,
    lighting_keys: lighting.keys,
    lighting_labels: lighting.labels,
    production_keys: production.keys,
    production_labels: production.labels,
    customer_keys: customers.keys,
    customer_labels: customers.labels,
    atmosphere_keys: atmos.keys,
    atmosphere_labels: atmos.labels,
    food_keys: food.keys,
    food_labels: food.labels,
    service_keys: service.keys,
    service_labels: service.labels,

    drink_keys: drinks.keys,
    drink_labels: drinks.labels,
    drink_categories: drinks.drink_categories,

    hospitality_key: asString(r.hospitality),
    hospitality_label,

    size_key: asString(r.size),
    size_label,

    hasAward: Array.isArray(r.store_awards) && r.store_awards.length > 0,
    hasMedia: Array.isArray(r.store_media_mentions) && r.store_media_mentions.length > 0,
  }
}