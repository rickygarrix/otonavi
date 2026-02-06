// lib/normalize/normalizeStoreDetail.ts
import type { StoreRow } from '@/types/store-db';
import type { HomeStore } from '@/types/store';

/* =========================
   utils
========================= */

const asNumber = (v: unknown): number | null =>
  typeof v === 'number' ? v : null;

const asArray = <T>(v: unknown): T[] =>
  Array.isArray(v) ? (v as T[]) : [];

/* =========================
   M2M helpers
========================= */

type DefinitionRef = {
  key?: unknown;
  label?: unknown;
  sort_order?: unknown;
};

type M2MRow = Record<string, DefinitionRef | undefined>;

function extractM2MOrdered(
  list: unknown,
  defKey: string,
): { keys: string[]; labels: string[] } {
  if (!Array.isArray(list)) {
    return { keys: [], labels: [] };
  }

  const defs = (list as M2MRow[])
    .map((row) => row?.[defKey])
    .filter(
      (
        d,
      ): d is {
        key: string;
        label: string;
        sort_order?: number;
      } =>
        typeof d?.key === 'string' &&
        typeof d?.label === 'string',
    )
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    keys: defs.map((d) => d.key),
    labels: defs.map((d) => d.label),
  };
}

/* =========================
   image helper
========================= */

function selectImage(store_galleries: StoreRow['store_galleries']): string {
  if (!store_galleries?.length) return '/noshop.svg';

  const sorted = [...store_galleries].sort(
    (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999),
  );

  return sorted[0]?.gallery_url ?? '/noshop.svg';
}

/* =========================
   mentions
========================= */

type MentionRow = {
  id?: unknown;
  text?: unknown;
  year?: unknown;
  is_active?: unknown;
};

/* =========================
   normalize
========================= */

export function normalizeStoreDetail(raw: StoreRow): HomeStore {
  const mentions = asArray<MentionRow>(raw.mentions)
    .filter((m) => m.is_active === true)
    .map((m) => ({
      id: String(m.id ?? ''),
      text: String(m.text ?? ''),
      year: asNumber(m.year),
    }));

  const drinks = extractM2MOrdered(raw.store_drinks, 'drinks');

  return {
    /* ========= basic ========= */
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    kana: raw.kana,
    status_key: raw.statuses?.key ?? 'normal',

    /* ========= location ========= */
    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name ?? null,

    city_id: raw.cities?.id ?? null,
    city_label: raw.cities?.name ?? null,

    /* ========= type ========= */
    venue_type_id: raw.venue_types?.id ?? null,
    type_label: raw.venue_types?.label ?? null,

    /* ========= price / size ========= */
    price_range_key: raw.price_ranges?.key ?? null,
    price_range_label: raw.price_ranges?.label ?? null,

    size_key: raw.sizes?.key ?? null,
    size_label: raw.sizes?.label ?? null,

    /* ========= payment ========= */
    payment_method_keys: extractM2MOrdered(
      raw.store_payment_methods,
      'payment_methods',
    ).keys,
    payment_method_labels: extractM2MOrdered(
      raw.store_payment_methods,
      'payment_methods',
    ).labels,
    other_payment_method: raw.other_payment_method,

    /* ========= media ========= */
    gallery_url: selectImage(raw.store_galleries),
    description: raw.description,

    instagram_url: raw.instagram_url,
    x_url: raw.x_url,
    facebook_url: raw.facebook_url,
    tiktok_url: raw.tiktok_url,
    official_site_url: raw.official_site_url,

    /* ========= access ========= */
    access: raw.access,
    place_id: raw.place_id,
    address: raw.address,
    postcode: raw.postcode,
    business_hours: raw.business_hours,

    /* ========= mentions ========= */
    hasMentions: mentions.length > 0,
    mentions,

    /* ========= M2M ========= */
    event_trend_keys: extractM2MOrdered(
      raw.store_event_trends,
      'event_trends',
    ).keys,
    event_trend_labels: extractM2MOrdered(
      raw.store_event_trends,
      'event_trends',
    ).labels,

    baggage_keys: extractM2MOrdered(
      raw.store_luggages,
      'luggages',
    ).keys,
    baggage_labels: extractM2MOrdered(
      raw.store_luggages,
      'luggages',
    ).labels,

    toilet_keys: extractM2MOrdered(
      raw.store_toilets,
      'toilets',
    ).keys,
    toilet_labels: extractM2MOrdered(
      raw.store_toilets,
      'toilets',
    ).labels,

    smoking_keys: extractM2MOrdered(
      raw.store_smoking_policies,
      'smoking_policies',
    ).keys,
    smoking_labels: extractM2MOrdered(
      raw.store_smoking_policies,
      'smoking_policies',
    ).labels,

    environment_keys: extractM2MOrdered(
      raw.store_environments,
      'environments',
    ).keys,
    environment_labels: extractM2MOrdered(
      raw.store_environments,
      'environments',
    ).labels,

    other_keys: extractM2MOrdered(
      raw.store_amenities,
      'amenities',
    ).keys,
    other_labels: extractM2MOrdered(
      raw.store_amenities,
      'amenities',
    ).labels,

    customer_keys: extractM2MOrdered(
      raw.store_audience_types,
      'audience_types',
    ).keys,
    customer_labels: extractM2MOrdered(
      raw.store_audience_types,
      'audience_types',
    ).labels,

    atmosphere_keys: extractM2MOrdered(
      raw.store_atmospheres,
      'atmospheres',
    ).keys,
    atmosphere_labels: extractM2MOrdered(
      raw.store_atmospheres,
      'atmospheres',
    ).labels,

    drink_keys: drinks.keys,
    drink_labels: drinks.labels,

    updated_at: raw.updated_at,
  };
}