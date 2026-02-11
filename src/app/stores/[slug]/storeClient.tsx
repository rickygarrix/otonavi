'use client';

import { useEffect, useState } from 'react';
import { fetchStoreBySlug } from '@/lib/api/store';
import type { HomeStore } from '@/types/store';
import StoreDetailView from '@/components/store/StoreDetailView';
import Header from '@/components/ui/Header';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function StoreClient({ slug }: { slug: string }) {
  const [store, setStore] = useState<HomeStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      setLoading(true);
      const data = await fetchStoreBySlug(slug);
      setStore(data);
      setLoading(false);
    };

    load();
  }, [slug]);

  return (
    <div className="relative -mt-20 bg-white">
      {/* データ取得中、またはメイン画像が読み込まれるまでローディングを表示 */}
      {(loading || !imageLoaded) && <LoadingOverlay />}

      {store && (
        <>
          <Header variant="title" title={store.name} />
          <StoreDetailView
            store={store}
            onMainImageLoaded={() => setImageLoaded(true)}
          />
        </>
      )}
    </div>
  );
}