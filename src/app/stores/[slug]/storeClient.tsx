'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { normalizeStoreDetail } from '@/lib/normalize/normalizeStoreDetail';
import type { HomeStore } from '@/types/store';
import StoreDetailView from '@/components/store/StoreDetailView';
import Header from '@/components/ui/Header';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function StoreClient({ slug }: { slug: string }) {
  const [store, setStore] = useState<HomeStore | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;

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

          store_drinks(drinks(*)),
          store_audience_types(audience_types(*)),
          store_atmospheres(atmospheres(*)),
          store_event_trends(event_trends(*)),
          store_toilets(toilets(*)),
          store_smoking_policies(smoking_policies(*)),
          store_environments(environments(*)),
          store_amenities(amenities(*)),
          store_payment_methods(payment_methods(*)),
          store_luggages(luggages(*)),

          mentions:mentions!mentions_store_id_fkey(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setStore(null);
        setDataLoading(false);
        return;
      }

      const mapped = normalizeStoreDetail(data);
      setStore(mapped);
      setDataLoading(false);
    };

    load();
  }, [slug]);

  return (
    <div className="relative -mt-20 bg-white">
      {(dataLoading || !imageLoaded) && <LoadingOverlay />}

      {store && (
        <>
          <Header variant="title" title={store.name} />
          <StoreDetailView
            store={store}
            onMainImageLoaded={() => setImageLoaded(true)}
          />
        </>
      )}
    </div>
  );
}