// src/lib/normalize/normalizeSearchStore.ts
import type { StoreRow } from '@/types/store-db';
import type { SearchStore } from '@/types/store';

type DefinitionRef = {
  key?: unknown;
  label?: unknown;
  sort_order?: unknown;
};

type M2MRow = Record<string, DefinitionRef | undefined>;

/**
 * M2M テーブルから key 配列を抽出
 */
function extractKeys(list: unknown, defKey: string): string[] {
  if (!Array.isArray(list)) return [];

  return (list as M2MRow[])
    .map((row) => row?.[defKey]?.key)
    .filter((k): k is string => typeof k === 'string');
}

/**
 * サムネイル画像を安全に1枚選択
 * - order_num が最小のものを採用
 * - null / undefined / 空文字 / 空白文字 はすべて fallback
 */
function selectImage(store_images: StoreRow['store_images']): string {
  if (!store_images || store_images.length === 0) {
    return '/noshop.svg';
  }

  const sorted = [...store_images].sort(
    (a, b) => (a.order_num ?? 999) - (b.order_num ?? 999),
  );

  const url = sorted[0]?.image_url;

  return typeof url === 'string' && url.trim() !== ''
    ? url
    : '/noshop.svg';
}

/**
 * StoreRow → SearchStore 正規化
 * UI が「何も疑わずに使える形」にする
 */
export function normalizeSearchStore(raw: StoreRow): SearchStore {
  return {
    id: raw.id,
    name: raw.name,
    kana: raw.kana,

    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name_ja ?? null,

    city_id: raw.cities?.id ?? null,
    city_label: raw.cities?.name ?? null,

    store_type_id: raw.venue_types?.id ?? null,
    type_label: raw.venue_types?.label ?? null,

    // ★ 画像は normalize 層で完全に安全化
    image_url: selectImage(raw.store_images),

    price_range_key: raw.price_range_definitions?.key ?? null,
    size_key: raw.size_definitions?.key ?? null,

    customer_keys: extractKeys(raw.store_customers, 'customer_definitions'),
    atmosphere_keys: extractKeys(raw.store_atmospheres, 'atmosphere_definitions'),
    environment_keys: extractKeys(raw.store_environment, 'environment_definitions'),
    drink_keys: extractKeys(raw.store_drinks, 'drink_definitions'),
    payment_method_keys: extractKeys(
      raw.store_payment_methods,
      'payment_method_definitions',
    ),
    event_trend_keys: extractKeys(
      raw.store_event_trends,
      'event_trend_definitions',
    ),
    baggage_keys: extractKeys(raw.store_baggage, 'baggage_definitions'),
    smoking_keys: extractKeys(raw.store_smoking, 'smoking_definitions'),
    toilet_keys: extractKeys(raw.store_toilet, 'toilet_definitions'),
    other_keys: extractKeys(raw.store_other, 'other_definitions'),

    updated_at: raw.updated_at,
  };
}