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
         - エリア: ":" なし
         - 属性:   ":" あり
      ========================= */
      const areaFilters = filters.filter((f) => !f.includes(':'));
      const attributeFilters = filters.filter((f) => f.includes(':'));

      /* =========================
         ② 店舗が持つ属性キー一覧
         （すべて table:key 形式）
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
         ③ エリア判定
         ルール：
         - 2個以上 → city モード
         - 1個     → prefecture モード
      ========================= */
      let matchArea = true;

      if (areaFilters.length >= 2) {
        matchArea =
          typeof store.city_key === 'string' &&
          areaFilters.includes(store.city_key);
      } else if (areaFilters.length === 1) {
        matchArea =
          typeof store.prefecture_key === 'string' &&
          areaFilters.includes(store.prefecture_key);
      }

      /* =========================
         ④ 属性判定
         ルール：
         - 同一 table 内 → OR
         - table 間      → AND
      ========================= */
      const matchAttributes =
        attributeFilters.length === 0 ||
        Object.entries(
          attributeFilters.reduce<Record<string, string[]>>((acc, f) => {
            const [table] = f.split(':');
            acc[table] ??= [];
            acc[table].push(f);
            return acc;
          }, {}),
        ).every(([, group]) =>
          // 同一カテゴリ内は OR
          group.some((f) => attributeKeys.includes(f)),
        );

      return matchArea && matchAttributes;
    });
  }, [stores, filters]);

  return { filteredStores };
}