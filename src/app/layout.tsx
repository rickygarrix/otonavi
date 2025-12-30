import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "オトナビ",
  description: "音箱・クラブ・バーを探す大人のための音楽スポット検索",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[url(/background-pc.png)] bg-cover bg-fixed flex justify-center items-start`}>
        <div className="sp-frame max-w-105 w-full bg-light-1 mx-auto">
          {children}
        </div>
      </body>
    </html>
  )
}