'use client'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useResultState } from './store/useResultState'
import MapView from './components/MapView'
import StoreCardSwiper from './components/StoreCardSwiper'
import StoreGridList from './components/StoreGridList'
import FilterButton from './components/FilterButton'
import ReturnHomeButton from '@/app/components/Header/ReturnHomeButton'

export default function ResultPage() {
  const [isListVisible, setIsListVisible] = useState(false)
  const { stores, setStores, selectedStore, setSelectedStore } = useResultState()

  /** ✅ 初期ダミーデータ */
  useEffect(() => {
    const dummyStores = [
      {
        id: '1',
        name: 'CLUB IKO',
        area: { name: '渋谷区' },
        store_type: { label: 'クラブ' },
        walk_minutes: 3,
        price_range: { label: '高め' },
        latitude: 35.6595,
        longitude: 139.7005,
        image_url:
          'https://images.unsplash.com/photo-1598387993441-c89d7c54f21c?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: '2',
        name: 'The Bar That Never Leaves',
        area: { name: '新宿区' },
        store_type: { label: 'バー' },
        walk_minutes: 10,
        price_range: { label: '中間' },
        latitude: 35.6938,
        longitude: 139.7034,
        image_url:
          'https://images.unsplash.com/photo-1566417713940-fe7c737a9e9c?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: '3',
        name: 'Lounge Nami',
        area: { name: '港区' },
        store_type: { label: 'ラウンジ' },
        walk_minutes: 6,
        price_range: { label: '低め' },
        latitude: 35.6581,
        longitude: 139.7516,
        image_url:
          'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: '4',
        name: 'Café Aurora',
        area: { name: '中目黒' },
        store_type: { label: 'カフェ' },
        walk_minutes: 12,
        price_range: { label: '高め' },
        latitude: 35.6432,
        longitude: 139.6981,
        image_url:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      },
    ]

    const priceOrder: Record<string, number> = { 低め: 0, 中間: 1, 高め: 2 }
    const sorted = [...dummyStores].sort((a, b) => {
      const aRank = priceOrder[a.price_range?.label?.trim() ?? ''] ?? 999
      const bRank = priceOrder[b.price_range?.label?.trim() ?? ''] ?? 999
      return aRank - bRank
    })

    setStores(sorted)
    setSelectedStore(sorted[0])
  }, [setStores, setSelectedStore])

  const currentIndex = stores.findIndex((s) => s.id === selectedStore?.id)
  const total = stores.length

  // 🎯 モーダルのY位置をMotionValueで制御
  const y = useMotionValue(0)
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    setWindowHeight(window.innerHeight)
  }, [])

  const fullyOpenY = 0
  const closedY = windowHeight * 0.75 // 画面の55%くらいまで下げる
  const currentY = useTransform(y, [fullyOpenY, closedY], [fullyOpenY, closedY])

  const handleDragEnd = (_: any, info: any) => {
    const velocity = info.velocity.y
    const offset = info.offset.y
    if (offset > 100 || velocity > 400) {
      setIsListVisible(false)
      y.set(closedY)
    } else if (offset < -100 || velocity < -400) {
      setIsListVisible(true)
      y.set(fullyOpenY)
    }
  }

  useEffect(() => {
    y.set(isListVisible ? fullyOpenY : closedY)
  }, [isListVisible, closedY, fullyOpenY, y])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* 🗺️ 背景マップ */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <MapView sortMode="price" />
      </div>

      {/* 📍 上部ヘッダー */}
      <div className="absolute top-4 left-0 right-0 z-40 flex items-center justify-between px-4 pointer-events-auto">
        <ReturnHomeButton />
        <div className="flex-1" />
        <FilterButton onClick={() => alert('フィルター開く予定')} />
      </div>

      {/* 🪄 店舗カード */}
      <div className="absolute bottom-[100px] left-0 right-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <StoreCardSwiper />
        </div>
      </div>

      {/* 🔢 ページ番号 */}
      {selectedStore && (
        <div className="absolute bottom-[150px] right-6 z-30 bg-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full shadow pointer-events-none">
          {currentIndex + 1} / {total}
        </div>
      )}

      {/* 📜 下部スライドリスト（指追従でスムーズに動く） */}
      <motion.div
        drag="y"
        dragConstraints={{ top: fullyOpenY, bottom: closedY }}
        style={{
          y: currentY,
          zIndex: 50,
          height: 'calc(100vh - 100px)',
        }}
        onDragEnd={handleDragEnd}
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)] pointer-events-auto"
      >

        {/* 件数表示 */}
        <div className="flex items-center justify-center py-2">
          <p className="text-sm font-semibold text-gray-800">
            {total}件見つかりました（値段が低い順）
          </p>
        </div>

        {/* 📜 リスト本体 */}
        <div className="overflow-y-auto h-[calc(100%-60px)] pt-2 pb-20">
          <StoreGridList />
        </div>
      </motion.div>
    </div>
  )
}