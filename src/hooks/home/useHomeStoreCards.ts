"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { HomeStoreLite } from "@/types/store"
import { normalizeHomeStore } from "@/lib/normalize/normalizeHomeStore"

export function useHomeStoreCards(limit = 12) {
  const [stores, setStores] = useState<HomeStoreLite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("stores")
        .select(`
          id,
          name,
          updated_at,

          prefectures ( id, name_ja ),
          areas ( id, name ),
          store_types ( id, label ),

          store_images (
            image_url,
            is_main,
            order_num
          )
        `)
        .order("updated_at", { ascending: false })
        .limit(limit)

      if (!mounted) return

      if (error || !data) {
        setError(error ?? new Error("Failed to load home store cards"))
        setStores([])
        setLoading(false)
        return
      }

      setStores(data.map(normalizeHomeStore))
      setLoading(false)
    }

    load()

    return () => {
      mounted = false
    }
  }, [limit])

  return { stores, loading, error }
}