// types/store-db.ts
export type DefinitionKV = {
  key: string
  label: string
}

export type StoreImageRow = {
  image_url: string | null
  is_main: boolean | null
  order_num: number | null
}

export type StoreRow = {
  id: string
  name: string
  name_kana: string | null
  updated_at: string
  description: string | null
  access: string | null
  google_map_url: string | null
  address: string | null

  instagram_url: string | null
  x_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  official_site_url: string | null

  business_hours: string | null

  prefecture: { id: string; name_ja: string } | null
  area: { id: string; name: string } | null

  store_type: { id: string; label: string } | null
  price_range: { id: string; label: string } | null
  size: DefinitionKV | null

  event_trends: { event_trend_definitions: DefinitionKV | null }[]
  store_images: StoreImageRow[]
}