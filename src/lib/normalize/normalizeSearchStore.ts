// src/lib/normalize/normalizeSearchStore.ts
import type { SearchStoreRow } from '@/types/store-db';
import type { SearchStore } from '@/types/store';

/* =========================
   Types
========================= */

type DefinitionRef = {
  key?: unknown;
};

type M2MRow = Record<string, DefinitionRef | undefined>;

/* =========================
   Helpers
========================= */

/**
 * M2M 用
 * relation.key を配列で取得
 */
function extractKeys(list: unknown, defKey: string): string[] {
  if (!Array.isArray(list)) return [];

  return (list as M2MRow[])
    .map((row) => row?.[defKey]?.key)
    .filter((k): k is string => typeof k === 'string');
}

/**
 * ギャラリー画像選択
 * - sort_order 昇順
 * - なければ /noshop.svg
 */
function selectImage(
  store_galleries: {
    gallery_url: string | null;
    sort_order: number | null;
  }[] | null,
): string {
  if (!store_galleries || store_galleries.length === 0) {
    return '/noshop.svg';
  }

  const sorted = [...store_galleries].sort(
    (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999),
  );

  const url = sorted[0]?.gallery_url;
  return typeof url === 'string' && url.trim() !== ''
    ? url
    : '/noshop.svg';
}

/* =========================
   Normalize（最終形）
========================= */

export function normalizeSearchStore(
  raw: SearchStoreRow,
): SearchStore {
  const prefectureKey = raw.prefectures?.key ?? null;
  const cityKey = raw.cities?.key ?? null;

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    kana: raw.kana,

    /* ===== エリア ===== */
    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name ?? null,
    prefecture_key: prefectureKey,

    city_id: raw.cities?.id ?? null,
    city_label: raw.cities?.name ?? null,
    city_key: cityKey,

    /* ===== 店舗タイプ ===== */
    venue_type_id: raw.venue_types?.id ?? null,
    venue_type_key: raw.venue_types?.key
      ? `venue_types:${raw.venue_types.key}`
      : null,
    type_label: raw.venue_types?.label ?? null,

    /* ===== ステータス ===== */
    status_key: raw.statuses?.key ?? 'normal',

    /* ===== 画像 ===== */
    gallery_url: selectImage(raw.store_galleries),

    /* ===== 単一マスタ ===== */
    price_range_key: raw.price_ranges?.key
      ? `price_ranges:${raw.price_ranges.key}`
      : null,

    size_key: raw.sizes?.key
      ? `sizes:${raw.sizes.key}`
      : null,

    /* ===== M2M ===== */
    customer_keys: extractKeys(raw.store_audience_types, 'audience_types'),
    atmosphere_keys: extractKeys(raw.store_atmospheres, 'atmospheres'),
    environment_keys: extractKeys(raw.store_environments, 'environments'),
    drink_keys: extractKeys(raw.store_drinks, 'drinks'),
    payment_method_keys: extractKeys(raw.store_payment_methods, 'payment_methods'),
    event_trend_keys: extractKeys(raw.store_event_trends, 'event_trends'),
    baggage_keys: extractKeys(raw.store_luggages, 'luggages'),
    smoking_keys: extractKeys(raw.store_smoking_policies, 'smoking_policies'),
    toilet_keys: extractKeys(raw.store_toilets, 'toilets'),
    other_keys: extractKeys(raw.store_amenities, 'amenities'),

    updated_at: raw.updated_at,
  };
}