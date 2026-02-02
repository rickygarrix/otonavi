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

  const [storeTypeId, setStoreTypeId] = useState<string | null>(null);
  const [clearKey, setClearKey] = useState(0);

  /** ホーム上部の最新店舗 */
  const { stores: cardStores, loading } = useHomeStoreCards(12);

  /** マスタ取得 */
  const masters = useHomeMasters();

  const storeTypes = useMemo<GenericMaster[]>(() => {
    return Array.from(masters.genericMasters.values()).filter(
      (m) => m.table === 'venue_types',
    );
  }, [masters.genericMasters]);

  /** フィルタ状態 */
  const filter = useHomeFilterState(masters.externalLabelMap, { storeTypeId });
  const {
    selectedKeys,
    selectedLabels,
    handleClear,
    prefectureIds,
    cityIds,
    ...setters
  } = filter;

  /** 件数表示用（ローカル計算） */
  const { stores: searchStores } = useStoresForSearch();
  const { filteredStores } = useStoreFilters(searchStores, {
    filters: selectedKeys,
    storeTypeId,
  });

  const handleClearAll = () => {
    handleClear();
    setClearKey((v) => v + 1);
    setStoreTypeId(null);
  };

  /**
   * ✅ 検索実行
   * - fetch しない
   * - クエリだけ組み立てて /stores に遷移
   */
  const handleGoToStores = () => {
    const params = new URLSearchParams();

    if (storeTypeId) params.set('venue_type_id', storeTypeId);
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

      {/* 店舗タイプ */}
      <StoreTypeFilter
        storeTypes={storeTypes}
        activeTypeId={storeTypeId}
        onChange={setStoreTypeId}
      />

      {/* フィルタ */}
      <HomeFilterSections
        clearKey={clearKey}
        sectionRefs={sectionRefs}
        setPrefectureIds={setters.setPrefectureIds}
        setCityIds={setters.setCityIds}
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