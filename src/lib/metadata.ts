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
export function staticPage(opts: { title: string; path: string; description?: string }): Metadata {
  const url = new URL(opts.path, SITE_URL).toString();
  const title = `${opts.title}｜${SITE_NAME}`;
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
export function storesSearch(opts: { filters: string[]; storeTypeId?: string }): Metadata {
  const title =
    !opts.filters.length && !opts.storeTypeId
      ? `検索結果｜${SITE_NAME}`
      : `条件付き検索結果｜${SITE_NAME}`;

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
