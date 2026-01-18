// src/lib/searchStores.ts
import { supabase } from '@/lib/supabase';
import type { StoreRow } from '@/types/store-db';
import type { SearchStore } from '@/types/store';
import { normalizeSearchStore } from '@/lib/normalize/normalizeSearchStore';

export type SearchParams = {
  filters: string[];
  storeTypeId: string | null;
  prefectureId?: string | null;
  cityIds?: string[];
};

type FilterConfig = {
  definitionTable: string;
  middleTable: string;
  definitionIdColumn: string;
};

const FILTER_MAP: FilterConfig[] = [
  {
    definitionTable: 'atmosphere_definitions',
    middleTable: 'store_atmospheres',
    definitionIdColumn: 'atmosphere_id',
  },
  {
    definitionTable: 'event_trend_definitions',
    middleTable: 'store_event_trends',
    definitionIdColumn: 'event_trend_id',
  },
  {
    definitionTable: 'drink_definitions',
    middleTable: 'store_drinks',
    definitionIdColumn: 'drink_id',
  },
  {
    definitionTable: 'payment_method_definitions',
    middleTable: 'store_payment_methods',
    definitionIdColumn: 'payment_method_id',
  },
  {
    definitionTable: 'smoking_definitions',
    middleTable: 'store_smoking',
    definitionIdColumn: 'smoking_id',
  },
  {
    definitionTable: 'toilet_definitions',
    middleTable: 'store_toilet',
    definitionIdColumn: 'toilet_id',
  },
  {
    definitionTable: 'environment_definitions',
    middleTable: 'store_environment',
    definitionIdColumn: 'environment_id',
  },
  {
    definitionTable: 'baggage_definitions',
    middleTable: 'store_baggage',
    definitionIdColumn: 'baggage_id',
  },
  {
    definitionTable: 'customer_definitions',
    middleTable: 'store_customers',
    definitionIdColumn: 'customer_id',
  },
  {
    definitionTable: 'other_definitions',
    middleTable: 'store_other',
    definitionIdColumn: 'other_id',
  },
];

export async function searchStores({
  filters,
  storeTypeId,
  prefectureId = null,
  cityIds = [],
}: SearchParams): Promise<SearchStore[]> {
  /**
   * =========================
   * ① ベースクエリ（★重要）
   * useStoresForSearch と完全一致
   * =========================
   */
  let query = supabase
    .from('stores')
    .select(
      `
      *,
      prefectures ( id, name_ja ),
      cities ( id, name ),
      venue_types ( id, label ),

      price_range_definitions ( key ),
      size_definitions ( key ),

      store_customers ( customer_definitions ( key ) ),
      store_atmospheres ( atmosphere_definitions ( key ) ),
      store_drinks ( drink_definitions ( key, sort_order ) ),
      store_baggage ( baggage_definitions ( key ) ),
      store_toilet ( toilet_definitions ( key ) ),
      store_smoking ( smoking_definitions ( key ) ),
      store_environment ( environment_definitions ( key ) ),
      store_other ( other_definitions ( key ) ),
      store_event_trends ( event_trend_definitions ( key ) ),
      store_payment_methods ( payment_method_definitions ( key ) ),

      store_images:store_images!store_images_store_id_fkey (
        image_url,
        order_num
      )
      `,
    )
    .eq('is_active', true);

  /**
   * =========================
   * ② stores 直カラム
   * =========================
   */
  if (storeTypeId) query = query.eq('store_type_id', storeTypeId);
  if (prefectureId) query = query.eq('prefecture_id', prefectureId);
  if (prefectureId && cityIds.length > 0) query = query.in('city_id', cityIds);

  /**
   * =========================
   * ③ size / price（AND）
   * =========================
   */
  if (filters.length > 0) {
    const { data: sizeDefs } = await supabase
      .from('size_definitions')
      .select('id')
      .in('key', filters)
      .eq('is_active', true);

    if (sizeDefs?.length) {
      query = query.in(
        'size_id',
        sizeDefs.map((s) => s.id),
      );
    }

    const { data: priceDefs } = await supabase
      .from('price_range_definitions')
      .select('id')
      .in('key', filters)
      .eq('is_active', true);

    if (priceDefs?.length) {
      query = query.in(
        'price_range_id',
        priceDefs.map((p) => p.id),
      );
    }
  }

  /**
   * =========================
   * ④ M2M AND フィルタ
   * =========================
   */
  let filteredStoreIds: string[] | null = null;

  for (const config of FILTER_MAP) {
    const { data: defs } = await supabase
      .from(config.definitionTable)
      .select('id')
      .in('key', filters)
      .eq('is_active', true);

    if (!defs?.length) continue;

    const defIds = defs.map((d) => d.id);

    const { data: storeRows } = await supabase
      .from(config.middleTable)
      .select('store_id')
      .in(config.definitionIdColumn, defIds);

    if (!storeRows?.length) return [];

    const storeIds = storeRows.map((r) => r.store_id);

    filteredStoreIds =
      filteredStoreIds === null
        ? storeIds
        : filteredStoreIds.filter((id) => storeIds.includes(id));

    if (filteredStoreIds.length === 0) return [];
  }

  if (filteredStoreIds?.length) {
    query = query.in('id', filteredStoreIds);
  }

  /**
   * =========================
   * ⑤ 実行 & normalize
   * =========================
   */
  const { data, error } = await query.order('updated_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return (data as StoreRow[]).map(normalizeSearchStore);
}