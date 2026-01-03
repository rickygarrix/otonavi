'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import type { HomeStore } from '@/types/store';
import StoreCard from '@/components/store/StoreCard';
import Footer from '@/components/ui/Footer';
import HomeButton from '@/components/ui/HomeButton';
import BackToHomeButton from '@/components/ui/BackToHomeButton';

import { useHomeStores } from '@/hooks/useHomeStores';

export default function StoresClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { stores } = useHomeStores();

  const params = searchParams.toString();
  const selectedFilters = searchParams.getAll('filters');
  const idParams = searchParams.getAll('ids');

  const filteredStores: HomeStore[] =
    idParams.length > 0 ? stores.filter((s) => idParams.includes(s.id)) : stores;

  return (
    <div className="text-dark-5 flex min-h-screen flex-col bg-white pt-20">
      {/* ヘッダー */}
      <div className="fixed top-0 left-0 z-100 flex w-full justify-center">
        <header className="m-auto flex h-20 w-full max-w-105 items-center gap-4 bg-white/80 px-4 backdrop-blur-lg">
          <HomeButton />

          {/* 件数 */}
          <div className="shrink-0 text-lg leading-none font-bold tracking-widest">
            {filteredStores.length}
            <span className="ml-1 text-[10px]">件</span>
          </div>

          {/* 選択条件（項目のみ列挙） */}
          {selectedFilters.length > 0 && (
            <div className="line-clamp-2 flex-1 text-xs leading-snug text-blue-700">
              {selectedFilters.join(', ')}
            </div>
          )}
        </header>
      </div>

      {/* 店舗一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredStores.map((s) => (
            <div key={s.id} className="flex min-h-[250px]">
              <StoreCard store={s} query={params} />
            </div>
          ))}
        </div>
      </div>

      <BackToHomeButton onClick={() => router.push('/')} className="px-6 pb-8" />

      <Footer />
    </div>
  );
}
