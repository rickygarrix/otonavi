// src/hooks/useHomeStores.ts
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
          description,

          prefecture:prefecture_id (
            name_ja
          ),

          area:area_id (
            name
          ),

          store_type:store_type_id (
            label
          ),

          store_images (
            image_url,
            is_main,
            order_num
          )
        `)

      if (error) {
        console.error('Supabase error:', error)
        setLoading(false)
        return
      }

      const formatted: HomeStore[] = (data ?? []).map((s: any) => {
        //===== 都道府県 =====
        const prefectureName =
          Array.isArray(s.prefecture)
            ? s.prefecture[0]?.name_ja ?? null
            : s.prefecture?.name_ja ?? null

        //===== エリア =====
        const areaName =
          Array.isArray(s.area)
            ? s.area[0]?.name ?? null
            : s.area?.name ?? null

        //===== タイプ =====
        const typeName =
          Array.isArray(s.store_type)
            ? s.store_type[0]?.label ?? null
            : s.store_type?.label ?? null

        //===== メイン画像 or 最初の画像 or default =====
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

        // デフォルト画像
        if (!imageUrl) {
          imageUrl = '/default_shop.svg'
        }

        return {
          id: s.id,
          name: s.name,
          prefecture: prefectureName,
          area: areaName,
          type: typeName,
          image_url: imageUrl,
          description: s.description ?? null,
        }
      })

      setStores(formatted)
      setLoading(false)
    }

    load()
  }, [])

  return { stores, loading }
}