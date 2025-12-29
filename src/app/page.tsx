"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"

import StoreTypeFilter from "@/components/filters/StoreTypeFilter"
import SearchFilterStickyWrapper from "@/components/filters/SearchFilterStickyWrapper"
import SearchBar from "@/components/home/SearchBar"
import Footer from "@/components/Footer"
import HomeFilterSections from "@/components/home/HomeFilterSections"

import { useHomeStores } from "@/hooks/useHomeStores"
import { useHomeMasters } from "@/hooks/useHomeMasters"
import { useHomeStoreFilters } from "@/hooks/useStoreFilters"
import type { GenericMaster } from "@/types/master"

export default function HomePage() {
  const router = useRouter()

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const [storeTypeId, setStoreTypeId] = useState<string | null>(null)
  const [clearKey, setClearKey] = useState(0)

  const { stores, loading } = useHomeStores()
  const masters = useHomeMasters()

  const storeTypes = useMemo<GenericMaster[]>(() => {
    return Array.from(masters.genericMasters.values()).filter(
      (m) => m.table === "store_types"
    )
  }, [masters.genericMasters])

  const filter = useHomeStoreFilters(stores, masters.externalLabelMap, {
    storeTypeId,
  })

  const { filteredStores, selectedFilters, count, handleClear, ...setters } =
    filter

  const handleClearAll = () => {
    handleClear()
    setClearKey((v) => v + 1)
    setStoreTypeId(null)
  }

  const handleGoToStores = () => {
    const params = new URLSearchParams()

    if (storeTypeId) params.set("store_type_id", storeTypeId)
    selectedFilters.forEach((f) => params.append("filters", f))
    filteredStores.forEach((s) => params.append("ids", s.id))

    router.push(`/stores?${params.toString()}`)
  }

  const handleClickFilter = (label: string) => {
    const section = masters.labelToSectionMap.get(label)
    if (!section) return

    sectionRefs.current[section]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <>
      {/* ===== Hero ===== */}
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

      {/* ===== Store Type ===== */}
      <SearchFilterStickyWrapper>
        <StoreTypeFilter
          storeTypes={storeTypes} // ★ 必須
          activeTypeId={storeTypeId}
          onChange={setStoreTypeId}
        />
      </SearchFilterStickyWrapper>

      {/* ===== Filters ===== */}
      <HomeFilterSections
        clearKey={clearKey}
        sectionRefs={sectionRefs}
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
        setEnvironmentKeys={setters.setEnvironmentKeys}
        setOtherKeys={setters.setOtherKeys}
      />

      {/* ===== Fixed Search Bar ===== */}
      <SearchBar
        selectedFilters={selectedFilters}
        onClear={handleClearAll}
        onSearch={handleGoToStores}
        count={count}
        onClickFilter={handleClickFilter}
      />

      <Footer />
      <div className="h-[50px]" />
    </>
  )
}