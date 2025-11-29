"use client"

import { useState, useCallback, useMemo } from "react"
import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import HomeSlider from "@/components/home/HomeSlider"
import CommentSlider from "@/components/home/CommentSlider"
import { useHomeStores } from "@/hooks/useHomeStores"
import SearchFilter from "@/components/home/SearchFilter"
import AreaSelector from "@/components/home/AreaSelector"
import StoreTypeSelector from "@/components/home/StoreTypeSelector"
import FixedSearchBar from "@/components/home/FixedSearchBar"

import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"
import type { HomeStore } from "@/types/store"

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  const [prefecture, setPrefecture] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<string | null>(null)

  const [isResultOpen, setIsResultOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleAreaChange = useCallback((pref: string | null, area: string | null) => {
    setPrefecture(pref)
    setArea(area)
  }, [])

  const handleStoreTypeChange = useCallback((type: string | null) => {
    setStoreType(type)
  }, [])

  const handleClear = useCallback(() => {
    setPrefecture(null)
    setArea(null)
    setStoreType(null)
  }, [])

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (prefecture && s.prefecture !== prefecture) return false
      if (area && s.area !== area) return false
      if (storeType && s.type !== storeType) return false
      return true
    })
  }, [stores, prefecture, area, storeType])

  const count = filteredStores.length

  const handleSearch = useCallback(() => {
    if (count === 0) return
    setIsResultOpen(true)
  }, [count])

  const selectedFilters = [prefecture, area, storeType].filter(Boolean) as string[]

  const handleSelectStore = useCallback((store: HomeStore) => {
    setSelectedStore(store)
    setIsDetailOpen(true)
  }, [])

  return (
    <>
      {/* ========================== */}
      {/* 🎨 背景カーブ部分 */}
      {/* ========================== */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />

        <div className="mt-[80px]">
          <LogoHero />
        </div>

        {/* 店舗カードスライダー */}
        <div className="mt-[40px]">
          {!loading && (
            <HomeSlider
              stores={stores}
              onSelectStore={handleSelectStore}
            />
          )}
        </div>

        {/* ⭐ コメントスライダー（背景内に absolute で配置） */}
        <div
          className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none"
        >
          <div className="text-center whitespace-nowrap">
            <CommentSlider />
          </div>
        </div>

        {/* 下余白（白背景との境界を確保） */}
        <div className="h-[160px]" />
      </div>

      {/* ========================== */}
      {/* 🔍 フィルター UI（白背景） */}
      {/* ========================== */}
      <div className="bg-white w-full py-8">
        <SearchFilter />
        <div className="h-6" />
        <AreaSelector onChange={handleAreaChange} />
        <StoreTypeSelector onChange={handleStoreTypeChange} />
      </div>

      {/* 固定検索バー */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      {/* 検索結果パネル */}
      <SearchResultPanel
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}
      />

      {/* 店舗詳細パネル */}
      <StoreDetailPanel
        store={selectedStore}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      {/* 👇 固定検索バーに隠れないように余白を追加 */}
      <div className="h-[50px]" />
    </>
  )
}