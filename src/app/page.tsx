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

import {
  useHomeStoreCards,
  useHomeMasters,
  useHomeFilterState,
} from '@/hooks/home';
import { useStoresForSearch, useStoreFilters } from '@/hooks/store';

import type { GenericMaster } from '@/types/master';

export default function HomePage() {
  const router = useRouter();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // ✅ venue_type は key ベース
  const [storeTypeKey, setStoreTypeKey] = useState<string | null>(null);
  const [clearKey, setClearKey] = useState(0);

  /** 最新店舗 */
  const { stores: cardStores, loading } = useHomeStoreCards(12);

  /** マスタ */
  const masters = useHomeMasters();

  const storeTypes = useMemo<GenericMaster[]>(() => {
    return Array.from(masters.genericMasters.values()).filter(
      (m) => m.table === 'venue_types',
    );
  }, [masters.genericMasters]);

  /** フィルタ状態 */
  const filter = useHomeFilterState(masters.externalLabelMap);
  const {
    selectedKeys,
    selectedLabels,
    handleClear,
    ...setters
  } = filter;

  /** 件数表示 */
  const { stores: searchStores } = useStoresForSearch();
  const { filteredStores } = useStoreFilters(searchStores, {
    filters: storeTypeKey
      ? [storeTypeKey, ...selectedKeys]
      : selectedKeys,
  });

  const handleClearAll = () => {
    handleClear();
    setClearKey((v) => v + 1);
    setStoreTypeKey(null);
  };

  /**
   * ✅ URL は filters=key のみ
   */
  const handleGoToStores = () => {
    const params = new URLSearchParams();

    if (storeTypeKey) {
      params.append('filters', storeTypeKey);
    }

    selectedKeys.forEach((k) => params.append('filters', k));

    router.push(`/stores?${params.toString()}`);
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

      {/* 店舗タイプ（✅ 修正ここ） */}
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
