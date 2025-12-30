// src/types/store.ts

export type StoreType = "club" | "bar" | "livehouse" | "other"

export type StoreAward = {
  id: string
  title: string
  organization: string | null
  year: number | null
  url: string | null
}

export type StoreMediaMention = {
  id: string
  media_name: string
  year: number | null
}

export type HomeStore = {

  id: string
  name: string
  name_kana: string | null

  prefecture_id: string | null
  prefecture_label: string | null

  area_id: string | null
  area_label: string | null

  store_type_id: string | null
  type_label: string | null

  price_range_key: string | null
  price_range_label: string | null

  payment_method_keys: string[]
  payment_method_labels: string[]
  payment_method_other: string | null

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
  postcode: string | null
  business_hours: string | null

  hasAward: boolean
  hasMedia: boolean
  store_awards: StoreAward[]
  store_media_mentions: StoreMediaMention[]

  event_trend_keys: string[]
  event_trend_labels: string[]

  baggage_keys: string[]
  baggage_labels: string[]

  toilet_keys: string[]
  toilet_labels: string[]

  smoking_keys: string[]
  smoking_labels: string[]

  environment_keys: string[]
  environment_labels: string[]

  other_keys: string[]
  other_labels: string[]

  customer_keys: string[]
  customer_labels: string[]

  atmosphere_keys: string[]
  atmosphere_labels: string[]

  drink_keys: string[]
  drink_labels: string[]

  size_key: string | null
  size_label: string | null

  updated_at: string
}