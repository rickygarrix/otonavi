'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import CommentSlider from '@/components/home/CommentSlider';
import HomeLatestStores from '@/components/home/HomeLatestStores';
import StoreTypeFilter from '@/components/selectors/StoreTypeFilter';
import SearchBar from '@/components/home/SearchBar';
import Footer from '@/components/ui/Footer';
import HomeFilterSections from '@/components/home/HomeFilterSections';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

import { useHomeStoreCards, useHomeMasters, useHomeFilterState } from '@/hooks/home';
import { useStoresForSearch, useStoreFilters } from '@/hooks/store';

import { fetchStoresForSearch } from '@/lib/fetchStores';
import { useSearchStore } from '@/stores/searchStore';

import type { GenericMaster } from '@/types/master';

export default function HomePage() {
  const router = useRouter();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [storeTypeId, setStoreTypeId] = useState<string | null>(null);
  const [clearKey, setClearKey] = useState(0);

  const { stores: cardStores, loading } = useHomeStoreCards(12);

  const masters = useHomeMasters();

  const storeTypes = useMemo<GenericMaster[]>(() => {
    return Array.from(masters.genericMasters.values()).filter((m) => m.table === 'store_types');
  }, [masters.genericMasters]);

  const filter = useHomeFilterState(masters.externalLabelMap, { storeTypeId });
  const { selectedKeys, selectedLabels, handleClear, prefectureIds, areaIds, ...setters } = filter;

  const { stores: searchStores } = useStoresForSearch();
  const { filteredStores } = useStoreFilters(searchStores, {
    filters: selectedKeys,
    storeTypeId,
  });

  const { setStores, setLoading: setPrefetchLoading, loading: prefetchLoading } = useSearchStore();

  const handleClearAll = () => {
    handleClear();
    setClearKey((v) => v + 1);
    setStoreTypeId(null);
  };

  const handleGoToStores = async () => {
    const params = new URLSearchParams();

    if (storeTypeId) params.set('store_type_id', storeTypeId);
    selectedKeys.forEach((k) => params.append('filters', k));

    const apiFilters = selectedKeys.filter(
      (k) => !prefectureIds.includes(k) && !areaIds.includes(k),
    );

    setPrefetchLoading(true);

    try {
      const result = await fetchStoresForSearch({
        filters: apiFilters,
        storeTypeId,
        prefectureId: prefectureIds[0] ?? null,
        areaIds,
      });

      setStores(result);

      router.push(`/stores?${params.toString()}`);
    } catch (err) {
      console.error('Failed to prefetch stores:', err);
    } finally {
      setTimeout(() => {
        setPrefetchLoading(false);
      }, 200);
    }
  };

  const handleClickFilter = (label: string) => {
    const section = masters.labelToSectionMap.get(label);
    if (!section) return;

    sectionRefs.current[section]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      {prefetchLoading && <LoadingOverlay />}

      <div className="text-light-3 relative flex h-146 flex-col items-center gap-10 overflow-hidden bg-[url('/background-sp@2x.png')] bg-cover bg-center px-4 pt-20">
        <p className="text-[10px] tracking-widest">夜の音楽をもっと楽しむための音箱ナビ</p>

        <Image
          src="/logo-white.svg"
          alt="オトナビ"
          width={200}
          height={60}
          className="drop-shadow-lg"
        />

        {!loading && <HomeLatestStores stores={cardStores} />}

        <CommentSlider />
      </div>

      <StoreTypeFilter
        storeTypes={storeTypes}
        activeTypeId={storeTypeId}
        onChange={setStoreTypeId}
      />

      <HomeFilterSections
        clearKey={clearKey}
        sectionRefs={sectionRefs}
        setPrefectureIds={setters.setPrefectureIds}
        setAreaIds={setters.setAreaIds}
        setCustomerKeys={setters.setCustomerKeys}
        setAtmosphereKeys={setters.setAtmosphereKeys}
        setSizeKey={setters.setSizeKeys}
        setDrinkKeys={setters.setDrinkKeys}
        setPriceRangeKeys={setters.setPriceRangeKeys}
        setPaymentMethodKeys={setters.setPaymentMethodKeys}
        setEventTrendKeys={setters.setEventTrendKeys}
        setBaggageKeys={setters.setBaggageKeys}
        setSmokingKeys={setters.setSmokingKeys}
        setToiletKeys={setters.setToiletKeys}
        setEnvironmentKeys={setters.setEnvironmentKeys}
        setOtherKeys={setters.setOtherKeys}
      />

      <SearchBar
        selectedFilters={selectedLabels}
        onClear={handleClearAll}
        onSearch={handleGoToStores}
        count={filteredStores.length}
        onClickFilter={handleClickFilter}
      />

      <Footer hasFixedBottom />
    </>
  );
}
