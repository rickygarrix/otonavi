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
    store.image_url && store.image_url.trim() !== ''
      ? store.image_url
      : '/noshop.svg';

  // =========================
  // 表示ラベル（所在地のみ）
  // ・東京：area があれば「東京 + area」
  // ・東京：area がなければ「東京」
  // ・東京以外：都道府県のみ
  // =========================
  const isTokyo = store.prefecture_label === '東京都';

  const locationLabel = isTokyo
    ? store.area_label
      ? `東京 ${store.area_label}`
      : '東京'
    : store.prefecture_label ?? '';

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
          <p className="line-clamp-2 text-xs leading-[1.2]">
            {store.name}
          </p>
        </div>

        {locationLabel && (
          <p className="text-light-5 line-clamp-1 text-[10px]">
            {locationLabel}
          </p>
        )}
      </div>
    </div>
  );
}