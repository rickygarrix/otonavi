'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import StoreCard from '@/components/store/StoreCard';
import BackToHomeButton from '@/components/ui/BackToHomeButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

import { useStoresForSearch, useStoreFilters } from '@/hooks/store';
import { useHomeMasters } from '@/hooks/home';
import { useSearchStore } from '@/stores/searchStore';

export default function StoresClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /** URL（raw key） */
  const selectedFilters = searchParams.getAll('filters');
  const params = searchParams.toString();

  /** masters */
  const masters = useHomeMasters();
  const labelMap = masters.externalLabelMap;
  const mastersLoading = masters.loading;

  /** store source */
  const { stores: prefetchedStores } = useSearchStore();
  const { stores: fetchedStores, loading: storesLoading } =
    useStoresForSearch({
      enabled: prefetchedStores.length === 0,
    });

  const baseStores = useMemo(
    () =>
      prefetchedStores.length > 0
        ? prefetchedStores
        : fetchedStores,
    [prefetchedStores, fetchedStores],
  );

  /** rawKey → fullKey 変換 Map */
  const keyToFullKeyMap = useMemo(() => {
    const map = new Map<string, string>();
    masters.genericMasters.forEach((m) => {
      const rawKey = m.key.split(':')[1];
      map.set(rawKey, m.key);
    });
    return map;
  }, [masters.genericMasters]);

  /** 🔥 検索用フィルタ（full key） */
  const filterKeys = useMemo(() => {
    return selectedFilters
      .map((rawKey) => keyToFullKeyMap.get(rawKey))
      .filter((v): v is string => !!v);
  }, [selectedFilters, keyToFullKeyMap]);

  /** 検索実行 */
  const { filteredStores } = useStoreFilters(baseStores, {
    filters: filterKeys,
  });

  /** 表示用ラベル */
  const displayLabels = useMemo(() => {
    if (mastersLoading) return [];
    return filterKeys.map(
      (fullKey) => labelMap.get(fullKey) ?? fullKey,
    );
  }, [mastersLoading, filterKeys, labelMap]);

  const isReady =
    prefetchedStores.length > 0 ||
    (!mastersLoading && !storesLoading);

  if (!isReady) return <LoadingOverlay />;

  return (
    <div className="bg-white text-dark-5">
      <Header
        variant="result"
        count={filteredStores.length}
        labels={displayLabels.join(', ')}
      />

      <ul className="grid grid-cols-2">
        {filteredStores.map((store) => (
          <li key={store.id}>
            <StoreCard store={store} query={params} />
          </li>
        ))}
      </ul>

      <div className="p-10">
        <BackToHomeButton />
      </div>

      <Footer />
    </div>
  );
}