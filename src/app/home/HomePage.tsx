'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import CommentSlider from '@/components/home/CommentSlider';
import HomeLatestStores from '@/components/home/HomeLatestStores';
import StoreTypeFilter from '@/components/selectors/StoreTypeFilter';
import SearchBar from '@/components/home/SearchBar';
import Footer from '@/components/ui/Footer';
import HomeFilterSections from '@/components/home/HomeFilterSections';

import { useHomeFilterState } from '@/hooks/home/useHomeFilterState';
import { useHomeMasters } from '@/hooks/home/useHomeMasters';
import { useStores } from '@/hooks/store/useStores';
import { useStoreFilters } from '@/hooks/store/useStoreFilters';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const masters = useHomeMasters();
  const { stores: allStores, loading } = useStores({ limit: 12 });
  const urlFilters = useMemo(() => searchParams.getAll('filters'), [searchParams]);

  const [storeTypeKey, setStoreTypeKey] = useState<string | null>(null);

  const filter = useHomeFilterState(masters.externalLabelMap, {
    initialKeys: urlFilters,
    keyToTableMap: masters.keyToTableMap,
    cityMap: masters.cityMap,
  });

  const { selectedKeys, selectedLabels, filterMap, handleClear, ...setters } = filter;

  useEffect(() => {
    if (masters.loading || !masters.storeTypes.length) return;

    const foundType = masters.storeTypes.find((t) => {
      const pureKey = t.key.split(':')[1];
      return urlFilters.includes(pureKey);
    });

    setStoreTypeKey(foundType ? foundType.key : null);
  }, [urlFilters, masters.storeTypes, masters.loading]);

  const { stores: fetchStores } = useStores();
  const { filteredStores } = useStoreFilters(fetchStores, {
    filters: storeTypeKey ? [storeTypeKey, ...selectedKeys] : selectedKeys,
  });

  const handleClearAll = () => {
    handleClear();
    setStoreTypeKey(null);
    router.replace('/', { scroll: false });
  };

  const handleGoToStores = () => {
    const params = new URLSearchParams();
    const deflate = (k: string) => k.includes(':') ? k.split(':')[1] : k;

    if (storeTypeKey) {
      params.append('filters', deflate(storeTypeKey));
    }

    selectedKeys.forEach((k) => {
      const isStoreType = masters.storeTypes.some(t => t.key === k);
      if (!isStoreType) {
        params.append('filters', deflate(k));
      }
    });

    router.push(`/stores?${params.toString()}`);
  };

  const handleClickFilter = (label: string) => {
    const section = masters.labelToSectionMap.get(label);
    if (section) sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ---------------------------------------------------------
  // 修正箇所: 型を string[] と明示
  // ---------------------------------------------------------
  const displayLabels = useMemo(() => {
    if (masters.loading || !masters.externalLabelMap.size) return [];

    const labels: string[] = []; // 型アノテーションを追加

    if (storeTypeKey) {
      const typeLabel = masters.externalLabelMap.get(storeTypeKey);
      if (typeLabel) labels.push(typeLabel);
    }

    selectedLabels.forEach(label => {
      const isStoreTypeLabel = masters.storeTypes.some(t => t.label === label);
      if (!isStoreTypeLabel && !labels.includes(label)) {
        labels.push(label);
      }
    });

    return labels;
  }, [masters.loading, masters.externalLabelMap, storeTypeKey, selectedLabels, masters.storeTypes]);

  return (
    <>
      <div className="text-light-3 relative flex h-146 flex-col items-center gap-10 overflow-hidden bg-[url('/background-sp@2x.png')] bg-cover bg-center px-4 pt-20">
        <p className="text-[10px] tracking-widest">夜の音楽をもっと楽しむための音箱ナビ</p>
        <Image src="/logo-white.svg" alt="オトナビ" width={200} height={60} className="drop-shadow-lg" />
        {!loading && <HomeLatestStores stores={allStores} />}
        <CommentSlider />
      </div>

      <StoreTypeFilter
        storeTypes={masters.storeTypes}
        activeTypeKey={storeTypeKey}
        onChange={(key) => setStoreTypeKey(key)}
      />

      <HomeFilterSections
        sectionRefs={sectionRefs}
        filterMap={filterMap}
        {...setters}
      />

      <SearchBar
        selectedFilters={displayLabels}
        onClear={handleClearAll}
        onSearch={handleGoToStores}
        count={filteredStores.length}
        onClickFilter={handleClickFilter}
      />
      <Footer hasFixedBottom />
    </>
  );
}