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

import {
  useHomeStoreCards,
  useHomeMasters,
  useHomeFilterState,
} from '@/hooks/home';
import { useStoresForSearch, useStoreFilters } from '@/hooks/store';

import type { GenericMaster } from '@/types/master';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /** URL filters */
  const urlFilters = useMemo(
    () => searchParams.getAll('filters'),
    [searchParams],
  );

  /** 店舗タイプ（venue_types.key） */
  const [storeTypeKey, setStoreTypeKey] = useState<string | null>(null);

  /** clear 用 */
  const [clearKey, setClearKey] = useState(0);

  /** 最新店舗 */
  const { stores: cardStores, loading } = useHomeStoreCards(12);

  /** masters */
  const masters = useHomeMasters();

  const storeTypes = useMemo<GenericMaster[]>(() => {
    return Array.from(masters.genericMasters.values()).filter(
      (m) => m.table === 'venue_types',
    );
  }, [masters.genericMasters]);

  /** key → table Map（復元の核） */
  const keyToTableMap = useMemo(() => {
    const map = new Map<string, string>();
    masters.genericMasters.forEach((m) => {
      map.set(m.key, m.table);
    });
    return map;
  }, [masters.genericMasters]);

  /** URL → 店舗タイプ復元 */
  useEffect(() => {
    if (!storeTypes.length) return;

    const found = urlFilters.find((f) =>
      storeTypes.some((t) => t.key === f),
    );

    setStoreTypeKey(found ?? null);
  }, [urlFilters, storeTypes]);

  /** フィルタ state（URL 起点） */
  const filter = useHomeFilterState(masters.externalLabelMap, {
    initialKeys: urlFilters,
    keyToTableMap,
  });

  const {
    selectedKeys,
    selectedLabels,
    handleClear,
    ...setters
  } = filter;

  /** 件数計算 */
  const { stores: searchStores } = useStoresForSearch();
  const { filteredStores } = useStoreFilters(searchStores, {
    filters: storeTypeKey
      ? [storeTypeKey, ...selectedKeys]
      : selectedKeys,
  });

  /** 全クリア */
  const handleClearAll = () => {
    handleClear();
    setClearKey((v) => v + 1);
    setStoreTypeKey(null);
    router.replace('/', { scroll: false });
  };

  /** 検索実行 */
  const handleGoToStores = () => {
    const params = new URLSearchParams();

    if (storeTypeKey) params.append('filters', storeTypeKey);
    selectedKeys.forEach((k) => params.append('filters', k));

    router.push(`/stores?${params.toString()}`);
  };

  /** チップ → セクションスクロール */
  const handleClickFilter = (label: string) => {
    const section = masters.labelToSectionMap.get(label);
    if (!section) return;

    sectionRefs.current[section]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  /** SearchBar 表示ラベル */
  const displayLabels = useMemo(() => {
    const labels: string[] = [];

    if (storeTypeKey) {
      const typeLabel = storeTypes.find(
        (t) => t.key === storeTypeKey,
      )?.label;
      if (typeLabel) labels.push(typeLabel);
    }

    labels.push(...selectedLabels);
    return labels;
  }, [storeTypeKey, storeTypes, selectedLabels]);

  return (
    <>
      {/* ヒーロー */}
      <div className="relative flex h-146 flex-col items-center gap-10 overflow-hidden bg-[url('/background-sp@2x.png')] bg-cover bg-center px-4 pt-20 text-light-3">
        <p className="text-[10px] tracking-widest">
          夜の音楽をもっと楽しむための音箱ナビ
        </p>

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

      {/* 店舗タイプ */}
      <StoreTypeFilter
        storeTypes={storeTypes}
        activeTypeKey={storeTypeKey}
        onChange={setStoreTypeKey}
      />

      {/* フィルタ */}
      <HomeFilterSections
        clearKey={clearKey}
        sectionRefs={sectionRefs}
        {...setters}
      />

      {/* 検索バー */}
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