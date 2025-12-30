"use client"

import { useEffect, useRef, useState, ReactNode } from "react"

type Props = {
  children: ReactNode
  zIndex?: number
}

export default function SearchFilterStickyWrapper({
  children,
  zIndex = 100, // ★ デフォルトを強めに
}: Props) {
  const [isSticky, setIsSticky] = useState(false)
  const [height, setHeight] = useState(0)

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // 高さ取得
  useEffect(() => {
    if (wrapperRef.current) {
      setHeight(wrapperRef.current.offsetHeight)
    }
  }, [])

  // 画面外に出たら fixed 化
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* sentinel */}
      <div ref={sentinelRef} />

      {/* 本体 */}
      <div
        ref={wrapperRef}
        className={`
          bg-white w-full py-3
          ${isSticky ? "fixed top-0 left-0 right-0 shadow-sm" : ""}
        `}
        style={
          isSticky
            ? { zIndex } // ★ ここが超重要
            : undefined
        }
      >
        {children}
      </div>

      {/* スペーサー */}
      {isSticky && <div style={{ height }} />}
    </>
  )
}