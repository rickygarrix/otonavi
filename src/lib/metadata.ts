import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESC } from '@/lib/site';

const ogImage = new URL('/ogp.png', SITE_URL).toString();

// 基本のメタデータ
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: `%s｜${SITE_NAME}`,
  },

  description: SITE_DESC,

  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'ja_JP',
    images: [ogImage],
  },

  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },

  appleWebApp: {
    capable: true,
    title: 'オトナビ',
    statusBarStyle: 'black-translucent',
  },

  themeColor: '#081624',
};

// 検索結果に表示しないページ用
export function noindex(partial: Metadata): Metadata {
  return {
    ...partial,
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

// 静的ページ用
export function staticMeta(opts: { title: string; path: string; description?: string }): Metadata {
  const url = new URL(opts.path, SITE_URL).toString();
  const title = opts.title;
  const description = opts.description ?? SITE_DESC;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, images: [ogImage] },
    twitter: { title, description, images: [ogImage] },
  };
}

// 検索結果ページのクエリは無視して正規化
export function storesMeta(opts: { filters: string[]; storeTypeId?: string }): Metadata {
  const title = !opts.filters.length && !opts.storeTypeId ? '検索結果' : '条件付き検索結果';

  const description =
    'オトナビの検索結果一覧。エリアやこだわり条件で音箱（クラブ・バー・ライブハウス等）を探せます。';

  const canonical = new URL('/stores', SITE_URL).toString();

  return noindex({
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title,
      description,
      images: [ogImage],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  });
}

// 音箱詳細ページ用
export function storeMeta(store: StoreMetaArgs): Metadata {
  // 非公開・無効店舗は検索に出さない
  if (!store.isActive) {
    return noindex({
      title: store.name ?? '店舗',
      description: SITE_DESC,
    });
  }

  const title = store.name; // ★ サイト名は付けない
  const description =
    (store.description && store.description.trim()) ||
    `${store.name}の会場情報・アクセス・設備などを掲載。`;

  const canonical = new URL(`/stores/${store.slug}`, SITE_URL).toString();
  const image = store.ogImageUrl || ogImage;

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      url: canonical,
      title: `${title}｜${SITE_NAME}`,
      description,
      images: [image],
      locale: 'ja_JP',
      type: 'article',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${title}｜${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}
