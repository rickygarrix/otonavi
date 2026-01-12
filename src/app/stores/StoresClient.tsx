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

  // ===== URL パラメータ =====
  const selectedFilters = searchParams.getAll('filters');
  const storeTypeId = searchParams.get('store_type_id');
  const params = searchParams.toString();

  // ===== マスタ =====
  const masters = useHomeMasters();
  const labelMap = masters.externalLabelMap;
  const mastersLoading = masters.loading;

  // ===== Zustand（Homeで事前取得した完成データ） =====
  const { stores: prefetchedStores } = useSearchStore();

  // ===== 直URLアクセス時のみフェッチ =====
  const { stores: fetchedStores, loading: storesLoading } = useStoresForSearch({
    enabled: prefetchedStores.length === 0,
  });

  // ===== 表示データの決定：Zustand 優先 =====
  const displayStores = useMemo(() => {
    return prefetchedStores.length > 0 ? prefetchedStores : fetchedStores;
  }, [prefetchedStores, fetchedStores]);

  // ===== 表示用ラベル（マスタが揃ってから計算） =====
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

  // ===== ロード完了判定 =====
  // ★ Home で事前取得されている場合は即 Ready
  const isReady =
    prefetchedStores.length > 0 ||
    (!mastersLoading && !storesLoading);

  return (
    <div className="text-dark-5 bg-white">
      {/* ===== 事前取得がない場合のみクルクル ===== */}
      {!isReady && prefetchedStores.length === 0 && <LoadingOverlay />}

      {/* ===== Header ===== */}
      {isReady && (
        <header className="sticky inset-x-0 top-0 z-100 flex h-20 items-center gap-4 bg-white/90 px-4 backdrop-blur-lg">
          <HomeButton />

          {/* 件数 */}
          <div className="shrink-0 text-lg font-bold tracking-widest">
            {displayStores.length}
            <span className="ml-1 text-[10px]">件</span>
          </div>

          {/* 検索条件 */}
          {displayLabels.length > 0 && (
            <div className="line-clamp-2 flex-1 text-xs text-blue-700">
              {displayLabels.join(', ')}
            </div>
          )}
        </header>
      )}

      {/* ===== Store List ===== */}
      {isReady && (
        <ul className="grid grid-cols-2">
          {displayStores.map((store) => (
            <li key={store.id}>
              <StoreCard store={store} query={params} />
            </li>
          ))}
        </ul>
      )}

      <div className="p-10">
        <BackToHomeButton onClick={() => router.push('/')} />
      </div>

      <Footer />
    </div>
  );
}