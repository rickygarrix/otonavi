import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

import ServiceWorkerRegister from './_pwa/ServiceWorkerRegister';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_NAME = 'オトナビ｜音箱検索サイト';
const SITE_DESC = '夜の音楽体験をもっと身近にする音箱検索サイト。エリアやこだわり条件で絞って、お気に入りのクラブ・バー・ライブハウスを探せます。';
const SITE_URL = 'https://otnv.jp';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: SITE_NAME,
  description: SITE_DESC,

  robots: {
    index: true,
    follow: true,
  },

  // 正規のURL
  alternates: {
    canonical: SITE_URL,
  },

  // OGP
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: 'オトナビ',
    type: 'website',
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: 'ja_JP',
  },

  // X
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESC,
    images: ['/ogp.png'],
  },

  // icon
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },

  // PWA
  appleWebApp: {
    capable: true,
    title: 'オトナビ',
    statusBarStyle: 'black-translucent',
  },

  themeColor: '#081624',
};

const GA_ID = 'G-WEZPMCLCSW';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="bg-dark-5 flex items-start justify-center">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-light-1 text-dark-5 mx-auto w-full max-w-105 antialiased`}
      >
        {/* ★ PWA判定用（超重要） */}
        <ServiceWorkerRegister />

        {children}

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}