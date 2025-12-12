"use client"

import Image from "next/image"

type Props = {
  onHome: () => void             // ホームに戻るための関数
  size?: number                  // 直径（オプション）
  iconSize?: number              // アイコンの大きさ（オプション）
  className?: string             // 追加クラス
}

/**
 * ホームに戻るボタン（どの画面でも共通で使う）
 * 丸い背景 + マップピンのアイコン
 */
export default function HomeButton({
  onHome,
  size = 56,        // デフォルト直径
  iconSize = 28,    // デフォルトのアイコンサイズ
  className = "",
}: Props) {
  return (
    <button
      onClick={onHome}
      className={`
        active:scale-95 transition
        flex items-center justify-center
        rounded-full bg-white shadow
        ${className}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className="relative"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        <Image
          src="/.svg"    // ← あなたのアイコンを書き換えてOK
          alt="Home"
          fill
          className="object-contain"
        />
      </div>
    </button>
  )
}