'use client'

import { useState, useEffect, useRef } from 'react'
import HomeStoreCard from './HomeStoreCard'
import type { HomeStore } from '@/types/store'

export default function HomeSlider({ stores }: { stores: HomeStore[] }) {
  if (stores.length === 0) return null

  // ループ用に 3セット分にする
  const loopStores = [...stores, ...stores, ...stores]
  const middleIndex = stores.length // 真ん中のセット開始 index

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(middleIndex)

  // ================================
  // 🎯 中央カード検出
  // ================================
  const detectCenterCard = () => {
    if (!containerRef.current) return
    const el = containerRef.current

    const containerCenter = el.clientWidth / 2
    let closestIndex = 0
    let minDistance = Infinity

    const cards = Array.from(el.children)

    cards.forEach((card, i) => {
      const rect = (card as HTMLElement).getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const diff = Math.abs(cardCenter - containerCenter)

      if (diff < minDistance) {
        minDistance = diff
        closestIndex = i
      }
    })

    setCurrentIndex(closestIndex)
  }

  // ================================
  // 🎯 初期位置を真ん中へ
  // ================================
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const first = el.children[0] as HTMLElement
    const cardWidth = first?.clientWidth ?? 300
    const gap = 24
    const unit = cardWidth + gap

    const containerCenter = el.clientWidth / 2

    // 真ん中セットの先頭カードの中央を画面中央に合わせる
    const targetOffset =
      middleIndex * unit + cardWidth / 2 - containerCenter

    el.scrollLeft = targetOffset

    detectCenterCard()

    el.addEventListener('scroll', detectCenterCard)
    return () => el.removeEventListener('scroll', detectCenterCard)
  }, [])

  // ================================
  // 🔁 無限ループ（右/左にどこまでも）
  // ================================
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const first = el.children[0] as HTMLElement
    const cardWidth = first?.clientWidth ?? 300
    const gap = 24
    const unit = cardWidth + gap

    const totalWidth = unit * loopStores.length
    const middleOffset = middleIndex * unit

    const handleLoop = () => {
      // 左端を超えた → 中央へジャンプ
      if (el.scrollLeft <= unit) {
        el.scrollLeft += middleOffset
      }
      // 右端を超えた → 中央へジャンプ
      else if (el.scrollLeft >= totalWidth - unit * 2) {
        el.scrollLeft -= middleOffset
      }
    }

    el.addEventListener('scroll', handleLoop)
    return () => el.removeEventListener('scroll', handleLoop)
  }, [loopStores])

  return (
    <>
      {/* スライダー */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto flex gap-6 px-6 mt-6 scrollbar-none snap-x snap-mandatory"
      >
        {loopStores.map((s, i) => (
          <div
            key={`${s.id}-${i}`}
            className="snap-center shrink-0 transition-transform duration-300"
            style={{
              transform: `scale(${i === currentIndex ? 1 : 0.8})`,
              opacity: i === currentIndex ? 1 : 0.3,
            }}
          >
            <HomeStoreCard store={s} />
          </div>
        ))}
      </div>

      {/* カード下の説明 */}
      <div className="text-center mt-6 px-8 text-white text-sm opacity-90 min-h-[40px]">
        {loopStores[currentIndex]?.description}
      </div>
    </>
  )
}