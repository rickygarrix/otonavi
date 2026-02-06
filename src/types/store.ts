// src/types/store.ts

/* =========================
   Common Types
========================= */

export type StoreType = 'club' | 'bar' | 'livehouse' | 'other';

/**
 * 店舗ステータス（key ベース・全体で共通）
 */
export type StoreStatusKey =
  | 'normal'
  | 'temporary'
  | 'closed'
  | 'irregular';

export type StoreMention = {
  id: string;
  text: string;
  year: number | null;
};

/* =========================
   HomeStore (詳細ページ用)
========================= */

export type HomeStore = {
  id: string;
  name: string;
  kana: string | null;
  slug: string;

  // ===== エリア =====
  prefecture_id: string | null;
  prefecture_label: string | null;

  city_id: string | null;
  city_label: string | null;

  // ===== 店舗タイプ / ステータス =====
  venue_type_id: string | null;
  type_label: string | null;
  status_key?: StoreStatusKey | null;

  // ===== 価格 / サイズ =====
  price_range_key: string | null;
  price_range_label: string | null;

  size_key: string | null;
  size_label: string | null;

  // ===== 支払い =====
  payment_method_keys: string[];
  payment_method_labels: string[];
  other_payment_method: string | null;

  // ===== メディア =====
  gallery_url: string;
  description: string | null;

  instagram_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  official_site_url: string | null;

  // ===== アクセス =====
  access: string | null;
  place_id: string | null;
  address: string | null;
  postcode: string | null;
  business_hours: string | null;

  // ===== メンション =====
  hasMentions: boolean;
  mentions: StoreMention[];

  // ===== フィルタ（key / label 両対応） =====
  event_trend_keys: string[];
  event_trend_labels: string[];

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

/* =========================
   HomeStoreLite (一覧・カード用)
========================= */

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

/* =========================
   SearchStore (検索・フィルタ用)
========================= */

export type SearchStore = {
  id: string;
  slug: string;
  name: string;
  kana: string | null;

  // ===== エリア（id / key / label）=====
  prefecture_id: string | null;
  prefecture_label: string | null;
  prefecture_key?: string | null;

  city_id: string | null;
  city_label: string | null;
  city_key?: string | null;

  // ===== 店舗タイプ =====
  venue_type_id: string | null;
  venue_type_key?: string | null;
  type_label: string | null;

  // ===== 表示 =====
  gallery_url: string;

  // ===== 単一条件 =====
  price_range_key: string | null;
  size_key: string | null;

  // ===== 複数条件（key ベース）=====
  customer_keys: string[];
  atmosphere_keys: string[];
  environment_keys: string[];
  drink_keys: string[];
  payment_method_keys: string[];
  event_trend_keys: string[];
  baggage_keys: string[];
  smoking_keys: string[];
  toilet_keys: string[];
  other_keys: string[];

  // ===== ステータス =====
  status_key?: StoreStatusKey | null;

  updated_at: string;
};