// lib/normalizeStore.ts
import type { HomeStore } from "@/types/store"

// ================================
// 型ガード / util
// ================================
type Rec = Record<string, unknown>

const isRec = (v: unknown): v is Rec =>
  typeof v === "object" && v !== null && !Array.isArray(v)

const asString = (v: unknown): string | null =>
  typeof v === "string" ? v : null

const asNumber = (v: unknown): number | null =>
  typeof v === "number" ? v : null

const asArray = (v: unknown): unknown[] =>
  Array.isArray(v) ? v : []

// ================================
// M2M definitions（key / label）
// ================================
type DefinitionKV = {
  key: string
  label: string
}

// ================================
// extract M2M helper
// ================================
function extractM2M(
  list: unknown,
  defKey: string
): { keys: string[]; labels: string[] } {
  const rows = asArray(list)

  const keys: string[] = []
  const labels: string[] = []

  for (const row of rows) {
    if (!isRec(row)) continue
    const def = row[defKey]
    if (!isRec(def)) continue

    const key = asString(def.key)
    const label = asString(def.label)

    if (key) keys.push(key)
    if (label) labels.push(label)
  }

  return { keys, labels }
}

// ================================
// normalize
// ================================
export function normalizeStore(raw: unknown): HomeStore {
  if (!isRec(raw)) {
    throw new Error("normalizeStore: raw is invalid")
  }

  const r = raw

  // =====================
  // 実績
  // =====================
  const store_awards = asArray(r.store_awards)
    .filter(isRec)
    .map((a) => ({
      id: String(a.id ?? ""),
      title: String(a.title ?? ""),
      organization: asString(a.organization),
      year: asNumber(a.year),
      url: asString(a.url),
    }))

  const store_media_mentions = asArray(r.store_media_mentions)
    .filter(isRec)
    .map((m) => ({
      id: String(m.id ?? ""),
      media_name: String(m.media_name ?? ""),
      year: asNumber(m.year),
    }))

  // =====================
  // return
  // =====================
  return {
    // ============================
    // 基本
    // ============================
    id: asString(r.id) ?? "",
    name: asString(r.name) ?? "",
    name_kana: asString(r.name_kana),

    prefecture_id: asString(r.prefecture_id),
    prefecture_label: isRec(r.prefectures)
      ? asString(r.prefectures.name_ja)
      : null,

    area_id: asString(r.area_id),
    area_label: isRec(r.areas)
      ? asString(r.areas.name)
      : null,

    store_type_id: asString(r.store_type_id),
    type_label: isRec(r.store_types)
      ? asString(r.store_types.label)
      : null,

    price_range_id: asString(r.price_range_id),
    price_range_label: isRec(r.price_range_definitions)
      ? asString(r.price_range_definitions.label)
      : null,

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

    business_hours: asString(r.business_hours),

    updated_at: asString(r.updated_at) ?? "",

    // ============================
    // 実績
    // ============================
    hasAward: store_awards.length > 0,
    hasMedia: store_media_mentions.length > 0,
    store_awards,
    store_media_mentions,

    // ============================
    // M2M（検索・表示用）
    // ============================
    event_trend_keys: extractM2M(
      r.store_event_trends,
      "event_trend_definitions"
    ).keys,
    event_trend_labels: extractM2M(
      r.store_event_trends,
      "event_trend_definitions"
    ).labels,

    baggage_keys: extractM2M(
      r.store_baggage,
      "baggage_definitions"
    ).keys,
    baggage_labels: extractM2M(
      r.store_baggage,
      "baggage_definitions"
    ).labels,

    toilet_keys: extractM2M(
      r.store_toilet,
      "toilet_definitions"
    ).keys,
    toilet_labels: extractM2M(
      r.store_toilet,
      "toilet_definitions"
    ).labels,

    smoking_keys: extractM2M(
      r.store_smoking,
      "smoking_definitions"
    ).keys,
    smoking_labels: extractM2M(
      r.store_smoking,
      "smoking_definitions"
    ).labels,

    environment_keys: extractM2M(
      r.store_environment,
      "environment_definitions"
    ).keys,
    environment_labels: extractM2M(
      r.store_environment,
      "environment_definitions"
    ).labels,

    other_keys: extractM2M(
      r.store_other,
      "other_definitions"
    ).keys,
    other_labels: extractM2M(
      r.store_other,
      "other_definitions"
    ).labels,


    payment_method_keys: extractM2M(
      r.store_payment_methods,
      "payment_method_definitions"
    ).keys,
    payment_method_labels: extractM2M(
      r.store_payment_methods,
      "payment_method_definitions"
    ).labels,

    payment_method_other: asString(r.payment_method_other),




    customer_keys: extractM2M(
      r.store_customers,
      "customer_definitions"
    ).keys,
    customer_labels: extractM2M(
      r.store_customers,
      "customer_definitions"
    ).labels,

    atmosphere_keys: extractM2M(
      r.store_atmospheres,
      "atmosphere_definitions"
    ).keys,
    atmosphere_labels: extractM2M(
      r.store_atmospheres,
      "atmosphere_definitions"
    ).labels,

    // ============================
    // ドリンク
    // ============================
    drink_keys: [],
    drink_labels: [],

    // ============================
    // 単一選択
    // ============================
    size_key: asString(r.size),
    size_label: isRec(r.size_definitions)
      ? asString(r.size_definitions.label)
      : null,
  }
}