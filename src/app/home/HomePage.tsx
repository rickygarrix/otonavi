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

  // 1. データ取得
  const masters = useHomeMasters();
  const { stores: allStores, loading } = useStores({ limit: 12 });
  const urlFilters = useMemo(() => searchParams.getAll('filters'), [searchParams]);

  // 2. 状態管理
  const [storeTypeKey, setStoreTypeKey] = useState<string | null>(null);
  const filter = useHomeFilterState(masters.externalLabelMap, {
    initialKeys: urlFilters,
    keyToTableMap: masters.keyToTableMap,
    cityMap: masters.cityMap,
  });

  const { selectedKeys, selectedLabels, handleClear, ...setters } = filter;

  // 3. 複雑なUIロジック（店舗タイプ同期など）
  useEffect(() => {
    if (!masters.storeTypes.length) return;
    const found = urlFilters.find((f) => masters.storeTypes.some((t) => t.key === f));
    setStoreTypeKey(found ?? null);
  }, [urlFilters, masters.storeTypes]);

  // 4. 件数計算
  const { stores: fetchStores } = useStores();
  const { filteredStores } = useStoreFilters(fetchStores, {
    filters: storeTypeKey ? [storeTypeKey, ...selectedKeys] : selectedKeys,
  });

  // 5. ハンドラー
  const handleClearAll = () => {
    handleClear();
    setStoreTypeKey(null);
    router.replace('/', { scroll: false });
  };

  const handleGoToStores = () => {
    const params = new URLSearchParams();
    const deflate = (k: string) => k.includes(':') ? k.split(':')[1] : k;

    if (storeTypeKey) params.append('filters', deflate(storeTypeKey));
    selectedKeys.forEach((k) => params.append('filters', deflate(k)));
    router.push(`/stores?${params.toString()}`);
  };

  const handleClickFilter = (label: string) => {
    const section = masters.labelToSectionMap.get(label);
    if (section) sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

const displayLabels = useMemo(() => {
  // マスタデータがまだ空、あるいは読み込み中の場合は、
  // 中途半端な key を出さないよう空配列を返す
  if (masters.loading || !masters.externalLabelMap.size) return [];

  const labels = [];

  // 店舗タイプ
  if (storeTypeKey) {
    const typeLabel = masters.storeTypes.find((t) => t.key === storeTypeKey)?.label;
    if (typeLabel) labels.push(typeLabel);
  }
  labels.push(...selectedLabels);

  return labels;
}, [masters.loading, masters.externalLabelMap, storeTypeKey, masters.storeTypes, selectedLabels]);

  return (
    <>
      <div className="text-light-3 relative flex h-146 flex-col items-center gap-10 overflow-hidden bg-[url('/background-sp@2x.png')] bg-cover bg-center px-4 pt-20">
        <p className="text-[10px] tracking-widest">夜の音楽をもっと楽しむための音箱ナビ</p>
        <Image src="/logo-white.svg" alt="オトナビ" width={200} height={60} className="drop-shadow-lg" />
        {!loading && <HomeLatestStores stores={allStores} />}
        <CommentSlider />
      </div>

      <StoreTypeFilter storeTypes={masters.storeTypes} activeTypeKey={storeTypeKey} onChange={setStoreTypeKey} />
      <HomeFilterSections sectionRefs={sectionRefs} {...setters} />

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