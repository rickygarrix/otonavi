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
        .select(
          `
          *,
          prefectures:prefecture_id(*),
          areas:area_id(*),
          store_types:store_type_id(*),
          price_range_definitions:price_range_id(*),
          size_definitions:size(*),

          store_drinks(id, drink_definitions:drink_id(*)),
          store_customers(id, customer_definitions:customer_id(*)),
          store_atmospheres(id, atmosphere_definitions:atmosphere_id(*)),
          store_event_trends(event_trend_definitions(*)),
          store_baggage(baggage_definitions(*)),
          store_toilet(toilet_definitions(*)),
          store_smoking(smoking_definitions(*)),
          store_environment(environment_definitions(*)),
          store_other(other_definitions(*)),
          store_payment_methods(payment_method_definitions(*)),
          store_awards(*),
          store_media_mentions(*)
        `,
        )
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
