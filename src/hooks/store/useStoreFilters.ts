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
      /* =========================
         ① フィルタ分離
      ========================= */
      const areaFilters = filters.filter((f) => !f.includes(':'));
      const attributeFilters = filters.filter((f) => f.includes(':'));

      /* =========================
         ② 属性キー
      ========================= */
      const attributeKeys = [
        store.venue_type_key,
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
      ].filter(Boolean) as string[];

      /* =========================
         ③ エリア判定【修正版】
         ルール：
         - areaFilters.length >= 2 → city モード
         - areaFilters.length === 1 → prefecture モード
      ========================= */
      let matchArea = true;

      if (areaFilters.length >= 2) {
        // ✅ 市区町村モード
        matchArea =
          typeof store.city_key === 'string' &&
          areaFilters.includes(store.city_key);
      } else if (areaFilters.length === 1) {
        // ✅ 都道府県モード
        matchArea =
          typeof store.prefecture_key === 'string' &&
          areaFilters.includes(store.prefecture_key);
      }

      /* =========================
         ④ 属性判定（AND）
      ========================= */
      const matchAttributes =
        attributeFilters.length === 0 ||
        attributeFilters.every((f) =>
          attributeKeys.includes(f),
        );

      return matchArea && matchAttributes;
    });
  }, [stores, filters]);

  return { filteredStores };
}