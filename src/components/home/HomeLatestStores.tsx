'use client';

// 1. インポートパスを統合後の場所へ変更
import StoreCard from '@/components/store/StoreCard';
import type { HomeStoreLite } from '@/types/store';

type Props = {
  stores: HomeStoreLite[];
};

export default function HomeLatestStores({ stores }: Props) {
  // 並び替えロジック
  const latestStores = [...stores]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 3);

  if (latestStores.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-2 rounded-3xl border border-white/10 bg-black/5 px-2 pt-4 pb-2 backdrop-blur-lg">
      <h2 className="text-center text-sm tracking-widest text-light-4">
        最近更新された音箱
      </h2>

      <ul className="flex items-start">
        {latestStores.map((store) => (
          <li key={store.id} className="flex-1">
            {/* 2. isHome を付与してホーム用レイアウトを適用 */}
            <StoreCard store={store} isHome />
          </li>
        ))}
      </ul>
    </div>
  );
}