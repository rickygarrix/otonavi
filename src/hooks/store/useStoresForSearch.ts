'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SearchStore } from '@/types/store';
import { normalizeSearchStore } from '@/lib/normalize/normalizeSearchStore';

type UseStoresForSearchOptions = {
  enabled?: boolean;
};

export function useStoresForSearch(
  options: UseStoresForSearchOptions = {}
) {
  const { enabled = true } = options;

  const [stores, setStores] = useState<SearchStore[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('stores')
        .select(
          `
          *,
          prefectures ( id, name ),
          cities ( id, name ),
          venue_types ( id, label ),

          price_ranges ( key, label ),
          sizes ( key, label ),

          store_customers ( audience_types ( key, label ) ),
          store_atmospheres ( atmospheres ( key, label ) ),
          store_drinks ( drinks ( key, label, sort_order ) ),
          store_baggage ( luggages ( key, label ) ),
          store_toilet ( toilets ( key, label ) ),
          store_smoking ( smoking_policies ( key, label ) ),
          store_environment ( environments ( key, label ) ),
          store_other ( amenities ( key, label ) ),
          store_event_trends ( event_trends ( key, label ) ),
          store_payment_methods ( payment_methods ( key, label ) ),
          store_images:store_images!store_images_store_id_fkey (
            image_url,
            order_num
          )
        `
        )
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (!mounted) return;

      if (error || !data) {
        console.error('useStoresForSearch error:', error);
        setStores([]);
        setLoading(false);
        return;
      }

      setStores(data.map(normalizeSearchStore));
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return {
    stores,
    loading,
  };
}