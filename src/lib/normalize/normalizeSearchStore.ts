// src/lib/normalize/normalizeSearchStore.ts
import type { SearchStoreRow } from '@/types/store-db';
import type { SearchStore } from '@/types/store';

type DefinitionRef = {
  key?: unknown;
};

type M2MRow = Record<string, DefinitionRef | undefined>;

function extractKeys(list: unknown, defKey: string): string[] {
  if (!Array.isArray(list)) return [];

  return (list as M2MRow[])
    .map((row) => row?.[defKey]?.key)
    .filter((k): k is string => typeof k === 'string');
}

function selectImage(
  store_galleries: SearchStoreRow['store_galleries'],
): string {
  if (!store_galleries?.length) return '/noshop.svg';

  const sorted = [...store_galleries].sort(
    (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999),
  );

  const url = sorted[0]?.gallery_url;
  return typeof url === 'string' && url.trim() !== ''
    ? url
    : '/noshop.svg';
}

export function normalizeSearchStore(raw: SearchStoreRow): SearchStore {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    kana: raw.kana,

    // ===== エリア =====
    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name ?? null,
    prefecture_key: raw.prefectures?.name ?? null, // ★ filters 用

    city_id: raw.cities?.id ?? null,
    city_label: raw.cities?.name ?? null,
    city_key: raw.cities?.name ?? null, // ★ filters 用

    // ===== 店舗タイプ =====
    venue_type_id: raw.venue_types?.id ?? null,
    venue_type_key: raw.venue_types?.key ?? null,
    type_label: raw.venue_types?.label ?? null,

    status_key: raw.statuses?.key ?? 'normal',
    gallery_url: selectImage(raw.store_galleries),

    price_range_key: raw.price_ranges?.key ?? null,
    size_key: raw.sizes?.key ?? null,

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
