'use client';

import HomeStoreCard from '../home/HomeStoreCard';
import type { HomeStoreLite } from '@/types/store';

type Props = {
  stores: HomeStoreLite[];
};

export default function HomeLatestStores({ stores }: Props) {
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
      <h2 className="text-center text-sm tracking-widest">
        最近更新された音箱
      </h2>

      <ul className="flex items-start">
        {latestStores.map((store) => (
          <li
            key={store.id}
            className="flex-1"
          >
            <HomeStoreCard store={store} />
          </li>
        ))}
      </ul>
    </div>
  );
}