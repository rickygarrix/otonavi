'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prefecture, City } from '@/types/location';
import type { DrinkDefinition, GenericMaster } from '@/types/master';

/* =========================
   Const
========================= */
const TABLE_TO_SECTION: Record<string, string> = {
  venue_types: '店舗タイプ',
  event_trends: 'イベントの傾向',
  luggages: '荷物預かり',
  toilets: 'トイレ',
  sizes: '広さ',
  smoking_policies: '喫煙',
  environments: '周辺環境',
  amenities: 'その他',
  price_ranges: '価格帯',
  payment_methods: '支払い方法',
  audience_types: '客層',
  atmospheres: '雰囲気',
};

/* =========================
   Hook
========================= */
export function useHomeMasters() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    prefectures: Prefecture[];
    cities: City[];
    drinks: DrinkDefinition[];
    generics: Map<string, GenericMaster>;
  }>({
    prefectures: [],
    cities: [],
    drinks: [],
    generics: new Map(),
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        // 1. 基本マスタと全汎用マスタを同時に fetch (完全並列)
        const [prefRes, cityRes, drinkRes, ...genericResponses] = await Promise.all([
          supabase.from('prefectures').select('id, key, name, sort_order').order('sort_order'),
          supabase.from('cities').select('id, key, name, sort_order').order('sort_order'),
          supabase.from('drinks').select('key, label, sort_order').eq('is_active', true).order('sort_order'),
          ...Object.keys(TABLE_TO_SECTION).map(table =>
            supabase.from(table).select('id, key, label, sort_order').eq('is_active', true).order('sort_order')
          ),
        ]);

        if (!mounted) return;

        // 2. 汎用マスタの Map 構築
        const generics = new Map<string, GenericMaster>();
        Object.keys(TABLE_TO_SECTION).forEach((table, index) => {
          const res = genericResponses[index];
          res.data?.forEach((item: any) => {
            const mapKey = `${table}:${item.key}`;
            generics.set(mapKey, { ...item, key: mapKey, table });
          });
        });

        setData({
          prefectures: prefRes.data ?? [],
          cities: cityRes.data ?? [],
          drinks: drinkRes.data ?? [],
          generics,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  /* =========================
     Computed Maps (useMemo でスッキリ統合)
  ========================= */

  // key → ラベル (表示名)
  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    data.prefectures.forEach(p => map.set(p.key, p.name));
    data.cities.forEach(c => map.set(c.key, c.name));
    data.drinks.forEach(d => map.set(`drinks:${d.key}`, d.label));
    data.generics.forEach(v => map.set(v.key, v.label));
    return map;
  }, [data]);

  // ラベル → セクション名 (逆引き用)
  const labelToSectionMap = useMemo(() => {
    const map = new Map<string, string>();
    data.generics.forEach(({ label, table }) => map.set(label, TABLE_TO_SECTION[table]));
    data.prefectures.forEach(p => map.set(p.name, 'エリア'));
    data.cities.forEach(c => map.set(c.name, 'エリア'));
    data.drinks.forEach(d => map.set(d.label, 'ドリンク'));
    return map;
  }, [data]);

  const cityMap = useMemo(() => {
    const map = new Map<string, City>();
    data.cities.forEach(c => map.set(c.key, c));
    return map;
  }, [data.cities]);

  return {
    loading,
    externalLabelMap,
    labelToSectionMap,
    cityMap,
    genericMasters: data.generics,
    drinkMasters: data.drinks,
  };
}