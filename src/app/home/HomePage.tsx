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

  // 店舗タイプ専用のステート
  const [storeTypeKey, setStoreTypeKey] = useState<string | null>(null);

  const filter = useHomeFilterState(masters.externalLabelMap, {
    initialKeys: urlFilters,
    keyToTableMap: masters.keyToTableMap,
    cityMap: masters.cityMap,
  });

  const { selectedKeys, selectedLabels, filterMap, handleClear, ...setters } = filter;

  // URLから戻った時の復元ロジック（単一選択を保証）
  useEffect(() => {
    if (masters.loading || !masters.storeTypes.length) return;

    const foundType = masters.storeTypes.find((t) => {
      const pureKey = t.key.split(':')[1];
      return urlFilters.includes(pureKey);
    });

    setStoreTypeKey(foundType ? foundType.key : null);
  }, [urlFilters, masters.storeTypes, masters.loading]);

  // 件数計算：storeTypeKey は常に1つだけ配列に含める
  const { stores: fetchStores } = useStores();
  const { filteredStores } = useStoreFilters(fetchStores, {
    filters: storeTypeKey ? [storeTypeKey, ...selectedKeys] : selectedKeys,
  });

  const handleClearAll = () => {
    handleClear();
    setStoreTypeKey(null);
    router.replace('/', { scroll: false });
  };

  // 検索実行時の遷移処理
  const handleGoToStores = () => {
    const params = new URLSearchParams();
    const deflate = (k: string) => k.includes(':') ? k.split(':')[1] : k;

    // 1. 店舗タイプを最初に入れる（1つのみ）
    if (storeTypeKey) {
      params.append('filters', deflate(storeTypeKey));
    }

    // 2. その他の属性（店舗タイプと重複するキーは除外して追加）
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

  const displayLabels = useMemo(() => {
    if (masters.loading || !masters.externalLabelMap.size) return [];
    const labels = [];
    if (storeTypeKey) {
      const typeLabel = masters.externalLabelMap.get(storeTypeKey);
      if (typeLabel) labels.push(typeLabel);
    }
    // 店舗タイプ以外のラベルのみを合成
    selectedLabels.forEach(label => {
      const isStoreTypeLabel = masters.storeTypes.some(t => t.label === label);
      if (!isStoreTypeLabel && !labels.includes(label)) labels.push(label);
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

      {/* onChange 時は引数で渡ってきた key で上書きすることで単一選択を維持 */}
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