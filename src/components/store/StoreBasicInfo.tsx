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
  // ステータス情報の安全な取得
  const status = store.status_key ? STATUS_BADGE_MAP[store.status_key as keyof typeof STATUS_BADGE_MAP] : null;

  // SNSボタンの設定を一括管理
  const snsLinks = [
    { href: store.official_site_url, img: '/web@2x.png', alt: '公式サイト' },
    { href: store.instagram_url, img: '/instagram@2x.png', alt: 'Instagram' },
    { href: store.x_url, img: '/x@2x.png', alt: 'X' },
    { href: store.facebook_url, img: '/facebook@2x.png', alt: 'Facebook' },
    { href: store.tiktok_url, img: '/tiktok@2x.png', alt: 'TikTok' },
  ].filter(link => link.href); // URLがあるものだけ残す

  return (
    <div className={`flex flex-col gap-4 p-4 text-center ${store.id === 'default' ? 'mt-20' : 'mt-8'}`}>

      {/* ===== ステータス + ロケーション ===== */}
      <div className="flex flex-wrap items-center justify-center text-xs text-dark-2">
        {status && (
          <div className="pr-2 inline-flex flex-col justify-center items-center">
            <div className={`px-2 py-1 rounded-[99px] inline-flex justify-center items-center ${status.bg}`}>
              <span className={`${status.text} text-xs leading-3`}>{status.label}</span>
            </div>
          </div>
        )}
        <span>{store.prefecture_label}</span>
        <span>{store.city_label}</span>
        <span className="mx-1">・</span>
        <span>{store.type_label}</span>
      </div>

      {/* ===== 店舗名 ===== */}
      <div className="flex flex-col gap-2 font-bold">
        <h1 className="text-2xl leading-[1.5]">{store.name}</h1>
        {store.kana && (
          <p className="text-dark-3 text-[10px] leading-[1.5] tracking-widest">{store.kana}</p>
        )}
      </div>

      {/* ===== 説明文 ===== */}
      {store.description && (
        <p className="text-dark-2 text-xs whitespace-pre-line leading-relaxed">
          {store.description}
        </p>
      )}

      {/* ===== シェア (SNSボタン) ===== */}
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
    <a href={href} target="_blank" rel="noopener noreferrer" className="relative h-14 w-14 transition-opacity active:opacity-70">
      <Image src={image} alt={alt} fill className="object-contain" />
    </a>
  );
}