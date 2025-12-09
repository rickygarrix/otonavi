"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"

import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"

import SearchFilter from "@/components/filters/SearchFilter"
import SearchFilterStickyWrapper from "@/components/filters/SearchFilterStickyWrapper"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import Footer from "@/components/Footer"

import { useHomeStores } from "@/hooks/useHomeStores"
import { useStoreFilters } from "@/hooks/useStoreFilters"
import { useHomeMasters } from "@/hooks/useHomeMasters"

import HomeFilterSections from "@/components/home/HomeFilterSections"

export default function HomePage() {
  const router = useRouter()
  const { stores, loading } = useHomeStores()
  const { externalLabelMap } = useHomeMasters()

  // ============================
  // ✅ フィルター処理
  // ============================
  const filter = useStoreFilters(stores, externalLabelMap)

  const {
    setPrefecture,
    setArea,
    setStoreType,
    setEventTrendKeys,
    setRuleKeys,
    setAchievementFilter,

    setSeatTypeKeys,
    setSmokingKeys,
    setEnvironmentKeys,
    setOtherKeys,
    setBaggageKeys,
    setSecurityKeys,
    setToiletKeys,
    setFloorKeys,
    setSizeKey,

    setPriceRange,
    setPricingSystemKeys,
    setDiscountKeys,
    setVipKeys,
    setPaymentMethodKeys,

    setSoundKeys,
    setLightingKeys,
    setProductionKeys,

    setDrinkKeys,
    setFoodKeys,
    setServiceKeys,

    setCustomerKeys,
    setAtmosphereKeys,
    setHospitalityKey,

    // ⬇ ここ重要
    filteredStores,
    selectedFilters,
    count,

    isDetailOpen,
    selectedStore,
    handleSelectStore,
    handleCloseAll,
    handleClear,
  } = filter

  // ============================
  // スクロール位置 refs
  // ============================
  const storeRef = useRef<HTMLHeadingElement | null>(null)
  const equipmentRef = useRef<HTMLHeadingElement | null>(null)
  const priceRef = useRef<HTMLHeadingElement | null>(null)
  const soundRef = useRef<HTMLHeadingElement | null>(null)
  const drinkRef = useRef<HTMLHeadingElement | null>(null)
  const customerRef = useRef<HTMLHeadingElement | null>(null)

  // ============================
  // ✅ 検索 → /stores に遷移（条件と ID を渡す）
  // ============================
  const handleGoToStores = () => {
    const params = new URLSearchParams()

    // 表示用ラベル
    selectedFilters.forEach((f) => params.append("filters", f))
    // 絞り込み済み store の id
    filteredStores.forEach((s) => params.append("ids", s.id))

    router.push(`/stores?${params.toString()}`)
  }

  return (
    <>
      {/* ================= Hero ================= */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />
        <div className="mt-[80px]">
          <LogoHero />
        </div>

        <div className="mt-[40px]">
          {!loading && (
            <HomeLatestStores
              stores={stores}
              onSelectStore={handleSelectStore}
            />
          )}
        </div>

        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>

        <div className="h-[160px]" />
      </div>

      {/* ================= Sticky Filter Tabs ================= */}
      <SearchFilterStickyWrapper>
        <SearchFilter
          onScrollStore={() =>
            storeRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollEquipment={() =>
            equipmentRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollPrice={() =>
            priceRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollSound={() =>
            soundRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollDrink={() =>
            drinkRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollCustomer={() =>
            customerRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        />
      </SearchFilterStickyWrapper>

      {/* ================= 店舗情報 ================= */}
      <h2
        ref={storeRef}
        className="px-6 text-xl font-bold text-slate-800 mb-4 mt-6"
      >
        店舗情報
      </h2>

      {/* ================= フィルターUIセット ================= */}
      <HomeFilterSections
        setPrefecture={setPrefecture}
        setArea={setArea}
        setStoreType={setStoreType}
        setEventTrendKeys={setEventTrendKeys}
        setRuleKeys={setRuleKeys}
        setAchievementFilter={setAchievementFilter}
        setBaggageKeys={setBaggageKeys}
        setSecurityKeys={setSecurityKeys}
        setToiletKeys={setToiletKeys}
        setSizeKey={setSizeKey}
        setFloorKeys={setFloorKeys}
        setSeatTypeKeys={setSeatTypeKeys}
        setSmokingKeys={setSmokingKeys}
        setEnvironmentKeys={setEnvironmentKeys}
        setOtherKeys={setOtherKeys}
        setPriceRange={setPriceRange}
        setPricingSystemKeys={setPricingSystemKeys}
        setDiscountKeys={setDiscountKeys}
        setVipKeys={setVipKeys}
        setPaymentMethodKeys={setPaymentMethodKeys}
        setSoundKeys={setSoundKeys}
        setLightingKeys={setLightingKeys}
        setProductionKeys={setProductionKeys}
        setDrinkKeys={setDrinkKeys}
        setFoodKeys={setFoodKeys}
        setServiceKeys={setServiceKeys}
        setCustomerKeys={setCustomerKeys}
        setAtmosphereKeys={setAtmosphereKeys}
        setHospitalityKey={setHospitalityKey}
      />

      {/* ================= Bottom Search Bar ================= */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleGoToStores}
        count={count}
      />

      <Footer />

      <div className="h-[50px]" />
    </>
  )
}