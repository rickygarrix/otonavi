'use client'

import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useResultState } from './store/useResultState'
import MapView from './components/MapView'
import StoreCardSwiper from './components/StoreCardSwiper'
import StoreGridList from './components/StoreGridList'
import StoreDetailModal from './components/StoreDetailModal'
import FilterButton from './components/FilterButton'
import ReturnHomeButton from '@/app/components/Header/ReturnHomeButton'
import type { Store } from './types/storeTypes'

export default function ResultPage() {
  const [isListVisible, setIsListVisible] = useState(false)
  const [modalStore, setModalStore] = useState<Store | null>(null)
  const { stores, selectedStore, setStores, setSelectedStore } = useResultState()
  const y = useMotionValue(0)
  const [windowHeight, setWindowHeight] = useState(0)

  // ✅ ダミーデータ
  useEffect(() => {
    const dummy: Store[] = [
      {
        id: '1',
        name: 'CLUB IKO',
        area: { name: '渋谷区' },
        store_type: { label: 'クラブ' },
        price_range: { label: '高め' },
        latitude: 35.6595,
        longitude: 139.7005,
        walk_minutes: 5,
      },
      {
        id: '2',
        name: 'The Bar That Never Leaves',
        area: { name: '新宿区' },
        store_type: { label: 'バー' },
        price_range: { label: '中間' },
        latitude: 35.6938,
        longitude: 139.7034,
        walk_minutes: 8,
      },
      {
        id: '3',
        name: 'Lounge Nami',
        area: { name: '港区' },
        store_type: { label: 'ラウンジ' },
        price_range: { label: '低め' },
        latitude: 35.6581,
        longitude: 139.7516,
        walk_minutes: 6,
      },
      {
        id: '4',
        name: 'Café Aurora',
        area: { name: '中目黒' },
        store_type: { label: 'カフェ' },
        price_range: { label: '高め' },
        latitude: 35.6432,
        longitude: 139.6981,
        walk_minutes: 10,
      },
    ]
    setStores(dummy)
  }, [setStores])

  // ✅ 並び替え（安い順）
  const sortedStores = useMemo(() => {
    const priceOrder: Record<string, number> = { 低め: 0, 中間: 1, 高め: 2 }
    return [...stores].sort(
      (a, b) =>
        (priceOrder[a.price_range?.label ?? ''] ?? 999) -
        (priceOrder[b.price_range?.label ?? ''] ?? 999)
    )
  }, [stores])

  // ✅ 初回選択
  useEffect(() => {
    if (sortedStores.length && !selectedStore) {
      setSelectedStore(sortedStores[0])
    }
  }, [sortedStores])

  const total = sortedStores.length

  useEffect(() => {
    const h = window.innerHeight
    setWindowHeight(h)
    y.set(h * 0.9)
  }, [y])

  const openY = 80
  const closedY = windowHeight * 0.9

  // ✅ 押した瞬間スッと出す（リニア・遅延ゼロ）
  const toggleList = () => {
    const target = isListVisible ? closedY : openY
    setIsListVisible(!isListVisible)
    animate(y, target, {
      type: 'tween',
      ease: 'linear', // ← 直線的に動く（タメなし）
      duration: 0.15, // ← わずか0.15秒で上がる
    })
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* ---------- MAP ---------- */}
      <div className="absolute inset-0 z-0">
        <MapView sortMode="price" stores={sortedStores} />
      </div>

      {/* ✅ 白背景：モーダル開時に上部を自然に覆う */}
      {isListVisible && (
        <div className="absolute inset-0 bg-white z-30 transition-opacity duration-150" />
      )}

      {/* ---------- HEADER BUTTONS ---------- */}
      <div className="absolute top-4 left-0 right-0 z-40 flex justify-between px-4 pointer-events-auto">
        <ReturnHomeButton />
        <FilterButton onClick={() => alert('フィルター開く予定')} />
      </div>

      {/* ---------- CARD SWIPER ---------- */}
      {!isListVisible && (
        <div className="absolute bottom-[100px] left-0 right-0 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <StoreCardSwiper
              stores={sortedStores}
              selectedStore={selectedStore}
              onChange={(store) => setSelectedStore(store)}
              onSelect={(store) => setModalStore(store)}
            />
          </div>
        </div>
      )}

      {/* ---------- SWIPER INDICATOR ---------- */}
      {!isListVisible && total > 0 && (
        <div className="absolute bottom-[150px] right-6 z-20 bg-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full shadow pointer-events-none">
          {sortedStores.findIndex((s) => s.id === selectedStore?.id) + 1 || 1} / {total}
        </div>
      )}

      {/* ---------- LIST PANEL ---------- */}
      <motion.div
        style={{ y, zIndex: 40, height: '100vh' }}
        className="fixed left-0 right-0 bottom-0 bg-white flex flex-col transition-all duration-150"
      >
        <div className="flex items-center justify-center py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <p className="text-[15px] font-semibold text-gray-900">{total}件見つかりました</p>
          <button
            onClick={toggleList}
            className="ml-2 rounded-full hover:bg-gray-100 transition p-1"
          >
            {isListVisible ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pt-2 pb-20 scrollbar-hide">
          <StoreGridList onSelect={(store) => setModalStore(store)} />
        </div>
      </motion.div>

      {/* ---------- DETAIL MODAL ---------- */}
      {modalStore && <StoreDetailModal store={modalStore} onClose={() => setModalStore(null)} />}
    </div>
  )
}