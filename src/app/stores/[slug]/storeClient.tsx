'use client';

import { useState, useEffect } from 'react';
import type { HomeStore } from '@/types/store';
import StoreDetailView from '@/components/store/StoreDetailView';
import Header from '@/components/ui/Header';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function StoreClient({ store }: { store: any }) {
  // 画像があるかチェック
  const hasImages = (store.store_galleries?.length ?? 0) > 0;

  // 画像がない場合は最初から「画像読み込み完了」の状態にする
  const [imageLoaded, setImageLoaded] = useState(!hasImages);

  // マウント後のチラつき防止（任意）
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative -mt-20 bg-white">
      {/* メイン画像が読み込まれるまでオーバーレイを表示 */}
      {!imageLoaded && <LoadingOverlay />}

      <Header variant="title" title={store.name} />

      <StoreDetailView
        store={store}
        onMainImageLoaded={() => setImageLoaded(true)}
      />
    </div>
  );
}