"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import HomeSlider from "@/components/home/HomeSlider"
import CommentSlider from "@/components/home/CommentSlider"
import { useHomeStores } from "@/hooks/useHomeStores"
import SearchFilter from "@/components/home/SearchFilter"

import AreaSelector from "@/components/home/AreaSelector"
import AchievementSelector from "@/components/home/AchievementSelector"
import GenericSelector from "@/components/home/GenericSelector"

import DrinkSelector from "@/components/home/DrinkSelector"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"

import type { HomeStore } from "@/types/store"

import Footer from "@/components/Footer"

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  // --------------------------------------------------
  // 基本フィルタ
  // --------------------------------------------------
  const [prefecture, setPrefecture] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<string | null>(null)

  // --------------------------------------------------
  // 既存フィルタ
  // --------------------------------------------------
  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [ruleKeys, setRuleKeys] = useState<string[]>([])
  const [achievementFilter, setAchievementFilter] = useState({
    hasAward: false,
    hasMedia: false,
  })

  // --------------------------------------------------
  // GenericSelector（既存）
  // --------------------------------------------------
  const [seatTypeKeys, setSeatTypeKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [environmentKeys, setEnvironmentKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [securityKeys, setSecurityKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [floorKeys, setFloorKeys] = useState<string[]>([])
  const [sizeKey, setSizeKey] = useState<string | null>(null)

  // --------------------------------------------------
  // GenericSelector（料金系）
  // --------------------------------------------------
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [pricingSystemKeys, setPricingSystemKeys] = useState<string[]>([])
  const [discountKeys, setDiscountKeys] = useState<string[]>([])
  const [vipKeys, setVipKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  // --------------------------------------------------
  // 音響・照明・演出
  // --------------------------------------------------
  const [soundKeys, setSoundKeys] = useState<string[]>([])
  const [lightingKeys, setLightingKeys] = useState<string[]>([])
  const [productionKeys, setProductionKeys] = useState<string[]>([])

  // --------------------------------------------------
  // 客層・雰囲気・接客
  // --------------------------------------------------
  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [hospitalityKey, setHospitalityKey] = useState<string | null>(null)

  // --------------------------------------------------
  // フード・サービス
  // --------------------------------------------------
  const [foodKeys, setFoodKeys] = useState<string[]>([])
  const [serviceKeys, setServiceKeys] = useState<string[]>([])

  // --------------------------------------------------
  // 🍺 ドリンク（カテゴリ別）
  // --------------------------------------------------
  const [drinkKeys, setDrinkKeys] = useState<string[]>([])

  // --------------------------------------------------
  // パネル
  // --------------------------------------------------
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)

  const handleCloseAll = useCallback(() => {
    setIsDetailOpen(false)
    setIsResultOpen(false)
    setSelectedStore(null)
  }, [])

  // --------------------------------------------------
  // 全クリア
  // --------------------------------------------------
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

  // --------------------------------------------------
  // セクションのスクロール制御
  // --------------------------------------------------
  const storeRef = useRef<HTMLHeadingElement | null>(null)
  const equipmentRef = useRef<HTMLHeadingElement | null>(null)
  const priceRef = useRef<HTMLHeadingElement | null>(null)
  const soundRef = useRef<HTMLHeadingElement | null>(null)
  const drinkRef = useRef<HTMLHeadingElement | null>(null)
  const customerRef = useRef<HTMLHeadingElement | null>(null)

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // --------------------------------------------------
  // フィルタ実行
  // --------------------------------------------------
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

  // --------------------------------------------------
  // 選択中フィルタ一覧
  // --------------------------------------------------
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

  const handleSelectStore = useCallback((store: HomeStore) => {
    setSelectedStore(store)
    setIsDetailOpen(true)
  }, [])

  // ==================================================
  // UI
  // ==================================================
  return (
    <>
      {/* 背景 */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />
        <div className="mt-[80px]"><LogoHero /></div>
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

      {/* フィルタ */}
      <div className="bg-white w-full py-8">
        <SearchFilter
          onScrollStore={() => scrollTo(storeRef)}
          onScrollEquipment={() => scrollTo(equipmentRef)}
          onScrollPrice={() => scrollTo(priceRef)}
          onScrollSound={() => scrollTo(soundRef)}
          onScrollDrink={() => scrollTo(drinkRef)}
          onScrollCustomer={() => scrollTo(customerRef)}
        />
        <div className="h-6" />

        {/* =============================== */}
        {/* 🟣 店舗情報 */}
        {/* =============================== */}
        <h2 ref={storeRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
          店舗情報
        </h2>

        <AreaSelector onChange={(pref, a) => { setPrefecture(pref); setArea(a) }} />
        <GenericSelector title="店舗タイプ" table="store_types" selection="single" onChange={setStoreType} />

        {/* ★ 3列指定 */}
        <GenericSelector title="イベントの傾向" table="event_trend_definitions" selection="multi" onChange={setEventTrendKeys} columns={3} />

        {/* ★ 3列指定 */}
        <GenericSelector title="ルール / マナー" table="rule_definitions" selection="multi" onChange={setRuleKeys} columns={3} />

        <AchievementSelector onChange={setAchievementFilter} />

        <div className="h-8" />

        {/* =============================== */}
        {/* 🟣 設備 */}
        {/* =============================== */}
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

        {/* =============================== */}
        {/* 🟣 料金体系 */}
        {/* =============================== */}
        <h2 ref={priceRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
          料金体系
        </h2>

        <GenericSelector title="価格帯" table="price_range_definitions" selection="single" onChange={setPriceRange} />

        <GenericSelector title="料金システム" table="pricing_system_definitions" selection="multi" onChange={setPricingSystemKeys} columns={3} />
        <GenericSelector title="ディスカウント" table="discount_definitions" selection="multi" onChange={setDiscountKeys} columns={3} />
        <GenericSelector title="VIP" table="vip_definitions" selection="multi" onChange={setVipKeys} columns={3} />
        <GenericSelector title="支払い方法" table="payment_method_definitions" selection="multi" onChange={setPaymentMethodKeys} columns={3} />

        <div className="h-8" />

        {/* =============================== */}
        {/* 🟣 音響・照明 */}
        {/* =============================== */}
        <h2 ref={soundRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
          音響・照明
        </h2>

        <GenericSelector title="音響" table="sound_definitions" selection="multi" onChange={setSoundKeys} columns={3} />
        <GenericSelector title="照明" table="lighting_definitions" selection="multi" onChange={setLightingKeys} columns={3} />
        <GenericSelector title="演出" table="production_definitions" selection="multi" onChange={setProductionKeys} columns={3} />

        <div className="h-8" />

        {/* =============================== */}
        {/* 🟣 飲食・サービス */}
        {/* =============================== */}
        <h2 ref={drinkRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
          飲食・サービス
        </h2>

        <DrinkSelector title="ドリンク" onChange={setDrinkKeys} />
        <GenericSelector title="フード" table="food_definitions" selection="multi" onChange={setFoodKeys} columns={3} />
        <GenericSelector title="サービス" table="service_definitions" selection="multi" onChange={setServiceKeys} columns={3} />

        <div className="h-8" />

        {/* =============================== */}
        {/* 🟣 客層・雰囲気 */}
        {/* =============================== */}
        <h2 ref={customerRef} className="px-6 text-xl font-bold text-slate-800 mb-4">
          客層・雰囲気
        </h2>

        <GenericSelector title="客層" table="customer_definitions" selection="multi" onChange={setCustomerKeys} columns={3} />
        <GenericSelector title="雰囲気" table="atmosphere_definitions" selection="multi" onChange={setAtmosphereKeys} columns={3} />
        <GenericSelector title="接客" table="hospitality_definitions" selection="single" onChange={setHospitalityKey} />

      </div>



      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      <Footer />

      <SearchResultPanel
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onCloseAll={handleCloseAll}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}
      />

      <StoreDetailPanel
        store={selectedStore}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onCloseAll={handleCloseAll}
      />

      <div className="h-[50px]" />
    </>
  )
}