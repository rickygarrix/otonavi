// src/lib/searchStores.ts
import { supabase } from '@/lib/supabase';
import type { SearchStoreRow } from '@/types/store-db';
import type { SearchStore } from '@/types/store';
import { normalizeSearchStore } from '@/lib/normalize/normalizeSearchStore';

export type SearchParams = {
  filters?: string[];
  storeTypeId?: string | null;
  prefectureId?: string | null;
  cityIds?: string[];
};

export async function searchStores({
  filters = [],
  storeTypeId,
  prefectureId = null,
  cityIds = [],
}: SearchParams): Promise<SearchStore[]> {
let query = supabase
  .from('stores')
  .select(
    `
    id,
    slug,
    name,
    kana,
    updated_at,

    prefecture_id,
    city_id,
    venue_type_id,
    status_id,

    statuses:statuses!stores_status_id_fkey ( key ),  -- ★ ここが重要

    prefectures ( id, name ),
    cities ( id, name ),
    venue_types ( id, label ),

    price_ranges ( key ),
    sizes ( key ),

    store_audience_types ( audience_types ( key ) ),
    store_atmospheres ( atmospheres ( key ) ),
    store_drinks ( drinks ( key ) ),
    store_luggages ( luggages ( key ) ),
    store_toilets ( toilets ( key ) ),
    store_smoking_policies ( smoking_policies ( key ) ),
    store_environments ( environments ( key ) ),
    store_amenities ( amenities ( key ) ),
    store_event_trends ( event_trends ( key ) ),
    store_payment_methods ( payment_methods ( key ) ),

    store_galleries (
      gallery_url,
      sort_order
    )
    `
  )
  .eq('is_active', true);

  if (storeTypeId) query = query.eq('venue_type_id', storeTypeId);
  if (prefectureId) query = query.eq('prefecture_id', prefectureId);
  if (prefectureId && cityIds.length > 0) {
    query = query.in('city_id', cityIds);
  }

  const { data, error } = await query
    .order('updated_at', { ascending: false })
    .returns<SearchStoreRow[]>();

  if (error) throw error;
  if (!data) return [];

  return data.map(normalizeSearchStore);
}