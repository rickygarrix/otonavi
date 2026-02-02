// src/types/store.ts

export type StoreType = 'club' | 'bar' | 'livehouse' | 'other';

export type StoreMention = {
  id: string;
  text: string;
  year: number | null;
};

export type HomeStore = {
  id: string;
  name: string;
  kana: string | null;
  slug: string;

  prefecture_id: string | null;
  prefecture_label: string | null;

  city_id: string | null;
  city_label: string | null;

  venue_type_id: string | null;
  type_label: string | null;

  price_range_key: string | null;
  price_range_label: string | null;

  payment_method_keys: string[];
  payment_method_labels: string[];
  other_payment_method: string | null;

  gallery_url: string;
  description: string | null;

  instagram_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  official_site_url: string | null;

  access: string | null;
  place_id: string | null;
  address: string | null;
  postcode: string | null;
  business_hours: string | null;

  hasMentions: boolean;
  mentions: StoreMention[];

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

  size_key: string | null;
  size_label: string | null;

  updated_at: string;
};

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
  status_key?: 'normal' | 'temporary' | 'closed' | 'irregular';

  gallery_url: string;
  updated_at: string;
};

export type SearchStore = {
  id: string;
  slug: string;
  name: string;
  kana: string | null;

  prefecture_id: string | null;
  prefecture_label: string | null;

  city_id: string | null;
  city_label: string | null;

  venue_type_id: string | null;
  type_label: string | null;

  gallery_url: string;

  price_range_key: string | null;
  size_key: string | null;

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
  status_key?: 'normal' | 'temporary' | 'closed' | 'irregular';

  updated_at: string;
};
