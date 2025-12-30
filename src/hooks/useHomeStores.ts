"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { HomeStore } from "@/types/store"
import { normalizeStore } from "@/lib/normalizeStore"

export function useHomeStores() {
  const [stores, setStores] = useState<HomeStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("stores")
        .select(`
          *,
          prefectures ( id, name_ja ),
          areas ( id, name ),
          store_types ( id, label ),
          price_range_definitions ( key, label, display_order ),
          size_definitions ( key, label ),

          store_customers (
            customer_definitions ( key, label )
          ),

          store_atmospheres (
            atmosphere_definitions ( key, label )
          ),

          store_drinks (
            drink_definitions ( key, label, display_order )
          ),

          store_baggage (
            baggage_definitions ( key, label )
          ),

          store_toilet (
            toilet_definitions ( key, label )
          ),


          store_smoking (
            smoking_definitions ( key, label )
          ),

          store_environment (
            environment_definitions ( key, label )
          ),

          store_other (
            other_definitions ( key, label )
          ),

          store_event_trends (
            event_trend_definitions ( key, label )
          ),

          store_payment_methods (
            payment_method_definitions ( key, label )
          ),

          store_images (
            image_url,
            is_main,
            order_num
          )
        `)

      if (error || !data) {
        console.error("useHomeStores load error:", error)
        setStores([])
        setLoading(false)
        return
      }

      setStores(data.map(normalizeStore))
      setLoading(false)
    }

    load()
  }, [])

  return { stores, loading }
}