export type OpenHour = {
  day_of_week: string // mon / tue / wed ...
  open_time: string | null
  close_time: string | null
  last_order_time: string | null
  is_closed: boolean
}

export type SpecialOpenHour = {
  date: string // YYYY-MM-DD
  open_time: string | null
  close_time: string | null
  last_order_time: string | null
  is_closed: boolean
  reason: string | null
}

export type HomeStore = {
  id: string
  name: string
  name_kana: string | null

  prefecture: string | null
  area: string | null
  type: string | null
  image_url: string | null
  description: string | null

  instagram_url: string | null
  x_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  official_site_url: string | null

  access: string | null
  google_map_url: string | null
  address: string | null

  open_hours: OpenHour[]
  special_hours: SpecialOpenHour[]
}