// hooks/useStoreFilters.ts
"use client"

import { useState, useMemo, useCallback } from "react"
import type { HomeStore } from "@/types/store"

export function useStoreFilters(stores: HomeStore[]) {
  // ============================
  // フィルタ state（全部 id ベース）
  // ============================
  const [prefecture, setPrefecture] = useState<string | null>(null)  // prefecture_id
  const [area, setArea] = useState<string | null>(null)              // area_id
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

  const [priceRange, setPriceRange] = useState<string | null>(null) // price_range_id
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
  // 絞り込みロジック
  // ============================
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      // ★ ここで stores の id と比較する
      if (prefecture && s.prefecture_id !== prefecture) return false
      if (area && s.area_id !== area) return false
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
        if (selected.length > 0 && !selected.every((k) => storeKeys.includes(k))) {
          return false
        }
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

  // いまは selectedFilters に id が入る状態のままで OK（後で label 化するときに直す）
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
  // 店舗選択系
  // ============================
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)

  const handleSearch = useCallback(() => {
    if (count > 0) setIsResultOpen(true)
  }, [count])

  const handleSelectStore = useCallback((store: HomeStore) => {
    setSelectedStore(store)
    setIsDetailOpen(true)
  }, [])

  const handleCloseAll = useCallback(() => {
    setIsResultOpen(false)
    setIsDetailOpen(false)
    setSelectedStore(null)
  }, [])

  return {
    prefecture,
    setPrefecture,
    area,
    setArea,
    storeType,
    setStoreType,

    eventTrendKeys,
    setEventTrendKeys,
    ruleKeys,
    setRuleKeys,

    achievementFilter,
    setAchievementFilter,

    seatTypeKeys,
    setSeatTypeKeys,
    smokingKeys,
    setSmokingKeys,
    environmentKeys,
    setEnvironmentKeys,
    otherKeys,
    setOtherKeys,
    baggageKeys,
    setBaggageKeys,
    securityKeys,
    setSecurityKeys,
    toiletKeys,
    setToiletKeys,
    floorKeys,
    setFloorKeys,
    sizeKey,
    setSizeKey,

    priceRange,
    setPriceRange,
    pricingSystemKeys,
    setPricingSystemKeys,
    discountKeys,
    setDiscountKeys,
    vipKeys,
    setVipKeys,
    paymentMethodKeys,
    setPaymentMethodKeys,

    soundKeys,
    setSoundKeys,
    lightingKeys,
    setLightingKeys,
    productionKeys,
    setProductionKeys,

    customerKeys,
    setCustomerKeys,
    atmosphereKeys,
    setAtmosphereKeys,
    hospitalityKey,
    setHospitalityKey,

    foodKeys,
    setFoodKeys,
    serviceKeys,
    setServiceKeys,
    drinkKeys,
    setDrinkKeys,

    filteredStores,
    selectedFilters,
    count,

    isResultOpen,
    isDetailOpen,
    selectedStore,
    handleSearch,
    handleSelectStore,
    handleCloseAll,

    handleClear,
  }
}