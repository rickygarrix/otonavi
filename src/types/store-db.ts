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

export type StoreGalleryRow = {
  gallery_url: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type M2MRow<T extends string> = {
  [K in T]: DefinitionKV | null;
};

export type StoreRow = {
  // ===== Core =====
  id: string;
  slug: string;
  name: string;
  kana: string | null;
   statuses: {
    key: 'normal' | 'temporary' | 'closed' | 'irregular';
  } | null;
  updated_at: string;

  // ===== Text / Info =====
  description: string | null;
  access: string | null;
  place_id: string | null;
  address: string | null;
  postcode: string | null;
  business_hours: string | null;

  // ===== SNS / Web =====
  instagram_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  official_site_url: string | null;

  // ===== Other =====
  other_payment_method: string | null;

  // ===== 1:N / FK =====
  prefectures: PrefectureRow | null;
  cities: IdNameRow | null;
  venue_types: IdLabelRow | null;
  price_ranges: DefinitionKV | null;
  sizes: DefinitionKV | null;

  // ===== M:N =====
  store_event_trends: M2MRow<'event_trends'>[];
  store_luggages: M2MRow<'luggages'>[];
  store_toilets: M2MRow<'toilets'>[];
  store_smoking_policies: M2MRow<'smoking_policies'>[];
  store_environments: M2MRow<'environments'>[];
  store_amenities: M2MRow<'amenities'>[];
  store_payment_methods: M2MRow<'payment_methods'>[];
  store_audience_types: M2MRow<'audience_types'>[];
  store_atmospheres: M2MRow<'atmospheres'>[];
  store_drinks: M2MRow<'drinks'>[];

  // ===== Images =====
  store_galleries: StoreGalleryRow[];

  // ===== Mentions =====
  mentions?: unknown[];
};

export type SearchStoreRow = {
  // ===== Core =====
  id: string;
  slug: string;
  name: string;
  kana: string | null;
  updated_at: string;

  // ===== Location =====
  prefectures: PrefectureRow | null;
  cities: IdNameRow | null;

  // ===== Type =====
  venue_types: IdLabelRow | null;
  statuses: {
    key: 'normal' | 'temporary' | 'closed' | 'irregular';
  } | null;

  // ===== Size / Price =====
  price_ranges: DefinitionKV | null;
  sizes: DefinitionKV | null;

  // ===== M:N =====
  store_event_trends: M2MRow<'event_trends'>[];
  store_luggages: M2MRow<'luggages'>[];
  store_toilets: M2MRow<'toilets'>[];
  store_smoking_policies: M2MRow<'smoking_policies'>[];
  store_environments: M2MRow<'environments'>[];
  store_amenities: M2MRow<'amenities'>[];
  store_payment_methods: M2MRow<'payment_methods'>[];
  store_audience_types: M2MRow<'audience_types'>[];
  store_atmospheres: M2MRow<'atmospheres'>[];
  store_drinks: M2MRow<'drinks'>[];

  // ===== Images =====
  store_galleries: StoreGalleryRow[];
};