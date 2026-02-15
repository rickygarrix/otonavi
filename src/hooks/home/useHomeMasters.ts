'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/infra';
import type { Prefecture, City, DrinkDefinition, GenericMaster } from '@/types/master';

const TABLE_TO_SECTION: Record<string, string> = {
  venue_types: '店舗タイプ',
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

interface GenericResponseItem {
  id: string;
  key: string;
  label: string;
  sort_order: number | null;
}

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
        const [prefRes, cityRes, drinkRes, ...genericResponses] = await Promise.all([
          supabase.from('prefectures').select('id, key, name, sort_order').order('sort_order'),
          supabase.from('cities').select('id, key, name, sort_order').order('sort_order'),
          supabase.from('drinks').select('key, label, sort_order').eq('is_active', true).order('sort_order'),
          ...Object.keys(TABLE_TO_SECTION).map(table =>
            supabase.from(table).select('id, key, label, sort_order').eq('is_active', true).order('sort_order')
          ),
        ]);

        if (!mounted) return;

        const generics = new Map<string, GenericMaster>();
        Object.keys(TABLE_TO_SECTION).forEach((table, index) => {
          const items = (genericResponses[index].data as GenericResponseItem[]) ?? [];
          items.forEach((item) => {
            const mapKey = `${table}:${item.key}`;
            generics.set(mapKey, {
              ...item,
              key: mapKey,
              table,
              sort_order: item.sort_order ?? 0
            });
          });
        });

        setData({
          prefectures: (prefRes.data as Prefecture[]) ?? [],
          cities: (cityRes.data as City[]) ?? [],
          drinks: (drinkRes.data as DrinkDefinition[]) ?? [],
          generics,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const masters = useMemo(() => {
    const externalLabelMap = new Map<string, string>();
    const labelToSectionMap = new Map<string, string>();
    const keyToTableMap = new Map<string, string>();
    const cityMap = new Map<string, City>();

    const storeTypes = Array.from(data.generics.values()).filter(m => m.table === 'venue_types');

    data.prefectures.forEach(p => {
      externalLabelMap.set(p.key, p.name);
      labelToSectionMap.set(p.name, 'エリア');
    });
    data.cities.forEach(c => {
      externalLabelMap.set(c.key, c.name);
      labelToSectionMap.set(c.name, 'エリア');
      cityMap.set(c.key, c);
    });
    data.drinks.forEach(d => {
      const fullKey = `drinks:${d.key}`;
      externalLabelMap.set(fullKey, d.label);
      labelToSectionMap.set(d.label, 'ドリンク');
      keyToTableMap.set(d.key, 'drinks');
    });
    data.generics.forEach(v => {
      externalLabelMap.set(v.key, v.label);
      labelToSectionMap.set(v.label, TABLE_TO_SECTION[v.table]);

      const pureKey = v.key.split(':')[1];
      // 既に登録があっても venue_types の場合は優先して上書きする
      if (!keyToTableMap.has(pureKey) || v.table === 'venue_types') {
        keyToTableMap.set(pureKey, v.table);
      }
    });

    return { externalLabelMap, labelToSectionMap, keyToTableMap, cityMap, storeTypes };
  }, [data]);

  return {
    loading,
    ...masters,
    genericMasters: data.generics,
    drinkMasters: data.drinks,
  };
}