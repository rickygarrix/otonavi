"use client"

import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-white py-10 px-6">
      {/* ロゴ */}
      <div className="flex items-center space-x-3 mb-8">
        <Image
          src="/logo2.svg"
          alt="Otonavi Logo"
          width={36}
          height={36}
        />
      </div>

      {/* メニュー */}
      <nav className="flex flex-col space-y-6 mb-10 text-[16px] text-white/90">
        <Link href="/lp" className="hover:opacity-70">
          オトナビとは？
        </Link>
        <Link href="/terms" className="hover:opacity-70">
          利用規約
        </Link>
        <Link href="/privacy" className="hover:opacity-70">
          プライバシーポリシー
        </Link>
        <Link href="/tokusho" className="hover:opacity-70">
          特定商取引法に基づく表記
        </Link>

        <Link href="/contact" className="hover:opacity-70">
          お問い合わせ
        </Link>
      </nav>

      {/* コピーライト */}
      <p className="text-sm text-white/60">© Otonavi</p>
    </footer>
  )
}