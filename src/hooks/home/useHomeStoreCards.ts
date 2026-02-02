'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { HomeStoreLite } from '@/types/store';
import type { StoreRow } from '@/types/store-db';
import { normalizeHomeStore } from '@/lib/normalize/normalizeHomeStore';

export function useHomeStoreCards(limit = 12) {
  const [stores, setStores] = useState<HomeStoreLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('stores')
        .select(
          `
          id,
          slug,
          name,
          updated_at,

          prefectures:prefecture_id (
            id,
            name
          ),
          cities:city_id (
            id,
            name
          ),
          venue_types:venue_type_id (
            id,
            label
          ),

         statuses:statuses!stores_status_id_fkey ( key ),

         store_galleries (
            id,
            gallery_url,
            sort_order
          )`
        )
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(limit)
        .returns<StoreRow[]>();

      if (!mounted) return;

      if (error) {
        console.error('useHomeStoreCards error:', error);
        setError(error);
        setStores([]);
        setLoading(false);
        return;
      }

      if (!data) {
        setStores([]);
        setLoading(false);
        return;
      }

      setStores(data.map(normalizeHomeStore));
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return {
    stores,
    loading,
    error,
  };
}