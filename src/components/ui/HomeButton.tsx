"use client"

import Image from "next/image"

type Props = {
  onHome: () => void
  size?: number
  iconSize?: number
  className?: string
}

export default function HomeButton({
  onHome,
  size = 56,
  iconSize = 28,
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
          src="/logo_white.svg"
          alt="Home"
          fill
          className="object-contain"
        />
      </div>
    </button>
  )
}