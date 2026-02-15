import type { DefinitionKV } from './master';

/* ==========================================================================
   1. Application Types (Frontend Logic)
   ========================================================================== */

/** 店舗ステータス（key ベース・全体で共通） */
export type StoreStatusKey = 'normal' | 'temporary' | 'closed' | 'irregular';

export type StoreMention = {
  id: string;
  text: string;
  year: number | null;
};

/**
 * HomeStore (詳細ページ用)
 */
export type HomeStore = {
  id: string;
  name: string;
  kana: string | null;
  slug: string;

  // エリア
  prefecture_id: string | null;
  prefecture_label: string | null;
  city_id: string | null;
  city_label: string | null;

  // 店舗タイプ / ステータス
  venue_type_id: string | null;
  type_label: string | null;
  status_key?: StoreStatusKey | null;

  // 価格 / サイズ
  price_range_key: string | null;
  price_range_label: string | null;
  size_key: string | null;
  size_label: string | null;

  // 支払い
  payment_method_keys: string[];
  payment_method_labels: string[];
  other_payment_method: string | null;

  // メディア
  gallery_url: string;
  description: string | null;

  instagram_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  official_site_url: string | null;

  // アクセス
  access: string | null;
  address: string | null;
  postcode: string | null;
  business_hours: string | null;

  // メンション
  hasMentions: boolean;
  mentions: StoreMention[];

  // フィルタ（すべて key / label の配列）
  baggage_keys: string[];
  baggage_labels: string[];
  toilet_keys: string[];
  toilet_labels: string[];
  smoking_keys: string[];
  smoking_labels: string[];
  environment_keys: string[];
  environment_labels: string[];
  other_keys: string[];
  other_labels: string[];
  customer_keys: string[];
  customer_labels: string[];
  atmosphere_keys: string[];
  atmosphere_labels: string[];
  drink_keys: string[];
  drink_labels: string[];

  updated_at: string;
};

/**
 * HomeStoreLite (一覧・最新カード用)
 */
export type HomeStoreLite = {
  id: string;
  name: string;
  slug: string;
  prefecture_id: string | null;
  prefecture_label: string | null;
  city_id: string | null;
  city_label: string | null;
  venue_type_id: string | null;
  type_label: string | null;
  status_key?: StoreStatusKey | null;
  gallery_url: string;
  updated_at: string;
};

/**
 * SearchStore (検索・フィルタ用)
 */
export type SearchStore = {
  id: string;
  slug: string;
  name: string;
  kana: string | null;
  prefecture_id: string | null;
  prefecture_label: string | null;
  prefecture_key?: string | null;
  city_id: string | null;
  city_label: string | null;
  city_key?: string | null;
  venue_type_id: string | null;
  venue_type_key?: string | null;
  type_label: string | null;
  gallery_url: string;
  price_range_key: string | null;
  size_key: string | null;
  customer_keys: string[];
  atmosphere_keys: string[];
  environment_keys: string[];
  drink_keys: string[];
  payment_method_keys: string[];
  baggage_keys: string[];
  smoking_keys: string[];
  toilet_keys: string[];
  other_keys: string[];
  status_key?: StoreStatusKey | null;
  updated_at: string;
};

/* ==========================================================================
   2. Database Rows (Supabase Response)
   ========================================================================== */

export type IdLabelRow = {
  id: string;
  label: string;
  key?: string | null;
};

export type IdNameRow = {
  id: string;
  key: string;
  name: string;
};

export type StoreGalleryRow = {
  gallery_url: string | null;
  sort_order: number | null;
  updated_at: string;
};

export type M2MRow<T extends string> = {
  [K in T]: DefinitionKV | null;
};

/**
 * DBから取得する生データの型
 */
export type StoreRow = {
  id: string;
  slug: string;
  name: string;
  kana: string | null;
  statuses: { key: StoreStatusKey } | null;
  updated_at: string;
  description: string | null;
  access: string | null;
  address: string | null;
  postcode: string | null;
  business_hours: string | null;
  instagram_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  official_site_url: string | null;
  other_payment_method: string | null;
  prefectures: IdNameRow | null;
  cities: IdNameRow | null;
  venue_types: IdLabelRow | null;
  price_ranges: DefinitionKV | null;
  sizes: DefinitionKV | null;
  store_luggages: M2MRow<'luggages'>[];
  store_toilets: M2MRow<'toilets'>[];
  store_smoking_policies: M2MRow<'smoking_policies'>[];
  store_environments: M2MRow<'environments'>[];
  store_amenities: M2MRow<'amenities'>[];
  store_payment_methods: M2MRow<'payment_methods'>[];
  store_audience_types: M2MRow<'audience_types'>[];
  store_atmospheres: M2MRow<'atmospheres'>[];
  store_drinks: M2MRow<'drinks'>[];
  store_galleries: StoreGalleryRow[];
  mentions?: unknown[];
};

export type SearchStoreRow = Omit<StoreRow, 'description' | 'access' | 'business_hours' | 'instagram_url' | 'x_url' | 'facebook_url' | 'tiktok_url' | 'official_site_url' | 'other_payment_method'>;