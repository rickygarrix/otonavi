'use client';

import Image from 'next/image';
import type { HomeStore } from '@/types/store';

type Props = {
  store: HomeStore;
};

const STATUS_BADGE_MAP = {
  normal: { bg: 'bg-green-4', text: 'text-green-1', label: '通常営業' },
  temporary: { bg: 'bg-yellow-4', text: 'text-yellow-1', label: '一時休業' },
  closed: { bg: 'bg-red-4', text: 'text-red-1', label: '閉店' },
  irregular: { bg: 'bg-purple-4', text: 'text-purple-1', label: '不定期営業' },
} as const;

export default function StoreBasicInfo({ store }: Props) {
  // ステータスの判定を強化
  const statusKey = store.status_key as keyof typeof STATUS_BADGE_MAP;
  const status = STATUS_BADGE_MAP[statusKey] || null;

  // SNSリンク
  const snsLinks = [
    { href: store.official_site_url, img: '/web@2x.png', alt: '公式サイト' },
    { href: store.instagram_url, img: '/instagram@2x.png', alt: 'Instagram' },
    { href: store.x_url, img: '/x@2x.png', alt: 'X' },
    { href: store.facebook_url, img: '/facebook@2x.png', alt: 'Facebook' },
    { href: store.tiktok_url, img: '/tiktok@2x.png', alt: 'TikTok' },
  ].filter(link => !!link.href);

  // 表示用テキストの優先順位付け（labelが空の場合の対策）
  const pref = store.prefecture_label || store.prefecture_name;
  const city = store.city_label || store.city_name;
  const type = store.type_label || store.venue_type;

  return (
    <div className={`flex flex-col gap-4 p-4 text-center ${store.id === 'default' ? 'mt-20' : 'mt-8'}`}>

      {/* ステータス + ロケーション */}
      <div className="flex flex-wrap items-center justify-center text-xs text-dark-2 min-h-[24px]">
        {status && (
          <div className="pr-2 inline-flex items-center">
            <div className={`px-2 py-1 rounded-full inline-flex items-center ${status.bg}`}>
              <span className={`${status.text} text-[10px] leading-none font-bold whitespace-nowrap`}>
                {status.label}
              </span>
            </div>
          </div>
        )}

        {/* エリア・タイプの表示（データがある場合のみドットを出す） */}
        <div className="flex items-center gap-1">
          {pref && <span>{pref}</span>}
          {city && <span>{city}</span>}
          {(pref || city) && type && <span className="mx-1 opacity-50">・</span>}
          {type && <span>{type}</span>}
        </div>
      </div>

      {/* 店舗名 */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold leading-tight text-dark-5">{store.name}</h1>
        {store.kana && (
          <p className="text-dark-3 text-[10px] tracking-[0.15em]">{store.kana}</p>
        )}
      </div>

      {/* 説明文 */}
      {store.description && (
        <p className="text-dark-2 text-xs whitespace-pre-line leading-relaxed px-2">
          {store.description}
        </p>
      )}

      {/* SNSリンク */}
      <div className="flex items-center justify-center gap-2 py-2">
        {snsLinks.map((link) => (
          <ShareButton key={link.alt} href={link.href!} image={link.img} alt={link.alt} />
        ))}
      </div>
    </div>
  );
}

function ShareButton({ href, image, alt }: { href: string; image: string; alt: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-14 w-14 transition-transform active:scale-95 hover:opacity-80"
    >
      <Image src={image} alt={alt} fill className="object-contain" />
    </a>
  );
}