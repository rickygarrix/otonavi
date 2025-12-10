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

  // ★ ここが重要：labelToSectionMap を受け取る
  const {
    externalLabelMap,
    prefectureRegionMap,
    areaMap,
    drinkCategoryMap,
    labelToSectionMap,
  } = useHomeMasters()

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

    filteredStores,
    selectedFilters,
    count,

    handleSelectStore,
    handleClear,
  } = filter

  // 地域 ref
  const regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>> = {
    "北海道・東北": useRef(null),
    "関東": useRef(null),
    "中部": useRef(null),
    "近畿": useRef(null),
    "中国・四国": useRef(null),
    "九州・沖縄": useRef(null),
  }

  // 東京エリア ref
  const areaRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ドリンクカテゴリ ref
  const drinkCategoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // 実績 ref
  const achievementRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Generic セクション ref
  const genericSectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ================================================================
  //    ❤️  フィルターチップ → どのセクションにスクロールさせるか
  // ================================================================
  const handleScrollByFilter = (label: string) => {
    // 1️⃣ 東京エリア（市区町村）
    const area = areaMap.get(label)
    if (area) {
      const areaKey = area.is_23ward ? "東京23区" : "東京23区以外"
      const target = areaRefs.current[areaKey]
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    // 2️⃣ ドリンクカテゴリ（例：ビール → 「アルコール」セクション）
    const category = drinkCategoryMap.get(label)
    if (category) {
      const target = drinkCategoryRefs.current[category]
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    // 3️⃣ 実績
    const achievementTarget = achievementRefs.current[label]
    if (achievementTarget) {
      achievementTarget.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }

    // 4️⃣ Generic（方法A：label → section名 → ref）
    const sectionName = labelToSectionMap.get(label)

    if (sectionName) {
      const sectionRef = genericSectionRefs.current[sectionName]
      if (sectionRef) {
        sectionRef.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    // 5️⃣ 都道府県 → 地方
    const region = prefectureRegionMap.get(label) as RegionKey | undefined
    if (region) {
      regionRefs[region].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      return
    }
  }

  // 検索結果ページへ遷移
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
            <HomeLatestStores stores={stores} onSelectStore={handleSelectStore} />
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
        regionRefs={regionRefs}
        areaRefs={areaRefs}
        drinkCategoryRefs={drinkCategoryRefs}
        achievementRefs={achievementRefs}
        genericSectionRefs={genericSectionRefs}
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