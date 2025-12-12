"use client"

import { useRef, useState } from "react" // ✅ useState を追加
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

// 地域キー
export type RegionKey =
  | "北海道・東北"
  | "関東"
  | "中部"
  | "近畿"
  | "中国・四国"
  | "九州・沖縄"

export default function HomePage() {
  const router = useRouter()
  const { stores, loading } = useHomeStores()

  // マスタ
  const {
    externalLabelMap,
    prefectureRegionMap,
    areaMap,
    drinkCategoryMap,
    labelToSectionMap,
  } = useHomeMasters()

  const filter = useStoreFilters(stores, externalLabelMap)

  // ✅ クリアUI同期用キー
  const [clearKey, setClearKey] = useState(0)

  const {
    setPrefecture,
    setArea,
    setStoreTypeKeys,
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

    setPriceRangeKeys,
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
    setHospitalityKeys,

    filteredStores,
    selectedFilters,
    count,

    handleSelectStore,
    handleClear: rawHandleClear,
  } = filter

  // ✅ すべてクリア時にUIも完全リセット
  const handleClear = () => {
    rawHandleClear()
    setClearKey((v) => v + 1)
  }

  // 地域 ref
  const regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>> = {
    "北海道・東北": useRef(null),
    "関東": useRef(null),
    "中部": useRef(null),
    "近畿": useRef(null),
    "中国・四国": useRef(null),
    "九州・沖縄": useRef(null),
  }

  const areaRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const drinkCategoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const achievementRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const genericSectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ✅ フィルターチップ → スクロール
  const handleScrollByFilter = (label: string) => {
    const area = areaMap.get(label)
    if (area) {
      const key = area.is_23ward ? "東京23区" : "東京23区以外"
      const target = areaRefs.current[key]
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    const category = drinkCategoryMap.get(label)
    if (category) {
      const target = drinkCategoryRefs.current[category]
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    const achievementTarget = achievementRefs.current[label]
    if (achievementTarget) {
      achievementTarget.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }

    const sectionName = labelToSectionMap.get(label)
    if (sectionName) {
      const ref = genericSectionRefs.current[sectionName]
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    const region = prefectureRegionMap.get(label) as RegionKey | undefined
    if (region) {
      regionRefs[region].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // 検索結果遷移
  const handleGoToStores = () => {
    const params = new URLSearchParams()
    selectedFilters.forEach((f) => params.append("filters", f))
    filteredStores.forEach((s) => params.append("ids", s.id))
    router.push(`/stores?${params.toString()}`)
  }

  return (
    <>
      {/* Hero */}
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

      {/* Sticky Tabs */}
      <SearchFilterStickyWrapper>
        <SearchFilter
          onScrollStore={() =>
            regionRefs["北海道・東北"].current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollEquipment={() =>
            regionRefs["関東"].current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollPrice={() =>
            regionRefs["中部"].current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollSound={() =>
            regionRefs["近畿"].current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollDrink={() =>
            regionRefs["中国・四国"].current?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollCustomer={() =>
            regionRefs["九州・沖縄"].current?.scrollIntoView({ behavior: "smooth" })
          }
        />
      </SearchFilterStickyWrapper>

      {/* フィルターセクション */}
      <HomeFilterSections
        clearKey={clearKey}
        regionRefs={regionRefs}
        areaRefs={areaRefs}
        drinkCategoryRefs={drinkCategoryRefs}
        achievementRefs={achievementRefs}
        genericSectionRefs={genericSectionRefs}
        setPrefecture={setPrefecture}
        setArea={setArea}
        setStoreTypeKeys={setStoreTypeKeys}
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
        setPriceRangeKeys={setPriceRangeKeys}
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
        setHospitalityKeys={setHospitalityKeys}
      />

      {/* Bottom Search Bar */}
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