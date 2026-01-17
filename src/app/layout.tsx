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

export const metadata: Metadata = {
  title: 'オトナビ｜音箱検索サイト',
  description:
    '夜の音楽体験をもっと身近にする音箱検索サイト。',
  icons: {
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'オトナビ',
    statusBarStyle: 'black-translucent',
  },
  themeColor: '#000000',
};

const GA_ID = 'G-WEZPMCLCSW';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="bg-dark-5 flex items-start justify-center">
      <head>
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
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-light-1 text-dark-5 mx-auto w-full max-w-105 antialiased`}
      >
        {/* ★ PWA判定用（超重要） */}
        <ServiceWorkerRegister />

        {children}
      </body>
    </html>
  );
}