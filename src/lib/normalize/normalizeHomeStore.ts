import type { HomeStoreLite } from '@/types/store';
import type { StoreRow } from '@/types/store-db';

function selectImage(store_galleries: StoreRow['store_galleries']): string {
  if (!store_galleries?.length) return '/noshop.svg';
  const activeOnly = store_galleries;

  if (!activeOnly.length) return '/noshop.svg';

  const sorted = [...activeOnly].sort(
    (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)
  );

  return sorted[0]?.gallery_url ?? '/noshop.svg';
}

export function normalizeHomeStore(raw: StoreRow): HomeStoreLite {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,

    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name ?? null,

    city_id: raw.cities?.id ?? null,
    city_label: raw.cities?.name ?? null,

    venue_type_id: raw.venue_types?.id ?? null,
    type_label: raw.venue_types?.label ?? null,

    status_key: raw.statuses?.key ?? 'normal',

    gallery_url: selectImage(raw.store_galleries),
    updated_at: raw.updated_at,
  };
}
