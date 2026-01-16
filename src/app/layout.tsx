import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
    '夜の音楽体験をもっと身近にする音箱検索サイト。エリアやこだわり条件で絞って、お気に入りのクラブ・バー・ライブハウスを探せます。',
  icons: {
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="bg-dark-5 flex items-start justify-center">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-light-1 text-dark-5 mx-auto w-full max-w-105 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
