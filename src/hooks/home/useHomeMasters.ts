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

type GenericMasterRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number;
};

/* =========================
   Generic masters
========================= */

async function loadGenericMasters(): Promise<Map<string, GenericMaster>> {
  const map = new Map<string, GenericMaster>();

  await Promise.all(
    Object.keys(TABLE_TO_SECTION).map(async (table) => {
      const { data } = await supabase
        .from(table)
        .select('id, key, label, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      (data as GenericMasterRow[] | null)?.forEach((item) => {
        const mapKey = `${table}:${item.key}`;

        map.set(mapKey, {
          id: item.id,
          key: mapKey,
          label: item.label,
          table,
          sort_order: item.sort_order,
        });
      });
    }),
  );

  return map;
}

/* =========================
   Hook
========================= */

export function useHomeMasters() {
  const [loading, setLoading] = useState(true);

  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [drinkMasters, setDrinkMasters] = useState<DrinkDefinition[]>([]);
  const [genericMasters, setGenericMasters] =
    useState<Map<string, GenericMaster>>(new Map());

  /* =========================
     Fetch
  ========================= */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const [
          { data: prefData },
          { data: cityData },
          { data: drinkData },
        ] = await Promise.all([
          supabase
            .from('prefectures')
            .select('id, key, name, sort_order')
            .order('sort_order', { ascending: true }),
          supabase
            .from('cities')
            .select('id, key, name, sort_order')
            .order('sort_order', { ascending: true }),
          supabase
            .from('drinks')
            .select('key, label, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
        ]);

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

  /* =========================
     externalLabelMap
     - key → 表示名
  ========================= */

  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>();

    // ✅ エリアも key ベース
    prefectures.forEach((p) => map.set(p.key, p.name));
    cities.forEach((c) => map.set(c.key, c.name));

    drinkMasters.forEach((d) => map.set(d.key, d.label));
    genericMasters.forEach((v) => map.set(v.key, v.label));

    return map;
  }, [prefectures, cities, drinkMasters, genericMasters]);

  /* =========================
     label → section
  ========================= */

  const labelToSectionMap = useMemo(() => {
    const map = new Map<string, string>();

    genericMasters.forEach(({ label, table }) => {
      const section = TABLE_TO_SECTION[table];
      if (section) map.set(label, section);
    });

    prefectures.forEach((p) => map.set(p.name, 'エリア'));
    cities.forEach((c) => map.set(c.name, 'エリア'));
    drinkMasters.forEach((d) => map.set(d.label, 'ドリンク'));

    return map;
  }, [genericMasters, prefectures, cities, drinkMasters]);

  /* =========================
     City map (key lookup)
  ========================= */

  const cityMap = useMemo(() => {
    const map = new Map<string, City>();
    cities.forEach((c) => map.set(c.key, c));
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