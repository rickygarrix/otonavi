// src/lib/searchStores.ts
import { supabase } from '@/lib/supabase';
import type { HomeStore } from '@/types/store';

export type SearchParams = {
  filters: string[];
  storeTypeId: string | null;
  prefectureId?: string | null;
  areaIds?: string[];
};

type FilterConfig = {
  definitionTable: string;
  middleTable: string;
  definitionIdColumn: string;
};

const FILTER_MAP: FilterConfig[] = [
  { definitionTable: 'atmosphere_definitions', middleTable: 'store_atmospheres', definitionIdColumn: 'atmosphere_id' },
  { definitionTable: 'event_trend_definitions', middleTable: 'store_event_trends', definitionIdColumn: 'event_trend_id' },
  { definitionTable: 'drink_definitions', middleTable: 'store_drinks', definitionIdColumn: 'drink_id' },
  { definitionTable: 'payment_method_definitions', middleTable: 'store_payment_methods', definitionIdColumn: 'payment_method_id' },
  { definitionTable: 'smoking_definitions', middleTable: 'store_smoking', definitionIdColumn: 'smoking_id' },
  { definitionTable: 'toilet_definitions', middleTable: 'store_toilet', definitionIdColumn: 'toilet_id' },
  { definitionTable: 'environment_definitions', middleTable: 'store_environment', definitionIdColumn: 'environment_id' },
  { definitionTable: 'baggage_definitions', middleTable: 'store_baggage', definitionIdColumn: 'baggage_id' },
  { definitionTable: 'customer_definitions', middleTable: 'store_customers', definitionIdColumn: 'customer_id' },
  { definitionTable: 'other_definitions', middleTable: 'store_other', definitionIdColumn: 'other_id' },
];

export async function searchStores({
  filters,
  storeTypeId,
  prefectureId = null,
  areaIds = [],
}: SearchParams): Promise<HomeStore[]> {
  let query = supabase.from('stores').select(`*, store_types(*)`);

  // ① stores直カラム
  if (storeTypeId) query = query.eq('store_type_id', storeTypeId);
  if (prefectureId) query = query.eq('prefecture_id', prefectureId);
  if (prefectureId && areaIds.length > 0) query = query.in('area_id', areaIds);

  // ② size / price
  if (filters.length > 0) {
    const { data: sizeDefs, error: sizeErr } = await supabase
      .from('size_definitions')
      .select('id')
      .in('key', filters)
      .eq('is_active', true);
    if (sizeErr) throw sizeErr;
    if (sizeDefs?.length) query = query.in('size', sizeDefs.map((s) => s.id));

    const { data: priceDefs, error: priceErr } = await supabase
      .from('price_range_definitions')
      .select('id')
      .in('key', filters)
      .eq('is_active', true);
    if (priceErr) throw priceErr;
    if (priceDefs?.length) query = query.in('price_range_id', priceDefs.map((p) => p.id));
  }

  // ③ M2M AND
  let filteredStoreIds: string[] | null = null;

  for (const config of FILTER_MAP) {
    const { data: defs, error: defError } = await supabase
      .from(config.definitionTable)
      .select('id')
      .in('key', filters)
      .eq('is_active', true);

    if (defError) throw defError;
    if (!defs?.length) continue;

    const defIds = defs.map((d) => d.id);

    const { data: storeRows, error: midError } = await supabase
      .from(config.middleTable)
      .select('store_id')
      .in(config.definitionIdColumn, defIds);

    if (midError) throw midError;
    if (!storeRows?.length) return [];

    const storeIds = storeRows.map((r) => r.store_id);

    filteredStoreIds =
      filteredStoreIds === null
        ? storeIds
        : filteredStoreIds.filter((id) => storeIds.includes(id));

    if (filteredStoreIds.length === 0) return [];
  }

  if (filteredStoreIds?.length) query = query.in('id', filteredStoreIds);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as HomeStore[];
}