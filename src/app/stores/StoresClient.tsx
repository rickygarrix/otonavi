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

  // ✅ venue_type_id は使わない
  const selectedFilters = searchParams.getAll('filters');
  const params = searchParams.toString();

  const masters = useHomeMasters();
  const labelMap = masters.externalLabelMap;
  const mastersLoading = masters.loading;

  const { stores: prefetchedStores } = useSearchStore();

  const { stores: fetchedStores, loading: storesLoading } = useStoresForSearch({
    enabled: prefetchedStores.length === 0,
  });

  const baseStores = useMemo(() => {
    return prefetchedStores.length > 0 ? prefetchedStores : fetchedStores;
  }, [prefetchedStores, fetchedStores]);

  const { filteredStores } = useStoreFilters(baseStores, {
    filters: selectedFilters,
  });

  const displayLabels = useMemo(() => {
    if (mastersLoading) return [];

    const labels: string[] = [];

    selectedFilters.forEach((key) => {
      const label = labelMap.get(key);
      if (label) labels.push(label);
    });

    return labels;
  }, [mastersLoading, selectedFilters, labelMap]);

  const isReady =
    prefetchedStores.length > 0 || (!mastersLoading && !storesLoading);

  if (!isReady) {
    return <LoadingOverlay />;
  }

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
        <BackToHomeButton onClick={() => router.push(`/?${params}`)} />
      </div>

      <Footer />
    </div>
  );
}
