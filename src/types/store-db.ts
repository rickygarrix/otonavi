// src/types/store-db.ts
import type { DefinitionKV } from "./common"

export type IdLabelRow = {
  id: string
  label: string
}

export type IdNameRow = {
  id: string
  name: string
}

export type PrefectureRow = {
  id: string
  name_ja: string
}

export type StoreImageRow = {
  image_url: string | null
  is_main: boolean | null
  order_num: number | null
}

export type M2MRow<T extends string> = {
  [K in T]: DefinitionKV | null
}

export type StoreRow = {
  // ===== Core =====
  id: string
  name: string
  name_kana: string | null
  updated_at: string

  // ===== Text / Info =====
  description: string | null
  access: string | null
  google_map_url: string | null
  address: string | null
  postcode: string | null
  business_hours: string | null

  // ===== SNS / Web =====
  instagram_url: string | null
  x_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  official_site_url: string | null

  // ===== Other =====
  payment_method_other: string | null

  // ===== 1:N / FK =====
  prefectures: PrefectureRow | null
  areas: IdNameRow | null
  store_types: IdLabelRow | null
  price_range_definitions: DefinitionKV | null
  size_definitions: DefinitionKV | null

  // ===== M:N =====
  store_event_trends: M2MRow<"event_trend_definitions">[]
  store_baggage: M2MRow<"baggage_definitions">[]
  store_toilet: M2MRow<"toilet_definitions">[]
  store_smoking: M2MRow<"smoking_definitions">[]
  store_environment: M2MRow<"environment_definitions">[]
  store_other: M2MRow<"other_definitions">[]
  store_payment_methods: M2MRow<"payment_method_definitions">[]
  store_customers: M2MRow<"customer_definitions">[]
  store_atmospheres: M2MRow<"atmosphere_definitions">[]
  store_drinks: M2MRow<"drink_definitions">[]

  // ===== Images =====
  store_images: StoreImageRow[]

  // ===== Optional =====
  store_awards?: unknown[]
  store_media_mentions?: unknown[]
}