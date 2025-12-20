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
// 地域キー
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

  // ✅ 未選択 = null に統一
  const [storeType, setStoreType] = useState<StoreType | null>(null)

  const { stores, loading } = useHomeStores()
  const masters = useHomeMasters()

  const filter = useHomeStoreFilters(stores, masters.externalLabelMap, {
    storeType, // null OK
  })

  const { filteredStores, selectedFilters, count, handleClear, ...setters } = filter

  const [clearKey, setClearKey] = useState(0)
  const handleClearAll = () => {
    handleClear()
    setClearKey((v) => v + 1)
    setStoreType(null) // ✅ 店舗タイプもクリアしたいなら入れる
  }

  const refs = useHomeRefs()

  const handleGoToStores = () => {
    const params = new URLSearchParams()

    // ✅ 選択されているときだけ付与
    if (storeType) params.set("type", storeType)

    selectedFilters.forEach((f) => params.append("filters", f))
    filteredStores.forEach((s) => params.append("ids", s.id))

    router.push(`/stores?${params.toString()}`)
  }

  return (
    <>
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

      <SearchFilterStickyWrapper>
        <StoreTypeFilter
          activeType={storeType}     // ✅ null OK
          onChange={setStoreType}    // ✅ (StoreType | null) => void
        />
      </SearchFilterStickyWrapper>

      <HomeFilterSections
        clearKey={clearKey}
        setPrefectureIds={setters.setPrefectureIds}
        setAreaIds={setters.setAreaIds}
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