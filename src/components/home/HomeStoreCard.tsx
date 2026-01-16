<<<<<<< HEAD
'use client'

import type { HomeStore } from '@/types/store'

export default function HomeStoreCard({ store }: { store: HomeStore }) {
  return (
    <div className="w-[260px] rounded-3xl overflow-hidden bg-[#0c0c0c80] backdrop-blur-md shadow-lg text-center">

      <div className="w-full h-60 overflow-hidden">
        {store.image_url ? (
          <img
            src={store.image_url}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="py-3 text-white">
        <p className="font-bold text-lg">{store.name}</p>
        <p className="text-sm opacity-80">
          {store.area} ・ {store.type}
        </p>
      </div>
    </div>
  )
}
=======
'use client';

import Image from 'next/image';
import type { HomeStoreLite } from '@/types/store';

type Props = {
  store: HomeStoreLite;
};

export default function HomeStoreCard({ store }: Props) {
  // =========================
  // 画像
  // =========================
  const imageUrl =
    store.image_url && store.image_url.trim() !== '' ? store.image_url : '/noshop.svg';

  // =========================
  // 表示ラベル（所在地のみ）
  // ・東京：city があれば「東京 + city」
  // ・東京：city がなければ「東京」
  // ・東京以外：都道府県のみ
  // =========================
  const isTokyo = store.prefecture_label === '東京都';

  const locationLabel = isTokyo
    ? store.city_label
      ? `東京 ${store.city_label}`
      : '東京'
    : (store.prefecture_label ?? '');

  return (
    <div className="flex w-full flex-col items-center gap-2 p-2 text-center">
      {/* =========================
          画像
      ========================= */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl">
        <Image
          src={imageUrl}
          alt={store.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          priority
        />
      </div>

      {/* =========================
          テキスト
      ========================= */}
      <div className="flex w-full flex-col gap-1 px-2 py-1">
        <div className="flex h-7 items-center justify-center">
          <p className="line-clamp-2 text-xs leading-[1.2]">{store.name}</p>
        </div>

        {locationLabel && <p className="text-light-5 line-clamp-1 text-[10px]">{locationLabel}</p>}
      </div>
    </div>
  );
}
>>>>>>> fab9ad48916d5735dd0afa7a4044e3f0b4326c74
