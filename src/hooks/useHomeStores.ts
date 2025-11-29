'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { HomeStore } from '@/types/store'

export function useHomeStores() {
  const [stores, setStores] = useState<HomeStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          id,
          name,
          name_kana,
          description,
          access,
          google_map_url,
          address,
          instagram_url,
          x_url,
          facebook_url,
          tiktok_url,
          official_site_url,

          open_hours:store_open_hours (
            day_of_week,
            open_time,
            close_time,
            last_order_time,
            is_closed
          ),

          special_hours:store_special_open_hours (
            date,
            open_time,
            close_time,
            last_order_time,
            is_closed,
            reason
          ),

          prefecture:prefecture_id ( name_ja ),
          area:area_id ( name ),
          store_type:store_type_id ( label ),

          store_images ( image_url, is_main, order_num )
        `)

      if (error) {
        console.error('Supabase error:', error)
        setLoading(false)
        return
      }

      const formatted: HomeStore[] = (data ?? []).map((s: any) => {
        // === 画像処理 ===
        let imageUrl: string | null = null
        if (Array.isArray(s.store_images) && s.store_images.length > 0) {
          const main = s.store_images.find((img: any) => img.is_main)
          if (main) {
            imageUrl = main.image_url
          } else {
            const sorted = [...s.store_images].sort(
              (a, b) => (a.order_num ?? 999) - (b.order_num ?? 999)
            )
            imageUrl = sorted[0]?.image_url ?? null
          }
        }
        if (!imageUrl) imageUrl = '/default_shop.svg'

        return {
          id: s.id,
          name: s.name,
          name_kana: s.name_kana ?? null,

          prefecture:
            Array.isArray(s.prefecture)
              ? s.prefecture[0]?.name_ja ?? null
              : s.prefecture?.name_ja ?? null,

          area:
            Array.isArray(s.area)
              ? s.area[0]?.name ?? null
              : s.area?.name ?? null,

          type:
            Array.isArray(s.store_type)
              ? s.store_type[0]?.label ?? null
              : s.store_type?.label ?? null,

          image_url: imageUrl,
          description: s.description ?? null,

          instagram_url: s.instagram_url ?? null,
          x_url: s.x_url ?? null,
          facebook_url: s.facebook_url ?? null,
          tiktok_url: s.tiktok_url ?? null,
          official_site_url: s.official_site_url ?? null,

          access: s.access ?? null,
          google_map_url: s.google_map_url ?? null,
          address: s.address ?? null,

          open_hours: s.open_hours ?? [],
          special_hours: s.special_hours ?? [],
        }
      })

      setStores(formatted)
      setLoading(false)
    }

    load()
  }, [])

  return { stores, loading }
}