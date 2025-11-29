'use client'

import { useEffect, useRef, useState } from 'react'
import HomeStoreCard from './HomeStoreCard'
import type { HomeStore } from '@/types/store'

type Props = {
  stores: HomeStore[]
  onSelectStore: (store: HomeStore) => void
}

export default function HomeSlider({ stores, onSelectStore }: Props) {
  if (stores.length === 0) return null

  // 無限ループ用：3セットつなげる
  const loopStores = [...stores, ...stores, ...stores]
  const middleIndex = stores.length // 真ん中のセットの開始点

  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const [currentIndex, setCurrentIndex] = useState(middleIndex)
  const scrollSpeed = 0.35
  const isDragging = useRef(false)

  // =======================================
  // ⭐ カードの縮小カーブ（中心 → 端）
  // =======================================
  const calcScaleOpacity = (diff: number) => {
    const maxRange = 240   // 距離240pxで最小値
    const t = Math.min(diff / maxRange, 1)

    // 中央1.0 → 端0.50（自然なカーブ）
    const scale = 1 - t * 0.50
    const opacity = 1 - t * 0.55

    return { scale, opacity }
  }

  // =======================================
  // 🎯 画面上の「中心」を検出してスケール反映
  // =======================================
  const detectCenter = () => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    // container 中央（ロゴのトとナの間）
    const rect = container.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2

    const cards = Array.from(track.children)

    let closestIndex = 0
    let minDiff = Infinity

    cards.forEach((card, i) => {
      const cardRect = (card as HTMLElement).getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2

      const diff = Math.abs(cardCenter - centerX)

      // スケール適用
      const { scale, opacity } = calcScaleOpacity(diff)
        ; (card as HTMLElement).style.transform = `scale(${scale})`
        ; (card as HTMLElement).style.opacity = `${opacity}`

      // 中央に最も近いカードを保存
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    })

    setCurrentIndex(closestIndex)
  }

  // =======================================
  // 初期位置（中央セットの先頭カードを中央へ）
  // =======================================
  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const first = track.children[0] as HTMLElement
    const cardWidth = first?.clientWidth ?? 300
    const gap = 24
    const unit = cardWidth + gap

    // container の中央に middleIndex のカードが来るように設定
    container.scrollLeft =
      middleIndex * unit - container.clientWidth / 2 + cardWidth / 2

    detectCenter()
  }, [])

  // =======================================
  // 🌀 自動スクロール / 無限ループ
  // =======================================
  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const first = track.children[0] as HTMLElement
    const cardWidth = first?.clientWidth ?? 300
    const gap = 24
    const unit = cardWidth + gap

    const totalWidth = unit * loopStores.length
    const middleOffset = middleIndex * unit

    let frameId: number

    const loop = () => {
      if (!isDragging.current) container.scrollLeft += scrollSpeed

      // 右端 → 真ん中セットへ巻き戻し
      if (container.scrollLeft >= totalWidth - unit * 2) {
        container.scrollLeft -= middleOffset
      }

      // 左端 → 真ん中セットへ巻き戻し
      if (container.scrollLeft <= unit) {
        container.scrollLeft += middleOffset
      }

      detectCenter()
      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [loopStores])

  // =======================================
  // ✋ ユーザーが触ったら自動スクロール停止
  // =======================================
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const stop = () => (isDragging.current = true)
    const resume = () => (isDragging.current = false)

    el.addEventListener('mousedown', stop)
    el.addEventListener('touchstart', stop)
    el.addEventListener('mouseup', resume)
    el.addEventListener('touchend', resume)

    return () => {
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('touchstart', stop)
      el.removeEventListener('mouseup', resume)
      el.removeEventListener('touchend', resume)
    }
  }, [])

  // =======================================
  // JSX
  // =======================================
  return (
    <>
      {/* スライダーコンテナ */}
      <div ref={containerRef} className="w-full overflow-x-hidden px-6 mt-6">
        <div ref={trackRef} className="flex gap-6">
          {loopStores.map((store, i) => (
            <div
              key={`${store.id}-${i}`}
              className="shrink-0 transition-transform duration-300 cursor-pointer"
              onClick={() => onSelectStore(store)}
            >
              <HomeStoreCard store={store} />
            </div>
          ))}
        </div>
      </div>


    </>
  )
}