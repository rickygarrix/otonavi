'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { normalizeStoreDetail } from '@/lib/normalize/normalizeStoreDetail';
import type { HomeStore } from '@/types/store';
import StoreDetailView from '@/components/store/StoreDetailView';
import HomeButton from '@/components/ui/HomeButton';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params?.id as string;
  const [store, setStore] = useState<HomeStore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const load = async () => {
      setLoading(true);

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

          store_drinks(
            id,
            drink_definitions:drink_id(*)
          ),
          store_customers(
            id,
            customer_definitions:customer_id(*)
          ),
          store_atmospheres(
            id,
            atmosphere_definitions:atmosphere_id(*)
          ),

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
        setStore(null);
        setLoading(false);
        return;
      }

      const mapped = normalizeStoreDetail(data);
      setStore(mapped);
      setLoading(false);
    };

    load();
  }, [storeId]);

  if (loading || !store) {
    return <div className="p-10 text-center">読み込み中...</div>;
  }

  return (
    <div className="relative -mt-20 bg-white">
      <header className="sticky top-0 z-100 flex h-20 w-full items-center gap-4 px-4">
        <HomeButton />
        <span className="text-dark-5 truncate text-xs font-bold">{store.name}</span>
      </header>

      <StoreDetailView store={store} />
    </div>
  );
}
