'use client'

import { useEffect, useRef, useState } from 'react'
import HomeStoreCard from '../store/HomeStoreCard'
import type { HomeStore } from '@/types/store'

type Props = {
  stores: HomeStore[]
  onSelectStore: (store: HomeStore) => void
}

export default function HomeSlider({ stores, onSelectStore }: Props) {
  if (stores.length === 0) return null

  // 無限ループ用：3セットつなげる
  const loopStores = [...stores, ...stores, ...stores]
  const middleIndex = stores.length // 真ん中セット開始点

  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)

  const scrollSpeed = 0.6

  // =======================================
  // スケール・透明度のカーブ
  // =======================================
  const calcScaleOpacity = (diff: number) => {
    const maxRange = 260
    const t = Math.min(diff / maxRange, 1)

    const scale = 1 - t * 0.5
    const opacity = 1 - t * 0.55

    return { scale, opacity }
  }

  // =======================================
  // rect 不使用版 → 完全安定
  // =======================================
  const applyCenterEffect = () => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const first = track.children[0] as HTMLElement | undefined
    const cardWidth = first?.clientWidth ?? 260
    const gap = 24
    const unit = cardWidth + gap

    const containerCenter = container.clientWidth / 2
    const scrollLeft = container.scrollLeft

    const cards = Array.from(track.children) as HTMLElement[]

    let closestIndex = 0
    let minDiff = Infinity

    cards.forEach((card, i) => {
      // 理論的なカード中心（高さ変動とは無関係）
      const cardCenter = i * unit + cardWidth / 2

      const diff = Math.abs((cardCenter - scrollLeft) - containerCenter)

      const { scale, opacity } = calcScaleOpacity(diff)
      card.style.transform = `scale(${scale})`
      card.style.opacity = `${opacity}`

      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    })
  }

  // =======================================
  // 初期位置（真ん中のセットを中央へ）
  // =======================================
  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const first = track.children[0] as HTMLElement
    const cardWidth = first?.clientWidth ?? 260
    const gap = 24
    const unit = cardWidth + gap

    container.scrollLeft =
      middleIndex * unit - container.clientWidth / 2 + cardWidth / 2

    requestAnimationFrame(() => applyCenterEffect())
  }, [])

  // =======================================
  // 無限ループ + 自動スクロール
  // =======================================
  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const first = track.children[0] as HTMLElement
    const cardWidth = first?.clientWidth ?? 260
    const gap = 24
    const unit = cardWidth + gap

    const totalWidth = unit * loopStores.length
    const middleOffset = middleIndex * unit

    let frameId: number

    const loop = () => {
      if (!containerRef.current) return

      if (!isDragging.current) container.scrollLeft += scrollSpeed

      // 右端 → 中央へ巻き戻し
      if (container.scrollLeft >= totalWidth - unit * 2) {
        container.scrollLeft -= middleOffset
      }
      // 左端 → 中央へ巻き戻し
      if (container.scrollLeft <= unit) {
        container.scrollLeft += middleOffset
      }

      applyCenterEffect()

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [loopStores])

  // =======================================
  // ユーザー操作 → 自動スクロール停止
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

    el.addEventListener('scroll', applyCenterEffect)

    return () => {
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('touchstart', stop)
      el.removeEventListener('mouseup', resume)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('scroll', applyCenterEffect)
    }
  }, [])

  // =======================================
  // JSX
  // =======================================
  return (
    <div ref={containerRef} className="w-full overflow-x-hidden px-6 mt-6">
      <div ref={trackRef} className="flex gap-6">
        {loopStores.map((store, i) => (
          <div
            key={`${store.id}-${i}`}
            className="shrink-0 transition-all duration-300 ease-out cursor-pointer will-change-transform"
            onClick={() => onSelectStore(store)}
          >
            <HomeStoreCard store={store} />
          </div>
        ))}
      </div>
    </div>
  )
}