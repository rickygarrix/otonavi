"use client"

import { useState, useMemo, useCallback } from "react"
import type { HomeStore } from "@/types/store"

export function useStoreFilters(stores: HomeStore[]) {
  // ============================
  // フィルタ state（すべて id ベース）
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
  // ✅ id → label 変換マップ
  // ============================
  const labelMap = useMemo(() => {
    const map = new Map<string, string>()

    stores.forEach((s: any) => {
      if (s.prefecture_id && s.prefecture_label) map.set(s.prefecture_id, s.prefecture_label)
      if (s.area_id && s.area_label) map.set(s.area_id, s.area_label)
      if (s.store_type_id && s.type) map.set(s.store_type_id, s.type)
      if (s.size_key && s.size_label) map.set(s.size_key, s.size_label)
      if (s.price_range_id && s.price_range_label) map.set(s.price_range_id, s.price_range_label)
      if (s.hospitality_key && s.hospitality_label) map.set(s.hospitality_key, s.hospitality_label)

      const pairs: [string[] | undefined, string[] | undefined][] = [
        [s.event_trend_keys, s.event_trend_labels],
        [s.rule_keys, s.rule_labels],
        [s.seat_type_keys, s.seat_type_labels],
        [s.smoking_keys, s.smoking_labels],
        [s.environment_keys, s.environment_labels],
        [s.other_keys, s.other_labels],
        [s.baggage_keys, s.baggage_labels],
        [s.security_keys, s.security_labels],
        [s.toilet_keys, s.toilet_labels],
        [s.floor_keys, s.floor_labels],
        [s.pricing_system_keys, s.pricing_system_labels],
        [s.discount_keys, s.discount_labels],
        [s.vip_keys, s.vip_labels],
        [s.payment_method_keys, s.payment_method_labels],
        [s.sound_keys, s.sound_labels],
        [s.lighting_keys, s.lighting_labels],
        [s.production_keys, s.production_labels],
        [s.customer_keys, s.customer_labels],
        [s.atmosphere_keys, s.atmosphere_labels],
        [s.food_keys, s.food_labels],
        [s.service_keys, s.service_labels],
        [s.drink_keys, s.drink_labels],
      ]

      pairs.forEach(([keys, labels]) => {
        keys?.forEach((k, i) => map.set(k, labels?.[i] ?? k))
      })
    })

    return map
  }, [stores])

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
  // 絞り込みロジック（完全OK）
  // ============================
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
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

  // ============================
  // ✅ 表示用フィルター（ID → 日本語）
  // ============================
  const selectedFilters = [
    prefecture ? labelMap.get(prefecture) ?? prefecture : null,
    area ? labelMap.get(area) ?? area : null,
    storeType ? labelMap.get(storeType) ?? storeType : null,

    ...eventTrendKeys.map((k) => labelMap.get(k) ?? k),
    ...ruleKeys.map((k) => labelMap.get(k) ?? k),
    ...seatTypeKeys.map((k) => labelMap.get(k) ?? k),
    ...smokingKeys.map((k) => labelMap.get(k) ?? k),
    ...environmentKeys.map((k) => labelMap.get(k) ?? k),
    ...otherKeys.map((k) => labelMap.get(k) ?? k),
    ...baggageKeys.map((k) => labelMap.get(k) ?? k),
    ...securityKeys.map((k) => labelMap.get(k) ?? k),
    ...toiletKeys.map((k) => labelMap.get(k) ?? k),
    ...floorKeys.map((k) => labelMap.get(k) ?? k),

    sizeKey ? labelMap.get(sizeKey) ?? sizeKey : null,
    priceRange ? labelMap.get(priceRange) ?? priceRange : null,

    ...pricingSystemKeys.map((k) => labelMap.get(k) ?? k),
    ...discountKeys.map((k) => labelMap.get(k) ?? k),
    ...vipKeys.map((k) => labelMap.get(k) ?? k),
    ...paymentMethodKeys.map((k) => labelMap.get(k) ?? k),

    ...soundKeys.map((k) => labelMap.get(k) ?? k),
    ...lightingKeys.map((k) => labelMap.get(k) ?? k),
    ...productionKeys.map((k) => labelMap.get(k) ?? k),

    ...customerKeys.map((k) => labelMap.get(k) ?? k),
    ...atmosphereKeys.map((k) => labelMap.get(k) ?? k),

    hospitalityKey ? labelMap.get(hospitalityKey) ?? hospitalityKey : null,

    ...foodKeys.map((k) => labelMap.get(k) ?? k),
    ...serviceKeys.map((k) => labelMap.get(k) ?? k),
    ...drinkKeys.map((k) => labelMap.get(k) ?? k),

    achievementFilter.hasAward ? "受賞歴あり" : null,
    achievementFilter.hasMedia ? "メディア掲載あり" : null,
  ].filter(Boolean) as string[]

  // ============================
  // パネル制御
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