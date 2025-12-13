// ============================
// 営業時間（通常）
// ============================
export type StoreOpenHour = {
  day_of_week: number            // 0=日, 1=月 ...
  open_time: string | null       // "18:00"
  close_time: string | null      // "02:00"
  last_order_time: string | null // "01:30"
  is_closed: boolean
}

// ============================
// 営業時間（特別）
// ============================
export type StoreSpecialOpenHour = {
  start_date: string             // "2025-12-24"
  end_date: string               // "2025-12-25"
  open_time: string | null
  close_time: string | null
  last_order_time: string | null
  is_closed: boolean
  reason: string | null           // "クリスマス特別営業"
}

// ============================
// Home 一覧用 Store 型
// ============================
export type HomeStore = {
  id: string
  name: string
  name_kana: string | null

  // ============================
  // エリア系（id = 検索 / label = 表示）
  // ============================
  prefecture_id: string | null
  prefecture_label: string | null

  area_id: string | null
  area_label: string | null

  // ============================
  // 店舗タイプ
  // ============================
  store_type_id: string | null
  type_label: string | null

  // ============================
  // 価格帯
  // ============================
  price_range_id: string | null
  price_range_label: string | null

  // ============================
  // 基本情報
  // ============================
  image_url: string
  description: string | null

  instagram_url: string | null
  x_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  official_site_url: string | null

  access: string | null
  google_map_url: string | null
  address: string | null

  // ============================
  // 営業時間
  // ============================
  open_hours: StoreOpenHour[]
  special_hours: StoreSpecialOpenHour[]

  // ============================
  // 実績
  // ============================
  hasAward: boolean
  hasMedia: boolean
  store_awards?: {
    id: string
    title: string
    organization: string | null
    year: number | null
    url: string | null
  }[]

  store_media_mentions?: {
    id: string
    media_name: string
    title: string | null
    published_at: string | null
    url: string | null
  }[]

  updated_at: string

  // ============================
  // M2M（keys = 検索 / labels = 表示）
  // ============================
  event_trend_keys: string[]
  event_trend_labels: string[]

  rule_keys: string[]
  rule_labels: string[]

  seat_type_keys: string[]
  seat_type_labels: string[]

  smoking_keys: string[]
  smoking_labels: string[]

  environment_keys: string[]
  environment_labels: string[]

  other_keys: string[]
  other_labels: string[]

  baggage_keys: string[]
  baggage_labels: string[]

  security_keys: string[]
  security_labels: string[]

  toilet_keys: string[]
  toilet_labels: string[]

  floor_keys: string[]
  floor_labels: string[]

  pricing_system_keys: string[]
  pricing_system_labels: string[]

  discount_keys: string[]
  discount_labels: string[]

  vip_keys: string[]
  vip_labels: string[]

  payment_method_keys: string[]
  payment_method_labels: string[]

  sound_keys: string[]
  sound_labels: string[]

  lighting_keys: string[]
  lighting_labels: string[]

  production_keys: string[]
  production_labels: string[]

  customer_keys: string[]
  customer_labels: string[]

  atmosphere_keys: string[]
  atmosphere_labels: string[]

  food_keys: string[]
  food_labels: string[]

  service_keys: string[]
  service_labels: string[]

  // ============================
  // ドリンク（カテゴリ対応）
  // ============================
  drink_keys: string[]
  drink_labels: string[]
  drink_categories: Record<
    string,
    {
      keys: string[]
      labels: string[]
    }
  >

  // ============================
  // 単一選択系
  // ============================
  hospitality_key: string | null
  hospitality_label: string | null

  size_key: string | null
  size_label: string | null
}