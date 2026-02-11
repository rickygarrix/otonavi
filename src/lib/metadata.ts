import type { Metadata, Viewport } from 'next';

/* =========================
   Constants
========================= */
export const SITE_URL = 'https://otnv.jp';
export const SITE_NAME = 'オトナビ';
export const SITE_TITLE = 'オトナビ｜音箱検索サイト';
export const SITE_DESC = '夜の音楽体験をもっと身近にする音箱検索サイト。エリアやこだわり条件で絞って、お気に入りのクラブ・バー・ライブハウスを探せます。';
export const SITE_THEME_COLOR = '#081624';
export const SITE_BACKGROUND_COLOR = '#F7F9FB';

const ogImage = new URL('/ogp.png', SITE_URL).toString();

/* =========================
   Base Metadata
========================= */
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
      { url: '/favicon-dark.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
      { url: '/favicon-light.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },

  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
};

/* =========================
   Viewport
========================= */
export const baseViewport: Viewport = {
  themeColor: SITE_THEME_COLOR, // 定数を使用
};

/* =========================
   Noindex helper
========================= */
export function noindex(meta: Metadata): Metadata {
  return {
    ...meta,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

/* =========================
   Static Page Metadata
========================= */
export function staticMeta(opts: { title: string; path: string; description?: string }): Metadata {
  const url = new URL(opts.path, SITE_URL).toString();
  const description = opts.description ?? SITE_DESC;

  return {
    title: opts.title,
    description,
    alternates: { canonical: url },

    openGraph: {
      url,
      title: `${opts.title}｜${SITE_NAME}`,
      description,
      images: [ogImage],
      locale: 'ja_JP',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${opts.title}｜${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

/* =========================
   Stores Page Metadata
========================= */
export function storesMeta(opts: { filters: string[]; storeTypeId?: string }): Metadata {
  const title = !opts.filters.length && !opts.storeTypeId ? '検索結果' : '条件付き検索結果';
  const description = 'オトナビの検索結果一覧。エリアやこだわり条件で音箱（クラブ・バー・ライブハウス等）を探せます。';
  const canonical = new URL('/stores', SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      url: canonical,
      title: `${title}｜${SITE_NAME}`,
      description,
      images: [ogImage],
      locale: 'ja_JP',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${title}｜${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}