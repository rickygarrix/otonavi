"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"

import StoreTypeFilter from "@/components/filters/StoreTypeFilter"
import SearchFilterStickyWrapper from "@/components/filters/SearchFilterStickyWrapper"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import Footer from "@/components/Footer"
import HomeFilterSections from "@/components/home/HomeFilterSections"

import { useHomeStores } from "@/hooks/useHomeStores"
import { useHomeMasters } from "@/hooks/useHomeMasters"
import { useHomeRefs } from "@/hooks/useHomeRefs"
import { useHomeStoreFilters } from "@/hooks/useStoreFilters"

import type { StoreType } from "@/types/store"

// ==============================
// 地域キー（AreaSelector用）
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
  // 店舗タイプ（最上位）
  // ==============================
  const [storeType, setStoreType] = useState<StoreType>("club")

  // ==============================
  // データ取得
  // ==============================
  const { stores, loading } = useHomeStores()
  const masters = useHomeMasters()

  // ==============================
  // Home 専用フィルタ（軽量）
  // ==============================
  const filter = useHomeStoreFilters(
    stores,
    masters.externalLabelMap,
    { storeType }
  )

  const {
    filteredStores,
    selectedFilters,
    count,
    handleClear,
    ...setters
  } = filter

  // ==============================
  // clearKey（Selector 同期用）
  // ==============================
  const [clearKey, setClearKey] = useState(0)

  const handleClearAll = () => {
    handleClear()
    setClearKey((v) => v + 1)
  }

  // ==============================
  // refs（スクロール / セクション管理）
  // ==============================
  const refs = useHomeRefs()

  // ==============================
  // 検索結果ページ遷移
  // ==============================
  const handleGoToStores = () => {
    const params = new URLSearchParams()

    params.set("type", storeType)
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
            <HomeLatestStores stores={stores} />
          </div>
        )}

        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>

        <div className="h-[160px]" />
      </div>

      {/* ================= Sticky StoreType ================= */}
      <SearchFilterStickyWrapper>
        <StoreTypeFilter
          activeType={storeType}
          onChange={setStoreType}
        />
      </SearchFilterStickyWrapper>

      {/* ================= Filters ================= */}
      <HomeFilterSections
        clearKey={clearKey}

        // 🔴 明示的に渡す（必須）
        setPrefectureIds={setters.setPrefectureIds}
        setAreaIds={setters.setAreaIds}

        // 🔵 その他は spread でOK
        setCustomerKeys={setters.setCustomerKeys}
        setAtmosphereKeys={setters.setAtmosphereKeys}
        setSizeKey={setters.setSizeKeys}
        setDrinkKeys={setters.setDrinkKeys}
        setPriceRangeKeys={setters.setPriceRangeKeys}
        setPaymentMethodKeys={setters.setPaymentMethodKeys}
        setEventTrendKeys={setters.setEventTrendKeys}
        setBaggageKeys={setters.setBaggageKeys}
        setSmokingKeys={setters.setSmokingKeys}
        setToiletKeys={setters.setToiletKeys}
        setOtherKeys={setters.setOtherKeys}

        {...refs}
      />

      {/* ================= Bottom Search Bar ================= */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClearAll}
        onSearch={handleGoToStores}
        count={count}
      />

      <Footer />
      <div className="h-[50px]" />
    </>
  )
}