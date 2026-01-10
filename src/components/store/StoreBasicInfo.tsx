'use client';

import Image from 'next/image';
import type { HomeStore } from '@/types/store';

type Props = {
  store: HomeStore;
};

export default function StoreBasicInfo({ store }: Props) {
  return (
    <div className="mt-8 flex flex-col gap-4 p-4 text-center">
      <div className="text-dark-2 flex justify-center gap-1 text-xs">
        <span>{store.prefecture_label}</span>
        <span>{store.area_label}</span>
        <span>・</span>
        <span>{store.type_label}</span>
      </div>

      <div className="flex flex-col gap-2 font-bold">
        {/* 店舗名 */}
        <h1 className="text-2xl leading-[1.5]">{store.name}</h1>

        {/* 読み仮名 */}
        {store.name_kana && (
          <p className="text-dark-3 text-[10px] leading-[1.5] tracking-widest">{store.name_kana}</p>
        )}
      </div>

      {/* 説明文 */}
      {store.description && (
        <p className="text-dark-2 text-xs whitespace-pre-line">{store.description}</p>
      )}

      {/* シェアボタン */}
      <div className="flex items-center justify-center gap-2 py-2">
        {store.official_site_url && (
          <ShareButton href={store.official_site_url} image="/web@2x.png" alt="公式サイトを開く" />
        )}

        {store.instagram_url && (
          <ShareButton
            href={store.instagram_url}
            image="/instagram@2x.png"
            alt="公式Instagramを開く"
          />
        )}

        {store.x_url && <ShareButton href={store.x_url} image="/x@2x.png" alt="公式Xを開く" />}

        {store.facebook_url && (
          <ShareButton
            href={store.facebook_url}
            image="/facebook@2x.png"
            alt="公式Facebookを開く"
          />
        )}

        {store.tiktok_url && (
          <ShareButton href={store.tiktok_url} image="/tiktok@2x.png" alt="公式TikTokを開く" />
        )}
      </div>
    </div>
  );
}

function ShareButton({ href, image, alt }: { href: string; image: string; alt: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="relative h-14 w-14">
      <Image src={image} alt={alt} fill className="object-contain" />
    </a>
  );
}
