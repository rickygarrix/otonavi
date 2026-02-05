// src/hooks/store/useStoresForSearch.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SearchStore } from '@/types/store';
import type { SearchStoreRow } from '@/types/store-db';
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
          id,
          slug,
          name,
          kana,
          updated_at,

          status_id,
          statuses:statuses!stores_status_id_fkey ( key ),

          prefectures ( id, name ),
          cities ( id, name ),
          venue_types ( id, key, label ),

          price_ranges ( key ),
          sizes ( key ),

          store_audience_types ( audience_types ( key ) ),
          store_atmospheres ( atmospheres ( key ) ),
          store_drinks ( drinks ( key ) ),
          store_luggages ( luggages ( key ) ),
          store_toilets ( toilets ( key ) ),
          store_smoking_policies ( smoking_policies ( key ) ),
          store_environments ( environments ( key ) ),
          store_amenities ( amenities ( key ) ),
          store_event_trends ( event_trends ( key ) ),
          store_payment_methods ( payment_methods ( key ) ),

          store_galleries (
            gallery_url,
            sort_order
          )
          `
        )
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .returns<SearchStoreRow[]>();

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