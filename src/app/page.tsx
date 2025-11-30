"use client"

import { useState, useCallback, useMemo } from "react"
import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import HomeSlider from "@/components/home/HomeSlider"
import CommentSlider from "@/components/home/CommentSlider"
import { useHomeStores } from "@/hooks/useHomeStores"
import SearchFilter from "@/components/home/SearchFilter"

import AreaSelector from "@/components/home/AreaSelector"
import AchievementSelector from "@/components/home/AchievementSelector"
import GenericSelector from "@/components/home/GenericSelector"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"

import type { HomeStore } from "@/types/store"

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
  // GenericSelector（料金系 新規）
  // --------------------------------------------------
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [pricingSystemKeys, setPricingSystemKeys] = useState<string[]>([])
  const [discountKeys, setDiscountKeys] = useState<string[]>([])
  const [vipKeys, setVipKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  // --------------------------------------------------
  // GenericSelector（音響・照明チーム）
  // --------------------------------------------------
  const [soundKeys, setSoundKeys] = useState<string[]>([])
  const [lightingKeys, setLightingKeys] = useState<string[]>([])
  const [productionKeys, setProductionKeys] = useState<string[]>([])

  // --------------------------------------------------
  // GenericSelector（客層・雰囲気チーム）
  // --------------------------------------------------
  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [hospitalityKey, setHospitalityKey] = useState<string | null>(null)

  // --------------------------------------------------
  // パネル制御
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

    // 料金系
    setPriceRange(null)
    setPricingSystemKeys([])
    setDiscountKeys([])
    setVipKeys([])
    setPaymentMethodKeys([])

    // 音響・照明チーム
    setSoundKeys([])
    setLightingKeys([])
    setProductionKeys([])

    // 客層・雰囲気チーム
    setCustomerKeys([])
    setAtmosphereKeys([])
    setHospitalityKey(null)

    setAchievementFilter({ hasAward: false, hasMedia: false })
  }, [])

  // --------------------------------------------------
  // フィルタ実行
  // --------------------------------------------------
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      // 基本
      if (prefecture && s.prefecture !== prefecture) return false
      if (area && s.area !== area) return false
      if (storeType && s.store_type_id !== storeType) return false

      // 実績
      if (achievementFilter.hasAward && !s.hasAward) return false
      if (achievementFilter.hasMedia && !s.hasMedia) return false

      // multi の AND 条件
      const checks: [string[], string[]][] = [
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

        // 料金系
        [pricingSystemKeys, s.pricing_system_keys],
        [discountKeys, s.discount_keys],
        [vipKeys, s.vip_keys],
        [paymentMethodKeys, s.payment_method_keys],

        // 音響・照明チーム
        [soundKeys, s.sound_keys],
        [lightingKeys, s.lighting_keys],
        [productionKeys, s.production_keys],

        // 客層・雰囲気チーム
        [customerKeys, s.customer_keys],
        [atmosphereKeys, s.atmosphere_keys],
      ]

      for (const [selected, storeKeys] of checks) {
        if (selected.length > 0 && !selected.every((k) => storeKeys.includes(k))) {
          return false
        }
      }

      // 単一サイズ
      if (sizeKey && s.size_key !== sizeKey) return false

      // 単一価格帯
      if (priceRange && s.price_range_id !== priceRange) return false

      // 単一定接客
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
    achievementFilter,
  ])

  const count = filteredStores.length

  const handleSearch = useCallback(() => {
    if (count > 0) setIsResultOpen(true)
  }, [count])

  // --------------------------------------------------
  // 選択中フィルタ表示用
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

    // 料金系
    priceRange,
    ...pricingSystemKeys,
    ...discountKeys,
    ...vipKeys,
    ...paymentMethodKeys,

    // 音響・照明チーム
    ...soundKeys,
    ...lightingKeys,
    ...productionKeys,

    // 客層・雰囲気チーム
    ...customerKeys,
    ...atmosphereKeys,
    hospitalityKey,

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
        <div className="mt-[80px]">
          <LogoHero />
        </div>
        <div className="mt-[40px]">
          {!loading && (
            <HomeSlider
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

      {/* フィルタ */}
      <div className="bg-white w-full py-8">
        <SearchFilter />
        <div className="h-6" />

        {/* 地域 */}
        <AreaSelector
          onChange={(pref, a) => {
            setPrefecture(pref)
            setArea(a)
          }}
        />

        {/* 店舗タイプ */}
        <GenericSelector
          title="店舗タイプ"
          table="store_types"
          selection="single"
          onChange={setStoreType}
        />

        {/* 実績 */}
        <AchievementSelector onChange={setAchievementFilter} />

        {/* 価格帯 */}
        <GenericSelector
          title="価格帯"
          table="price_range_definitions"
          selection="single"
          onChange={setPriceRange}
        />

        {/* 料金システム */}
        <GenericSelector
          title="料金システム"
          table="pricing_system_definitions"
          selection="multi"
          onChange={setPricingSystemKeys}
        />

        {/* ディスカウント */}
        <GenericSelector
          title="ディスカウント"
          table="discount_definitions"
          selection="multi"
          onChange={setDiscountKeys}
        />

        {/* VIP */}
        <GenericSelector
          title="VIP"
          table="vip_definitions"
          selection="multi"
          onChange={setVipKeys}
        />

        {/* 支払い方法 */}
        <GenericSelector
          title="支払い方法"
          table="payment_method_definitions"
          selection="multi"
          onChange={setPaymentMethodKeys}
        />

        {/* ▼ 既存 汎用フィルタ */}
        <GenericSelector
          title="座席タイプ"
          table="seat_type_definitions"
          selection="multi"
          onChange={setSeatTypeKeys}
        />
        <GenericSelector
          title="喫煙"
          table="smoking_definitions"
          selection="multi"
          onChange={setSmokingKeys}
        />
        <GenericSelector
          title="周辺環境"
          table="environment_definitions"
          selection="multi"
          onChange={setEnvironmentKeys}
        />
        <GenericSelector
          title="その他"
          table="other_definitions"
          selection="multi"
          onChange={setOtherKeys}
        />
        <GenericSelector
          title="荷物預かり"
          table="baggage_definitions"
          selection="multi"
          onChange={setBaggageKeys}
        />
        <GenericSelector
          title="セキュリティ"
          table="security_definitions"
          selection="multi"
          onChange={setSecurityKeys}
        />
        <GenericSelector
          title="トイレ"
          table="toilet_definitions"
          selection="multi"
          onChange={setToiletKeys}
        />
        <GenericSelector
          title="フロア位置"
          table="floor_definitions"
          selection="multi"
          onChange={setFloorKeys}
        />
        <GenericSelector
          title="広さ"
          table="size_definitions"
          selection="single"
          onChange={setSizeKey}
        />

        {/* ▼ 音響・照明チーム */}
        <GenericSelector
          title="音響"
          table="sound_definitions"
          selection="multi"
          onChange={setSoundKeys}
        />
        <GenericSelector
          title="照明"
          table="lighting_definitions"
          selection="multi"
          onChange={setLightingKeys}
        />
        <GenericSelector
          title="演出"
          table="production_definitions"
          selection="multi"
          onChange={setProductionKeys}
        />

        {/* ▼ 客層・雰囲気チーム */}
        <GenericSelector
          title="客層"
          table="customer_definitions"
          selection="multi"
          onChange={setCustomerKeys}
        />
        <GenericSelector
          title="雰囲気"
          table="atmosphere_definitions"
          selection="multi"
          onChange={setAtmosphereKeys}
        />
        <GenericSelector
          title="接客"
          table="hospitality_definitions"
          selection="single"
          onChange={setHospitalityKey}
        />
      </div>

      {/* 固定検索バー */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      {/* 結果パネル */}
      <SearchResultPanel
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onCloseAll={handleCloseAll}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}
      />

      {/* 詳細パネル */}
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