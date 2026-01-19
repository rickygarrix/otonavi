'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { normalizeStoreDetail } from '@/lib/normalize/normalizeStoreDetail';
import type { HomeStore } from '@/types/store';
import StoreDetailView from '@/components/store/StoreDetailView';

import Header from '@/components/ui/Header';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params?.id as string | undefined;

  const [store, setStore] = useState<HomeStore | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!storeId) return;

    const load = async () => {
      setDataLoading(true);
      setImageLoaded(false);

      const { data, error } = await supabase
        .from('stores')
        .select(`
        *,
        prefectures:prefecture_id(*),
        cities:city_id(*),
        venue_types:venue_type_id(*),
        price_ranges:price_range_id(*),
        sizes(*),

        store_drinks(
          drinks(*)
        ),
        store_audience_types(
          audience_types(*)
        ),
        store_atmospheres(
          atmospheres(*)
        ),
        store_event_trends(
          event_trends(*)
        ),
        store_luggages(
          luggages(*)
        ),
        store_toilets(
          toilets(*)
        ),
        store_smoking_policies(
          smoking_policies(*)
        ),
        store_environments(
          environments(*)
        ),
        store_amenities(
          amenities(*)
        ),
        store_payment_methods(
          payment_methods(*)
        ),

        store_awards(*),
        store_media_mentions(*)
      `)
        .eq('is_active', true)
        .eq('id', storeId)
        .single();

      if (error || !data) {
        console.error('store load failed', error);
        setStore(null);
        setDataLoading(false);
        return;
      }

      const mapped = normalizeStoreDetail(data);
      setStore(mapped);
      setDataLoading(false);
    };

    load();
  }, [storeId]);

  if (!dataLoading && !store) {
    return (
      <div className="p-10 text-center text-sm text-gray-500">店舗情報の読み込みに失敗しました</div>
    );
  }

  return (
    <div className="relative -mt-20 bg-white">
      {(dataLoading || !imageLoaded) && <LoadingOverlay />}

      {store && (
        <>
          <Header variant="title" title={store.name} />

          <StoreDetailView store={store} onMainImageLoaded={() => setImageLoaded(true)} />
        </>
      )}
    </div>
  );
}
