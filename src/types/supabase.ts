export type RawHomeStore = {
  id: string
  name: string
  area: { name: string }[] | { name: string } | null
  store_type: { name: string }[] | { name: string } | null
  images: {
    image_url: string
    is_main: boolean
    order_num: number
  }[] | null
}