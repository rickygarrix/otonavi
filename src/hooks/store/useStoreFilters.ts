"use client"

import { useMemo } from "react"
import type { SearchStore } from "@/types/store"

type Options = {
  filters?: string[]
  storeTypeId?: string | null
}

export function useStoreFilters(
  stores: SearchStore[],
  options?: Options
) {
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {

      // ===== storeType =====
      if (
        options?.storeTypeId &&
        store.store_type_id !== options.storeTypeId
      ) {
        return false
      }

      if (!options?.filters?.length) {
        return true
      }

      // ===== グループ別キー =====
      const groups = {
        area: [store.prefecture_id, store.area_id].filter(Boolean),
        price: [store.price_range_key].filter(Boolean),
        size: [store.size_key].filter(Boolean),

        customer: store.customer_keys,
        atmosphere: store.atmosphere_keys,
        environment: store.environment_keys,
        drink: store.drink_keys,
        payment: store.payment_method_keys,
        event: store.event_trend_keys,
        baggage: store.baggage_keys,
        smoking: store.smoking_keys,
        toilet: store.toilet_keys,
        other: store.other_keys,
      }

      // ===== filters をグループ単位で判定 =====
      for (const filter of options.filters) {
        const hit = Object.values(groups).some((keys) =>
          keys.includes(filter)
        )

        if (!hit) {
          return false
        }
      }

      return true
    })
  }, [stores, options?.filters, options?.storeTypeId])

  return { filteredStores }
}