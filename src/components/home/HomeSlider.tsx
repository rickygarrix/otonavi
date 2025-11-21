'use client'

import { useState, useEffect, useRef } from 'react'
import HomeStoreCard from './HomeStoreCard'
import type { HomeStore } from '@/types/store'

export default function HomeSlider({ stores }: { stores: HomeStore[] }) {
  if (stores.length === 0) return null

  // ループ用に3倍に増やす
  const loopStores = [...stores, ...stores, ...stores]
  const middleIndex = stores.length

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(middleIndex)

  // -----------------------
  // 中央カードを検出
  // -----------------------
  const handleScroll = () => {
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

  // -----------------------
  // 初期位置：中央に合わせる
  // -----------------------
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const cardWidth = el.children[0]?.clientWidth ?? 300
    const gap = 24 // gap-6 = 24px

    // カードの中心を画面中央に持ってくる scrollLeft を計算
    const containerCenter = el.clientWidth / 2
    const targetOffset =
      middleIndex * (cardWidth + gap) + cardWidth / 2 - containerCenter

    el.scrollLeft = targetOffset

    handleScroll()
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  // -----------------------
  // 無限ループ化
  // -----------------------
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const cardWidth = el.children[0]?.clientWidth ?? 300
    const gap = 24

    const totalWidth =
      (cardWidth + gap) * loopStores.length

    const middleOffset =
      (cardWidth + gap) * middleIndex

    const handleLoop = () => {
      if (el.scrollLeft < cardWidth) {
        el.scrollLeft += middleOffset
      } else if (el.scrollLeft > totalWidth - cardWidth) {
        el.scrollLeft -= middleOffset
      }
    }

    el.addEventListener('scroll', handleLoop)
    return () => el.removeEventListener('scroll', handleLoop)
  }, [loopStores])

  return (
    <>
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