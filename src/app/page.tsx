"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"

import SearchFilter from "@/components/filters/SearchFilter"
import SearchFilterStickyWrapper from "@/components/filters/SearchFilterStickyWrapper"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import Footer from "@/components/Footer"
import HomeFilterSections from "@/components/home/HomeFilterSections"

import { useHomeStores } from "@/hooks/useHomeStores"
import { useStoreFilters } from "@/hooks/useStoreFilters"
import { useHomeMasters } from "@/hooks/useHomeMasters"
import { useHomeScroll } from "@/hooks/useHomeScroll"
import { useHomeRefs } from "@/hooks/useHomeRefs"

// ==============================
// 地域キー（スクロール用）
// ==============================
export type RegionKey =
  | "北海道・東北"
  | "関東"
  | "中部"
  | "近畿"
  | "中国・四国"
  | "九州・沖縄"

export default function HomePage() {
  const router = useRouter()

  // ==============================
  // データ取得
  // ==============================
  const { stores, loading } = useHomeStores()
  const masters = useHomeMasters()
  const filter = useStoreFilters(stores, masters.externalLabelMap)

  // ==============================
  // クリア同期キー
  // ==============================
  const [clearKey, setClearKey] = useState(0)

  const {
    filteredStores,
    selectedFilters,
    count,
    handleSelectStore,
    handleClear: rawHandleClear,
    ...setters
  } = filter

  const handleClear = () => {
    rawHandleClear()
    setClearKey((v) => v + 1)
  }

  // ==============================
  // refs（スクロール管理）
  // ==============================
  const refs = useHomeRefs()

  // ==============================
  // フィルターチップ → スクロール
  // ==============================
  const handleScrollByFilter = useHomeScroll({
    areaMap: masters.areaMap,
    drinkCategoryMap: masters.drinkCategoryMap,
    prefectureRegionMap: masters.prefectureRegionMap,
    labelToSectionMap: masters.labelToSectionMap,
    refs,
  })

  // ==============================
  // 検索結果ページ遷移
  // ==============================
  const handleGoToStores = () => {
    const params = new URLSearchParams()
    selectedFilters.forEach((f) => params.append("filters", f))
    filteredStores.forEach((s) => params.append("ids", s.id))
    router.push(`/stores?${params.toString()}`)
  }

  // ==============================
  // UI
  // ==============================
  return (
    <>
      {/* ================= Hero ================= */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />

        <div className="mt-[80px]">
          <LogoHero />
        </div>

        {!loading && (
          <div className="mt-[40px]">
            <HomeLatestStores
              stores={stores}
              onSelectStore={handleSelectStore}
            />
          </div>
        )}

        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>

        <div className="h-[160px]" />
      </div>

      {/* ================= Sticky Tabs ================= */}
      <SearchFilterStickyWrapper>
        <SearchFilter
          onScroll={(region) => {
            refs.regionRefs[region].current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }}
        />
      </SearchFilterStickyWrapper>

      {/* ================= Filters ================= */}
      <HomeFilterSections
        clearKey={clearKey}
        {...refs}
        {...setters}
      />

      {/* ================= Bottom Search Bar ================= */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleGoToStores}
        count={count}
        onClickFilter={handleScrollByFilter}
      />

      <Footer />
      <div className="h-[50px]" />
    </>
  )
}