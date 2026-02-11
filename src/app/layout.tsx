import type { Metadata, Viewport } from 'next';
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from 'next/font/google'; // fonts.ts から移動
import Script from 'next/script';
import './globals.css';
import ServiceWorkerRegister from './_pwa/ServiceWorkerRegister';
import { baseMetadata, baseViewport } from '@/lib/metadata';

const zenMaru = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-zen-maru',
  display: 'swap',
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-zen-kaku',
  display: 'swap',
});

const GA_ID = 'G-WEZPMCLCSW';

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="bg-dark-5 flex items-start justify-center">
      <body
        className={`${zenMaru.variable} ${zenKaku.variable} bg-light-1 text-dark-5 mx-auto w-full max-w-105 antialiased`}
      >
        <ServiceWorkerRegister />

        {children}

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