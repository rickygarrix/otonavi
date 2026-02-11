'use client';

import { useEffect, useState } from 'react';
import { fetchStores } from '@/lib/api/store';
import type { SearchStore } from '@/types/store';

type UseStoresOptions = {
  enabled?: boolean;
  limit?: number;
};

/**
 * 店舗取得用共通 Hook
 * - ホーム画面の最新店舗取得
 * - 検索画面の全件取得
 * の両方で使用
 */
export function useStores(options: UseStoresOptions = {}) {
  const { enabled = true, limit } = options;

  const [stores, setStores] = useState<SearchStore[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // API 層の fetchStores を利用
        const data = await fetchStores({ storeTypeId: null });

        if (!mounted) return;

        // limit が指定されている場合は切り出す（最新順は API 側で担保済み）
        const result = limit ? data.slice(0, limit) : data;
        setStores(result);
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e : new Error('Failed to fetch stores'));
          setStores([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [enabled, limit]);

  return { stores, loading, error };
}