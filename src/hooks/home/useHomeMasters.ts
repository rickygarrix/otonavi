'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prefecture, City } from '@/types/location';
import type { DrinkDefinition, GenericMaster } from '@/types/master';

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

type GenericMasterRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number;
};

async function loadGenericMasters(): Promise<Map<string, GenericMaster>> {
  const map = new Map<string, GenericMaster>();

  await Promise.all(
    Object.keys(TABLE_TO_SECTION).map(async (table) => {
      const { data, error } = await supabase
        .from(table)
        .select('id, key, label, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error(`loadGenericMasters error: ${table}`, error);
        return;
      }

      (data as GenericMasterRow[] | null)?.forEach((item) => {
        const mapKey = `${table}:${item.key}`;

        map.set(mapKey, {
          id: item.id,
          key: item.key,
          label: item.label,
          table,
          sort_order: item.sort_order,
        });
      });
    }),
  );

  return map;
}

export function useHomeMasters() {
  const [loading, setLoading] = useState(true);

  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [drinkMasters, setDrinkMasters] = useState<DrinkDefinition[]>([]);
  const [genericMasters, setGenericMasters] = useState<Map<string, GenericMaster>>(new Map());

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const [
          { data: prefData, error: prefError },
          { data: cityData, error: cityError },
          { data: drinkData, error: drinkError },
        ] = await Promise.all([
          supabase
            .from('prefectures')
            .select('id, name,sort_order')
            .order('sort_order', { ascending: true }),
          supabase
            .from('cities')
            .select('id, name, is_23ward, sort_order')
            .order('sort_order', { ascending: true }),
          supabase
            .from('drinks')
            .select('key, label, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
        ]);

        if (prefError) console.error('prefectures load error:', prefError);
        if (cityError) console.error('cities load error:', cityError);
        if (drinkError) console.error('drinks load error:', drinkError);

        const genericMap = await loadGenericMasters();

        if (!mounted) return;

        setPrefectures(prefData ?? []);
        setCities(cityData ?? []);
        setDrinkMasters((drinkData ?? []) as DrinkDefinition[]);
        setGenericMasters(genericMap);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>();

    prefectures.forEach((p) => map.set(p.id, p.name));
    cities.forEach((a) => map.set(a.id, a.name));
    drinkMasters.forEach((d) => map.set(d.key, d.label));
    genericMasters.forEach((v) => map.set(v.key, v.label));

    return map;
  }, [prefectures, cities, drinkMasters, genericMasters]);

  const labelToSectionMap = useMemo(() => {
    const map = new Map<string, string>();

    genericMasters.forEach(({ label, table }) => {
      const section = TABLE_TO_SECTION[table];
      if (section) map.set(label, section);
    });

    prefectures.forEach((p) => map.set(p.name, 'エリア'));
    cities.forEach((a) => map.set(a.name, 'エリア'));
    drinkMasters.forEach((d) => map.set(d.label, 'ドリンク'));

    return map;
  }, [genericMasters, prefectures, cities, drinkMasters]);

  const cityMap = useMemo(() => {
    const map = new Map<string, City>();
    cities.forEach((a) => map.set(a.name, a));
    return map;
  }, [cities]);

  return {
    loading,
    externalLabelMap,
    labelToSectionMap,
    cityMap,
    genericMasters,
    drinkMasters,
  };
}
