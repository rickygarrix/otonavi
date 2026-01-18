// src/types/store-db.ts
import type { DefinitionKV } from './common';

export type IdLabelRow = {
  id: string;
  label: string;
};

export type IdNameRow = {
  id: string;
  name: string;
};

export type PrefectureRow = {
  id: string;
  name: string;
};

export type StoreImageRow = {
  image_url: string | null;
  is_main: boolean | null;
  order_num: number | null;
};

export type M2MRow<T extends string> = {
  [K in T]: DefinitionKV | null;
};

export type StoreRow = {
  // ===== Core =====
  id: string;
  name: string;
  kana: string | null;
  updated_at: string;

  // ===== Text / Info =====
  description: string | null;
  access: string | null;
  google_place_id: string | null;
  address: string | null;
  postsort_order: string | null;
  business_hours: string | null;

  // ===== SNS / Web =====
  instagram_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  official_site_url: string | null;

  // ===== Other =====
  payment_method_other: string | null;

  // ===== 1:N / FK =====
  prefectures: PrefectureRow | null;
  cities: IdNameRow | null;
  venue_types: IdLabelRow | null;
  price_ranges: DefinitionKV | null;
  sizes: DefinitionKV | null;

  // ===== M:N =====
  store_event_trends: M2MRow<'event_trends'>[];
  store_baggage: M2MRow<'luggages'>[];
  store_toilet: M2MRow<'toilets'>[];
  store_smoking: M2MRow<'smoking_policies'>[];
  store_environment: M2MRow<'environments'>[];
  store_other: M2MRow<'amenities'>[];
  store_payment_methods: M2MRow<'payment_methods'>[];
  store_customers: M2MRow<'audience_types'>[];
  store_atmospheres: M2MRow<'atmospheres'>[];
  store_drinks: M2MRow<'drinks'>[];

  // ===== Images =====
  store_images: StoreImageRow[];

  // ===== Optional =====
  store_awards?: unknown[];
  store_media_mentions?: unknown[];
};
