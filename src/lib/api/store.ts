import { supabase } from '@/lib/infra';
import type {
  StoreRow, SearchStoreRow,
  SearchStore, HomeStore, HomeStoreLite
} from '@/types/store';

/* ==========================================================================
   1. 内部用ヘルパー (旧 normalize.ts より移動)
   ========================================================================== */

const asNumber = (v: unknown): number | null => (typeof v === 'number' ? v : null);

/** 画像選択 (優先順位: sort_order) */
function selectImage(galleries: any[] | null): string {
  if (!galleries?.length) return '/noshop.svg';
  const top = [...galleries].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))[0];
  return top?.gallery_url?.trim() || '/noshop.svg';
}

/** M2M (多対多) の抽出 */
function getM2M(list: any, defKey: string, prefix?: string) {
  if (!Array.isArray(list)) return { keys: [], labels: [] };
  const sorted = list
    .map((row) => row?.[defKey])
    .filter((d): d is { key: string; label: string; sort_order?: number } => !!(d?.key && d?.label))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    keys: sorted.map((d) => (prefix ? `${prefix}:${d.key}` : d.key)),
    labels: sorted.map((d) => d.label),
  };
}

/* ==========================================================================
   2. 正規化ロジック (旧 normalize.ts より移動)
   ========================================================================== */

export function normalizeSearchStore(raw: SearchStoreRow): SearchStore {
  const { prefectures: pref, cities: city, venue_types: vType } = raw;
  const k = (list: any, def: string, p?: string) => getM2M(list, def, p).keys;

  return {
    id: raw.id, slug: raw.slug, name: raw.name, kana: raw.kana,
    prefecture_id: pref?.id ?? null,
    prefecture_label: pref?.name ?? null,
    prefecture_key: pref?.key ?? null,
    city_id: city?.id ?? null,
    city_label: city?.name ?? null,
    city_key: city?.key ?? null,
    venue_type_id: vType?.id ?? null,
    venue_type_key: vType?.key ? `venue_types:${vType.key}` : null,
    type_label: vType?.label ?? null,
    status_key: raw.statuses?.key ?? 'normal',
    price_range_key: raw.price_ranges?.key ? `price_ranges:${raw.price_ranges.key}` : null,
    size_key: raw.sizes?.key ? `sizes:${raw.sizes.key}` : null,
    gallery_url: selectImage(raw.store_galleries),
    customer_keys: k(raw.store_audience_types, 'audience_types'),
    atmosphere_keys: k(raw.store_atmospheres, 'atmospheres'),
    environment_keys: k(raw.store_environments, 'environments'),
    drink_keys: k(raw.store_drinks, 'drinks', 'drinks'),
    payment_method_keys: k(raw.store_payment_methods, 'payment_methods'),
    event_trend_keys: k(raw.store_event_trends, 'event_trends'),
    baggage_keys: k(raw.store_luggages, 'luggages'),
    smoking_keys: k(raw.store_smoking_policies, 'smoking_policies'),
    toilet_keys: k(raw.store_toilets, 'toilets'),
    other_keys: k(raw.store_amenities, 'amenities'),
    updated_at: raw.updated_at,
  };
}

export function normalizeStoreDetail(raw: StoreRow): HomeStore {
  const m = (list: any, def: string) => getM2M(list, def);
  const drinks = m(raw.store_drinks, 'drinks');
  const payments = m(raw.store_payment_methods, 'payment_methods');
  const events = m(raw.store_event_trends, 'event_trends');
  const bags = m(raw.store_luggages, 'luggages');
  const toilets = m(raw.store_toilets, 'toilets');
  const smoking = m(raw.store_smoking_policies, 'smoking_policies');
  const envs = m(raw.store_environments, 'environments');
  const others = m(raw.store_amenities, 'amenities');
  const customers = m(raw.store_audience_types, 'audience_types');
  const atmos = m(raw.store_atmospheres, 'atmospheres');

  const mentions = (Array.isArray(raw.mentions) ? raw.mentions : [])
    .filter((item: any) => item.is_active)
    .map((item: any) => ({
      id: String(item.id ?? ''),
      text: String(item.text ?? ''),
      year: asNumber(item.year),
    }));

  return {
    id: raw.id, slug: raw.slug, name: raw.name, kana: raw.kana,
    status_key: raw.statuses?.key ?? 'normal',
    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name ?? null,
    city_id: raw.cities?.id ?? null,
    city_label: raw.cities?.name ?? null,
    venue_type_id: raw.venue_types?.id ?? null,
    type_label: raw.venue_types?.label ?? null,
    price_range_key: raw.price_ranges?.key ?? null,
    price_range_label: raw.price_ranges?.label ?? null,
    size_key: raw.sizes?.key ?? null,
    size_label: raw.sizes?.label ?? null,
    gallery_url: selectImage(raw.store_galleries),
    description: raw.description, instagram_url: raw.instagram_url,
    x_url: raw.x_url, facebook_url: raw.facebook_url,
    tiktok_url: raw.tiktok_url, official_site_url: raw.official_site_url,
    access: raw.access, place_id: raw.place_id, address: raw.address,
    postcode: raw.postcode, business_hours: raw.business_hours,
    hasMentions: mentions.length > 0, mentions,
    payment_method_keys: payments.keys, payment_method_labels: payments.labels,
    other_payment_method: raw.other_payment_method,
    event_trend_keys: events.keys, event_trend_labels: events.labels,
    baggage_keys: bags.keys, baggage_labels: bags.labels,
    toilet_keys: toilets.keys, toilet_labels: toilets.labels,
    smoking_keys: smoking.keys, smoking_labels: smoking.labels,
    environment_keys: envs.keys, environment_labels: envs.labels,
    other_keys: others.keys, other_labels: others.labels,
    customer_keys: customers.keys, customer_labels: customers.labels,
    atmosphere_keys: atmos.keys, atmosphere_labels: atmos.labels,
    drink_keys: drinks.keys, drink_labels: drinks.labels,
    updated_at: raw.updated_at,
  };
}

/* ==========================================================================
   3. API関数
   ========================================================================== */

export type StoreSearchParams = {
  storeTypeId: string | null;
  prefectureId?: string | null;
  cityIds?: string[];
};

/** 店舗一覧検索 */
export async function fetchStores(params: StoreSearchParams): Promise<SearchStore[]> {
  const { storeTypeId, prefectureId = null, cityIds = [] } = params;

  let query = supabase
    .from('stores')
    .select(`
      id, slug, name, kana, updated_at,
      prefecture_id, city_id, venue_type_id, status_id,
      statuses:statuses!stores_status_id_fkey ( key ),
      prefectures ( id, name, key ),
      cities ( id, name, key ),
      venue_types ( id, label, key ),
      price_ranges ( key ),
      sizes ( key ),
      store_audience_types ( audience_types ( key, label, sort_order ) ),
      store_atmospheres ( atmospheres ( key, label, sort_order ) ),
      store_drinks ( drinks ( key, label, sort_order ) ),
      store_luggages ( luggages ( key, label, sort_order ) ),
      store_toilets ( toilets ( key, label, sort_order ) ),
      store_smoking_policies ( smoking_policies ( key, label, sort_order ) ),
      store_environments ( environments ( key, label, sort_order ) ),
      store_amenities ( amenities ( key, label, sort_order ) ),
      store_event_trends ( event_trends ( key, label, sort_order ) ),
      store_payment_methods ( payment_methods ( key, label, sort_order ) ),
      store_galleries ( gallery_url, sort_order )
    `)
    .eq('is_active', true);

  if (storeTypeId) query = query.eq('venue_type_id', storeTypeId);
  if (prefectureId) query = query.eq('prefecture_id', prefectureId);
  if (prefectureId && cityIds.length > 0) query = query.in('city_id', cityIds);

  const { data, error } = await query
    .order('updated_at', { ascending: false })
    .returns<SearchStoreRow[]>();

  if (error) throw error;
  return (data ?? []).map(normalizeSearchStore);
}

/** 店舗詳細取得 */
/** 店舗詳細取得 (修正版) */
export async function fetchStoreBySlug(slug: string): Promise<HomeStore | null> {
  const { data, error } = await supabase
    .from('stores')
    .select(`
      *,
      statuses:statuses!stores_status_id_fkey ( key ),
      prefectures:prefecture_id ( id, name, key ),
      cities:city_id ( id, name, key ),
      venue_types:venue_type_id ( id, label, key ),
      price_ranges:price_range_id ( key, label ),
      sizes:size_id ( key, label ),
      store_galleries ( gallery_url, sort_order ),
      store_drinks ( drinks ( key, label, sort_order ) ),
      store_audience_types ( audience_types ( key, label, sort_order ) ),
      store_atmospheres ( atmospheres ( key, label, sort_order ) ),
      store_event_trends ( event_trends ( key, label, sort_order ) ),
      store_toilets ( toilets ( key, label, sort_order ) ),
      store_smoking_policies ( smoking_policies ( key, label, sort_order ) ),
      store_environments ( environments ( key, label, sort_order ) ),
      store_amenities ( amenities ( key, label, sort_order ) ),
      store_payment_methods ( payment_methods ( key, label, sort_order ) ),
      store_luggages ( luggages ( key, label, sort_order ) ),
      mentions:mentions!mentions_store_id_fkey ( id, text, year, is_active )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;

  return normalizeStoreDetail(data as any);
}