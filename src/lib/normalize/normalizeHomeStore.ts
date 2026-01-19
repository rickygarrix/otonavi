import type { HomeStoreLite } from '@/types/store';
import type { StoreRow } from '@/types/store-db';

function selectImage(store_images: StoreRow['store_images']): string {
  if (!store_images?.length) return '/noshop.svg';

  const sorted = [...store_images].sort((a, b) => (a.order_num ?? 999) - (b.order_num ?? 999));

  return sorted[0]?.image_url ?? '/noshop.svg';
}

export function normalizeHomeStore(raw: StoreRow): HomeStoreLite {
  return {
    id: raw.id,
    name: raw.name,

    prefecture_id: raw.prefectures?.id ?? null,
    prefecture_label: raw.prefectures?.name ?? null,

    city_id: raw.cities?.id ?? null,
    city_label: raw.cities?.name ?? null,

    venue_type_id: raw.venue_types?.id ?? null,
    type_label: raw.venue_types?.label ?? null,

    image_url: selectImage(raw.store_images),
    updated_at: raw.updated_at,
  };
}
