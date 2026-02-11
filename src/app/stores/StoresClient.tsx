'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import StoreCard from '@/components/store/StoreCard';
import BackToHomeButton from '@/components/ui/BackToHomeButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// 統合したフックのみを使用
import { useStores } from '@/hooks/store/useStores';
import { useStoreFilters } from '@/hooks/store/useStoreFilters';
import { useHomeMasters } from '@/hooks/home/useHomeMasters';

export default function StoresClient() {
  const searchParams = useSearchParams();
  const selectedFilters = searchParams.getAll('filters');

  const { externalLabelMap, genericMasters, drinkMasters, loading: mastersLoading } = useHomeMasters();

  /** useStores で全件取得 */
  const { stores: fetchedStores, loading: storesLoading } = useStores();

  const filterKeys = useMemo(() => {
    const lookup = new Map<string, string>();
    genericMasters.forEach(m => lookup.set(m.key.split(':')[1], m.key));
    drinkMasters.forEach(d => lookup.set(d.key, `drinks:${d.key}`));

    return selectedFilters.map(rawKey => lookup.get(rawKey) ?? rawKey);
  }, [selectedFilters, genericMasters, drinkMasters]);

  const { filteredStores } = useStoreFilters(fetchedStores, { filters: filterKeys });

  const displayLabels = useMemo(() => {
    if (mastersLoading) return "";
    return filterKeys.map(key => externalLabelMap.get(key) ?? key).join(', ');
  }, [mastersLoading, filterKeys, externalLabelMap]);

  if (mastersLoading || storesLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="bg-white text-dark-5">
      <Header variant="result" count={filteredStores.length} labels={displayLabels} />
      <ul className="grid grid-cols-2">
        {filteredStores.map((store) => (
          <li key={store.id}>
            <StoreCard store={store} query={searchParams.toString()} />
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