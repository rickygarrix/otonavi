import { supabase } from '@/lib/supabase';
import type { StoreRow, SearchStoreRow } from '@/types/store';
import type { SearchStore, HomeStore } from '@/types/store';
import { normalizeSearchStore, normalizeStoreDetail } from '@/lib/normalize';

/**
 * 共通：検索パラメータ型
 */
export type StoreSearchParams = {
  storeTypeId: string | null;
  prefectureId?: string | null;
  cityIds?: string[];
};

/**
 * 1. 店舗一覧検索（DB取得 & 正規化）
 * - 業態 / エリアを DB レベルで絞り込み
 * - 属性フィルタはフロント側で処理することを想定
 */
export async function fetchStores(params: StoreSearchParams): Promise<SearchStore[]> {
  const { storeTypeId, prefectureId = null, cityIds = [] } = params;

  let query = supabase
    .from('stores')
    .select(`
      id, slug, name, kana, updated_at,
      prefecture_id, city_id, venue_type_id, status_id,
      statuses:statuses!stores_status_id_fkey ( key ),
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
      store_galleries ( gallery_url, sort_order )
    `)
    .eq('is_active', true);

  if (storeTypeId) {
    query = query.eq('venue_type_id', storeTypeId);
  }
  if (prefectureId) {
    query = query.eq('prefecture_id', prefectureId);
  }
  if (prefectureId && cityIds.length > 0) {
    query = query.in('city_id', cityIds);
  }

  const { data, error } = await query
    .order('updated_at', { ascending: false })
    .returns<SearchStoreRow[]>();

  if (error) throw error;
  return (data ?? []).map(normalizeSearchStore);
}

/**
 * 2. 店舗詳細取得（Slug指定）
 * - 関連テーブルをすべて結合して取得
 */
export async function fetchStoreBySlug(slug: string): Promise<HomeStore | null> {
  const { data, error } = await supabase
    .from('stores')
    .select(`
      *,
      statuses:statuses!stores_status_id_fkey ( key ),
      prefectures:prefecture_id(*),
      cities:city_id(*),
      venue_types:venue_type_id(*),
      price_ranges:price_range_id(*),
      sizes(*),
      store_drinks(drinks(*)),
      store_audience_types(audience_types(*)),
      store_atmospheres(atmospheres(*)),
      store_event_trends(event_trends(*)),
      store_toilets(toilets(*)),
      store_smoking_policies(smoking_policies(*)),
      store_environments(environments(*)),
      store_amenities(amenities(*)),
      store_payment_methods(payment_methods(*)),
      store_luggages(luggages(*)),
      mentions:mentions!mentions_store_id_fkey(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;

  // normalizeStoreDetail は StoreRow 型を期待するためキャスト
  return normalizeStoreDetail(data as unknown as StoreRow);
}