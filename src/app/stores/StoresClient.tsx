'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import StoreCard from '@/components/store/StoreCard';
import BackToHomeButton from '@/components/ui/BackToHomeButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

import { useStores } from '@/hooks/store/useStores';
import { useStoreFilters } from '@/hooks/store/useStoreFilters';
import { useHomeMasters } from '@/hooks/home/useHomeMasters';

export default function StoresClient() {
  const searchParams = useSearchParams();
  const selectedFilters = searchParams.getAll('filters');

  const {
    externalLabelMap,
    genericMasters,
    drinkMasters,
    loading: mastersLoading
  } = useHomeMasters();

  const { stores: fetchedStores, loading: storesLoading } = useStores();

  const filterKeys = useMemo(() => {
    const lookup = new Map<string, string>();

    // 店舗タイプ(venue_types)を優先して lookup を構築
    genericMasters.forEach((m) => {
      const pureKey = m.key.split(':')[1] || m.key;
      if (!lookup.has(pureKey) || m.table === 'venue_types') {
        lookup.set(pureKey, m.key);
      }
    });

    drinkMasters.forEach((d) => {
      if (!lookup.has(d.key)) lookup.set(d.key, `drinks:${d.key}`);
    });

    return selectedFilters.map((rawKey) => {
      if (rawKey.includes(':')) return rawKey;
      return lookup.get(rawKey) ?? rawKey;
    });
  }, [selectedFilters, genericMasters, drinkMasters]);

  const { filteredStores } = useStoreFilters(fetchedStores, { filters: filterKeys });

  const displayLabels = useMemo(() => {
    if (mastersLoading) return "";
    return filterKeys
      .map((key) => externalLabelMap.get(key) ?? key)
      .filter(Boolean)
      .join(', ');
  }, [mastersLoading, filterKeys, externalLabelMap]);

  if (mastersLoading || storesLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="bg-white text-dark-5">
      <Header
        variant="result"
        count={filteredStores.length}
        labels={displayLabels}
      />

      {filteredStores.length > 0 ? (
        <ul className="grid grid-cols-2">
          {filteredStores.map((store) => (
            <li key={store.id}>
              <StoreCard store={store} query={searchParams.toString()} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-dark-3">
          <p>該当する店舗が見つかりませんでした。</p>
        </div>
      )}

      <div className="p-10">
        <BackToHomeButton />
      </div>
      <Footer />
    </div>
  );
}