'use client';

import { useState, useEffect } from 'react';
// HomeStore をインポートするように修正
import type { HomeStore } from '@/types/store';
import StoreDetailView from '@/components/store/StoreDetailView';
import Header from '@/components/ui/Header';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// 引数の型を HomeStore に指定
export default function StoreClient({ store }: { store: HomeStore }) {
  // HomeStore 型の定義に合わせて画像チェック
  // HomeStore では gallery_url（文字列）が必須定義になっているため、
  // もし store_galleries を直接参照したい場合は型定義の調整が必要ですが、
  // 現状の HomeStore のプロパティに基づいて判定します。
  const hasImages = !!store.gallery_url && store.gallery_url !== '/noshop.svg';

  // 画像がない場合は最初から「画像読み込み完了」の状態にする
  const [imageLoaded, setImageLoaded] = useState(!hasImages);

  // マウント後のチラつき防止
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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