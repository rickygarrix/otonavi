'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { SearchStore, HomeStoreLite } from '@/types/store';

// カラーマップを統一（少し明るめの 4 を採用）
const STATUS_COLOR_MAP: Record<string, string> = {
  normal: 'bg-green-4',
  temporary: 'bg-yellow-4',
  closed: 'bg-red-4',
  irregular: 'bg-purple-4',
};

type Props = {
  store: SearchStore | HomeStoreLite;
  query?: string;
  isHome?: boolean; // ホーム用レイアウトへの切り替えフラグ
};

export default function StoreCard({ store, query, isHome = false }: Props) {
  // 1. URLの構築（queryがある場合は引き継ぐ）
  const href = query?.trim()
    ? `/stores/${store.slug}?${query}`
    : `/stores/${store.slug}`;

  // 2. 画像パスの解決
  const imageUrl = store.gallery_url?.trim() ? store.gallery_url : '/noshop.svg';

  // 3. エリアラベルの生成
  const locationLabel = store.prefecture_label === '東京都' && store.city_label
    ? `東京 ${store.city_label}`
    : store.prefecture_label ?? '';

  const statusColor = store.status_key ? STATUS_COLOR_MAP[store.status_key] : null;

  // --- レイアウトの分岐 ---

  // ホーム用（中央揃え・コンパクト）
  if (isHome) {
    return (
      <Link href={href} className="flex w-full flex-col items-center gap-2 p-2 text-center transition active:scale-95">
        <div className="relative aspect-square w-full rounded-2xl border border-white/10 backdrop-blur-xl">
          <Image src={imageUrl} alt={store.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover rounded-2xl" priority />
          {statusColor && <span className={`absolute left-0 bottom-0 h-1 w-1 rounded-full ${statusColor}`} />}
        </div>
        <div className="flex w-full flex-col gap-1 px-2 py-1">
          <div className="flex h-7 items-center justify-center">
            <p className="line-clamp-2 text-xs leading-[1.2]">{store.name}</p>
          </div>
          {locationLabel && <p className="line-clamp-1 text-[10px] text-light-5">{locationLabel}</p>}
        </div>
      </Link>
    );
  }

  // 検索結果用（左揃え・標準）
  return (
    <Link href={href} className="w-full rounded-3xl py-2 text-left transition active:scale-95 active:bg-light-1 block">
      <div className="p-2">
        <div className={`relative aspect-square overflow-visible rounded-2xl ${imageUrl === '/noshop.svg' ? 'shadow-none' : 'shadow-sm'}`}>
          <Image src={imageUrl} alt={store.name} fill loading="lazy" sizes="(max-width: 420px) 50vw, 210px" className="object-cover rounded-2xl" />
          {statusColor && <span className={`absolute left-0 bottom-0 h-1 w-1 rounded-full ${statusColor}`} />}
        </div>
      </div>
      <div className="flex flex-col gap-1 px-4 py-1">
        <p className="line-clamp-1 text-sm font-bold leading-[1.5]">{store.name}</p>
        <div className="line-clamp-1 text-xs leading-[1.5] text-dark-4">
          {locationLabel}
          {'type_label' in store && store.type_label && ` ・ ${store.type_label}`}
        </div>
      </div>
    </Link>
  );
}