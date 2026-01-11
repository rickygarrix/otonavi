// src/hooks/store/useStoresForSearch.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SearchStore } from "@/types/store";
import { normalizeSearchStore } from "@/lib/normalize/normalizeSearchStore";

/**
 * 店舗一覧・検索用
 * - Home では使わない
 * - /stores 専用
 */
export function useStoresForSearch() {
  const [stores, setStores] = useState<SearchStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("stores")
        .select(`
          *,
          prefectures ( id, name_ja ),
          areas ( id, name ),
          store_types ( id, label ),

          price_range_definitions ( key, label ),
          size_definitions ( key, label ),

          store_customers ( customer_definitions ( key, label ) ),
          store_atmospheres ( atmosphere_definitions ( key, label ) ),
          store_drinks ( drink_definitions ( key, label, display_order ) ),
          store_baggage ( baggage_definitions ( key, label ) ),
          store_toilet ( toilet_definitions ( key, label ) ),
          store_smoking ( smoking_definitions ( key, label ) ),
          store_environment ( environment_definitions ( key, label ) ),
          store_other ( other_definitions ( key, label ) ),
          store_event_trends ( event_trend_definitions ( key, label ) ),
          store_payment_methods ( payment_method_definitions ( key, label ) ),

          store_images ( image_url, order_num )
        `)
        .order("updated_at", { ascending: false });

      if (!mounted) return;

      if (error || !data) {
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
  }, []);

  return {
    stores,
    loading,
  };
}