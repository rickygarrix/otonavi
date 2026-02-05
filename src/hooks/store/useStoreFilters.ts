// src/hooks/store/useStoreFilters.ts
'use client';

import { useMemo } from 'react';
import type { SearchStore } from '@/types/store';

type Options = {
  filters?: string[];
};

export function useStoreFilters(
  stores: SearchStore[],
  options: Options = {},
) {
  const { filters = [] } = options;

  const filteredStores = useMemo(() => {
    if (!filters.length) return stores;

    return stores.filter((store) => {
      const storeKeys = [
        store.venue_type_key,   // ★ venue_type も filters に統合
        store.prefecture_id,
        store.city_id,
        store.price_range_key,
        store.size_key,

        ...store.customer_keys,
        ...store.atmosphere_keys,
        ...store.environment_keys,
        ...store.drink_keys,
        ...store.payment_method_keys,
        ...store.event_trend_keys,
        ...store.baggage_keys,
        ...store.smoking_keys,
        ...store.toilet_keys,
        ...store.other_keys,
      ].filter(Boolean);

      // AND 条件
      return filters.every((f) => storeKeys.includes(f));
    });
  }, [stores, filters]);

  return { filteredStores };
}
