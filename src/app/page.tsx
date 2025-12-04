"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import HomeSlider from "@/components/home/HomeSlider"
import CommentSlider from "@/components/home/CommentSlider"
import { useHomeStores } from "@/hooks/useHomeStores"
import SearchFilter from "@/components/filters/SearchFilter"

import AreaSelector from "@/components/filters/AreaSelector"
import AchievementSelector from "@/components/filters/AchievementSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"

import type { HomeStore } from "@/types/store"

import Footer from "@/components/Footer"

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  // ============================
  // フィルタ関連
  // ============================
  const [prefecture, setPrefecture] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<string | null>(null)

  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [ruleKeys, setRuleKeys] = useState<string[]>([])
  const [achievementFilter, setAchievementFilter] = useState({
    hasAward: false,
    hasMedia: false,
  })

  const [seatTypeKeys, setSeatTypeKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [environmentKeys, setEnvironmentKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [securityKeys, setSecurityKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [floorKeys, setFloorKeys] = useState<string[]>([])
  const [sizeKey, setSizeKey] = useState<string | null>(null)

  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [pricingSystemKeys, setPricingSystemKeys] = useState<string[]>([])
  const [discountKeys, setDiscountKeys] = useState<string[]>([])
  const [vipKeys, setVipKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  const [soundKeys, setSoundKeys] = useState<string[]>([])
  const [lightingKeys, setLightingKeys] = useState<string[]>([])
  const [productionKeys, setProductionKeys] = useState<string[]>([])

  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [hospitalityKey, setHospitalityKey] = useState<string | null>(null)

  const [foodKeys, setFoodKeys] = useState<string[]>([])
  const [serviceKeys, setServiceKeys] = useState<string[]>([])
  const [drinkKeys, setDrinkKeys] = useState<string[]>([])

  // ============================
  // パネル
  // ============================
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)

  const handleCloseAll = useCallback(() => {
    setIsResultOpen(false)
    setIsDetailOpen(false)
    setSelectedStore(null)
  }, [])

  // ============================
  // 全クリア
  // ============================
  const handleClear = useCallback(() => {
    setPrefecture(null)
    setArea(null)
    setStoreType(null)

    setEventTrendKeys([])
    setRuleKeys([])
    setSeatTypeKeys([])
    setSmokingKeys([])
    setEnvironmentKeys([])
    setOtherKeys([])
    setBaggageKeys([])
    setSecurityKeys([])
    setToiletKeys([])
    setFloorKeys([])
    setSizeKey(null)

    setPriceRange(null)
    setPricingSystemKeys([])
    setDiscountKeys([])
    setVipKeys([])
    setPaymentMethodKeys([])

    setSoundKeys([])
    setLightingKeys([])
    setProductionKeys([])

    setCustomerKeys([])
    setAtmosphereKeys([])
    setHospitalityKey(null)

    setFoodKeys([])
    setServiceKeys([])

    setDrinkKeys([])

    setAchievementFilter({ hasAward: false, hasMedia: false })
  }, [])

  // ============================
  // SearchFilter の「くっつき」制御
  // ============================
  const [isFilterSticky, setIsFilterSticky] = useState(false)
  const [filterHeight, setFilterHeight] = useState(0)

  const filterWrapperRef = useRef<HTMLDivElement | null>(null)
  const filterSentinelRef = useRef<HTMLDivElement | null>(null)

  // SearchFilter の高さを取得
  useEffect(() => {
    if (filterWrapperRef.current) {
      setFilterHeight(filterWrapperRef.current.offsetHeight)
    }
  }, [])

  // sentinel が画面上から消えたら fixed 化
  useEffect(() => {
    const sentinel = filterSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsFilterSticky(!entry.isIntersecting)
    }, { threshold: 0 })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // スクロール時のオフセット（SearchFilter の高さ）
  const stickyOffset = filterHeight || 80

  const storeRef = useRef<HTMLHeadingElement | null>(null)
  const equipmentRef = useRef<HTMLHeadingElement | null>(null)
  const priceRef = useRef<HTMLHeadingElement | null>(null)
  const soundRef = useRef<HTMLHeadingElement | null>(null)
  const drinkRef = useRef<HTMLHeadingElement | null>(null)
  const customerRef = useRef<HTMLHeadingElement | null>(null)

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    if (!ref.current) return
    const y = ref.current.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: y - stickyOffset,
      behavior: "smooth",
    })
  }

  // ============================
  // 絞り込み
  // ============================
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (prefecture && s.prefecture !== prefecture) return false
      if (area && s.area !== area) return false
      if (storeType && s.store_type_id !== storeType) return false

      if (achievementFilter.hasAward && !s.hasAward) return false
      if (achievementFilter.hasMedia && !s.hasMedia) return false

      const m2mChecks: [string[], string[]][] = [
        [eventTrendKeys, s.event_trend_keys],
        [ruleKeys, s.rule_keys],
        [seatTypeKeys, s.seat_type_keys],
        [smokingKeys, s.smoking_keys],
        [environmentKeys, s.environment_keys],
        [otherKeys, s.other_keys],
        [baggageKeys, s.baggage_keys],
        [securityKeys, s.security_keys],
        [toiletKeys, s.toilet_keys],
        [floorKeys, s.floor_keys],
        [pricingSystemKeys, s.pricing_system_keys],
        [discountKeys, s.discount_keys],
        [vipKeys, s.vip_keys],
        [paymentMethodKeys, s.payment_method_keys],
        [soundKeys, s.sound_keys],
        [lightingKeys, s.lighting_keys],
        [productionKeys, s.production_keys],
        [customerKeys, s.customer_keys],
        [atmosphereKeys, s.atmosphere_keys],
        [foodKeys, s.food_keys],
        [serviceKeys, s.service_keys],
        [drinkKeys, s.drink_keys],
      ]

      for (const [selected, storeKeys] of m2mChecks) {
        if (selected.length > 0 && !selected.every((k) => storeKeys.includes(k)))
          return false
      }

      if (sizeKey && s.size_key !== sizeKey) return false
      if (priceRange && s.price_range_id !== priceRange) return false
      if (hospitalityKey && s.hospitality_key !== hospitalityKey) return false

      return true
    })
  }, [
    stores,
    prefecture,
    area,
    storeType,
    eventTrendKeys,
    ruleKeys,
    seatTypeKeys,
    smokingKeys,
    environmentKeys,
    otherKeys,
    baggageKeys,
    securityKeys,
    toiletKeys,
    floorKeys,
    sizeKey,
    priceRange,
    pricingSystemKeys,
    discountKeys,
    vipKeys,
    paymentMethodKeys,
    soundKeys,
    lightingKeys,
    productionKeys,
    customerKeys,
    atmosphereKeys,
    hospitalityKey,
    foodKeys,
    serviceKeys,
    drinkKeys,
    achievementFilter,
  ])

  const count = filteredStores.length

  const handleSearch = useCallback(() => {
    if (count > 0) setIsResultOpen(true)
  }, [count])

  const handleSelectStore = useCallback((store: HomeStore) => {
    setSelectedStore(store)
    setIsDetailOpen(true)
  }, [])

  const selectedFilters = [
    prefecture,
    area,
    storeType,
    ...eventTrendKeys,
    ...ruleKeys,
    ...seatTypeKeys,
    ...smokingKeys,
    ...environmentKeys,
    ...otherKeys,
    ...baggageKeys,
    ...securityKeys,
    ...toiletKeys,
    ...floorKeys,
    sizeKey,
    priceRange,
    ...pricingSystemKeys,
    ...discountKeys,
    ...vipKeys,
    ...paymentMethodKeys,
    ...soundKeys,
    ...lightingKeys,
    ...productionKeys,
    ...customerKeys,
    ...atmosphereKeys,
    hospitalityKey,
    ...foodKeys,
    ...serviceKeys,
    ...drinkKeys,
    achievementFilter.hasAward ? "受賞歴あり" : null,
    achievementFilter.hasMedia ? "メディア掲載あり" : null,
  ].filter(Boolean) as string[]

  // ============================
  // UI
  // ============================
  return (
    <>
      {/* 背景〜コメントまで：今まで通り */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />
        <div className="mt-[80px]">
          <LogoHero />
        </div>
        <div className="mt-[40px]">
          {!loading && (
            <HomeSlider stores={stores} onSelectStore={handleSelectStore} />
          )}
        </div>
        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>
        <div className="h-[160px]" />
      </div>

      {/* 🔻 ここから SearchFilter（元の位置はそのまま） */}
      {/* sentinel: ここが画面上から消えたら SearchFilter を fixed にする */}
      <div ref={filterSentinelRef} />

      {/* SearchFilter 本体。必要に応じて fixed に切り替わる */}
      <div
        ref={filterWrapperRef}
        className={`bg-white w-full py-3 ${isFilterSticky ? "fixed top-0 left-0 right-0 z-40 shadow-sm" : ""
          }`}
      >
        <SearchFilter
          onScrollStore={() => scrollTo(storeRef)}
          onScrollEquipment={() => scrollTo(equipmentRef)}
          onScrollPrice={() => scrollTo(priceRef)}
          onScrollSound={() => scrollTo(soundRef)}
          onScrollDrink={() => scrollTo(drinkRef)}
          onScrollCustomer={() => scrollTo(customerRef)}
        />
      </div>

      {/* fixed 中はその高さ分だけダミー入れて段差をなくす */}
      {isFilterSticky && <div style={{ height: filterHeight }} />}

      <div className="h-6" />

      {/* =============================== */}
      {/* フィルター群（ここは元コードそのまま） */}
      {/* =============================== */}
      <h2 ref={storeRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
        店舗情報
      </h2>

      <AreaSelector onChange={(pref, a) => { setPrefecture(pref); setArea(a) }} />
      <GenericSelector title="店舗タイプ" table="store_types" selection="single" onChange={setStoreType} />
      <GenericSelector title="イベントの傾向" table="event_trend_definitions" selection="multi" onChange={setEventTrendKeys} columns={3} />
      <GenericSelector title="ルール / マナー" table="rule_definitions" selection="multi" onChange={setRuleKeys} columns={3} />
      <AchievementSelector onChange={setAchievementFilter} />

      <div className="h-8" />

      <h2 ref={equipmentRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
        設備
      </h2>

      <GenericSelector title="荷物預かり" table="baggage_definitions" selection="multi" onChange={setBaggageKeys} columns={3} />
      <GenericSelector title="セキュリティ" table="security_definitions" selection="multi" onChange={setSecurityKeys} columns={3} />
      <GenericSelector title="トイレ" table="toilet_definitions" selection="multi" onChange={setToiletKeys} columns={3} />
      <GenericSelector title="広さ" table="size_definitions" selection="single" onChange={setSizeKey} />
      <GenericSelector title="フロアの位置" table="floor_definitions" selection="multi" onChange={setFloorKeys} columns={3} />
      <GenericSelector title="座席タイプ" table="seat_type_definitions" selection="multi" onChange={setSeatTypeKeys} columns={3} />
      <GenericSelector title="喫煙" table="smoking_definitions" selection="multi" onChange={setSmokingKeys} columns={3} />
      <GenericSelector title="周辺環境" table="environment_definitions" selection="multi" onChange={setEnvironmentKeys} columns={3} />
      <GenericSelector title="その他" table="other_definitions" selection="multi" onChange={setOtherKeys} columns={3} />

      <div className="h-8" />

      <h2 ref={priceRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
        料金体系
      </h2>

      <GenericSelector title="価格帯" table="price_range_definitions" selection="single" onChange={setPriceRange} />
      <GenericSelector title="料金システム" table="pricing_system_definitions" selection="multi" onChange={setPricingSystemKeys} columns={3} />
      <GenericSelector title="ディスカウント" table="discount_definitions" selection="multi" onChange={setDiscountKeys} columns={3} />
      <GenericSelector title="VIP" table="vip_definitions" selection="multi" onChange={setVipKeys} columns={3} />
      <GenericSelector title="支払い方法" table="payment_method_definitions" selection="multi" onChange={setPaymentMethodKeys} columns={3} />

      <div className="h-8" />

      <h2 ref={soundRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
        音響・照明
      </h2>

      <GenericSelector title="音響" table="sound_definitions" selection="multi" onChange={setSoundKeys} columns={3} />
      <GenericSelector title="照明" table="lighting_definitions" selection="multi" onChange={setLightingKeys} columns={3} />
      <GenericSelector title="演出" table="production_definitions" selection="multi" onChange={setProductionKeys} columns={3} />

      <div className="h-8" />

      <h2 ref={drinkRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
        飲食・サービス
      </h2>

      <DrinkSelector title="ドリンク" onChange={setDrinkKeys} />
      <GenericSelector title="フード" table="food_definitions" selection="multi" onChange={setFoodKeys} columns={3} />
      <GenericSelector title="サービス" table="service_definitions" selection="multi" onChange={setServiceKeys} columns={3} />

      <div className="h-8" />

      <h2 ref={customerRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
        客層・雰囲気
      </h2>

      <GenericSelector title="客層" table="customer_definitions" selection="multi" onChange={setCustomerKeys} columns={3} />
      <GenericSelector title="雰囲気" table="atmosphere_definitions" selection="multi" onChange={setAtmosphereKeys} columns={3} />
      <GenericSelector title="接客" table="hospitality_definitions" selection="single" onChange={setHospitalityKey} />

      {/* 検索バー */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      <Footer />

      {/* パネル */}
      <SearchResultPanel
        isOpen={isResultOpen}
        onCloseAll={handleCloseAll}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}
      />

      <StoreDetailPanel
        store={selectedStore}
        isOpen={isDetailOpen}
        onCloseAll={handleCloseAll}
      />

      <div className="h-[50px]" />
    </>
  )
}