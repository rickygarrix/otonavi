'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import StoreCard from '@/components/store/StoreCard';
import Footer from '@/components/ui/Footer';
import HomeButton from '@/components/ui/HomeButton';
import BackToHomeButton from '@/components/ui/BackToHomeButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

import { useStoresForSearch } from '@/hooks/store';
import { useHomeMasters } from '@/hooks/home';
import { useSearchStore } from '@/stores/searchStore';

export default function StoresClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedFilters = searchParams.getAll('filters');
  const storeTypeId = searchParams.get('store_type_id');
  const params = searchParams.toString();

  const masters = useHomeMasters();
  const labelMap = masters.externalLabelMap;
  const mastersLoading = masters.loading;

  const { stores: prefetchedStores } = useSearchStore();

  const { stores: fetchedStores, loading: storesLoading } = useStoresForSearch({
    enabled: prefetchedStores.length === 0,
  });

  const displayStores = useMemo(() => {
    return prefetchedStores.length > 0 ? prefetchedStores : fetchedStores;
  }, [prefetchedStores, fetchedStores]);

  const displayLabels = useMemo(() => {
    if (mastersLoading) return [];

    const labels: string[] = [];

    if (storeTypeId) {
      const storeTypeLabel = Array.from(masters.genericMasters.values()).find(
        (m) => m.table === 'store_types' && m.id === storeTypeId
      )?.label;
      if (storeTypeLabel) labels.push(storeTypeLabel);
    }

    selectedFilters.forEach((key) => {
      const label = labelMap.get(key);
      if (label) labels.push(label);
    });

    return labels;
  }, [
    mastersLoading,
    storeTypeId,
    selectedFilters,
    labelMap,
    masters.genericMasters,
  ]);

  const isReady =
    prefetchedStores.length > 0 ||
    (!mastersLoading && !storesLoading);

  if (!isReady) {
    return <LoadingOverlay />;
  }

  return (
    <div className="text-dark-5 bg-white">
      <header className="sticky inset-x-0 top-0 z-100 flex h-20 items-center gap-4 bg-white/90 px-4 backdrop-blur-lg">
        <HomeButton />

        <div className="shrink-0 text-lg font-bold tracking-widest">
          {displayStores.length}
          <span className="ml-1 text-[10px]">件</span>
        </div>

        {displayLabels.length > 0 && (
          <div className="line-clamp-2 flex-1 text-xs text-blue-700">
            {displayLabels.join(', ')}
          </div>
        )}
      </header>

      <ul className="grid grid-cols-2">
        {displayStores.map((store) => (
          <li key={store.id}>
            <StoreCard store={store} query={params} />
          </li>
        ))}
      </ul>

      <div className="p-10">
        <BackToHomeButton onClick={() => router.push('/')} />
      </div>

      <Footer />
    </div>
  );
}