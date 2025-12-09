"use client"

import { useState, useMemo, useCallback } from "react"
import type { HomeStore } from "@/types/store"

export function useStoreFilters(
  stores: HomeStore[],
  externalLabelMap?: Map<string, string>
) {
  // ============================
  // フィルタ state
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
  // ✅ labelMap（UUID → 日本語）
  // ============================
  const labelMap = useMemo(() => {
    const map = new Map<string, string>()

    stores.forEach((s: any) => {
      if (s.prefecture_id && s.prefecture_label) map.set(s.prefecture_id, s.prefecture_label)
      if (s.area_id && s.area_label) map.set(s.area_id, s.area_label)
    })

    externalLabelMap?.forEach((v, k) => {
      if (!map.has(k)) map.set(k, v)
    })

    return map
  }, [stores, externalLabelMap])

  // ============================
  // ✅ 全クリア
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
  // ✅ 検索ロジック【完全対応】
  // ============================
  const filteredStores = useMemo(() => {
    return stores.filter((s: any) => {
      if (prefecture && s.prefecture_id !== prefecture) return false
      if (area && s.area_id !== area) return false
      if (storeType && s.store_type_id !== storeType) return false

      const m2mChecks: [string[], string[]][] = [
        [eventTrendKeys, s.event_trend_keys ?? []],
        [ruleKeys, s.rule_keys ?? []],
        [seatTypeKeys, s.seat_type_keys ?? []],
        [smokingKeys, s.smoking_keys ?? []],
        [environmentKeys, s.environment_keys ?? []],
        [otherKeys, s.other_keys ?? []],
        [baggageKeys, s.baggage_keys ?? []],
        [securityKeys, s.security_keys ?? []],
        [toiletKeys, s.toilet_keys ?? []],
        [floorKeys, s.floor_keys ?? []],

        [pricingSystemKeys, s.pricing_system_keys ?? []],
        [discountKeys, s.discount_keys ?? []],
        [vipKeys, s.vip_keys ?? []],
        [paymentMethodKeys, s.payment_method_keys ?? []],

        [soundKeys, s.sound_keys ?? []],
        [lightingKeys, s.lighting_keys ?? []],
        [productionKeys, s.production_keys ?? []],

        [foodKeys, s.food_keys ?? []],
        [serviceKeys, s.service_keys ?? []],
        [drinkKeys, s.drink_keys ?? []],

        [customerKeys, s.customer_keys ?? []],
        [atmosphereKeys, s.atmosphere_keys ?? []],
      ]

      for (const [selected, storeKeys] of m2mChecks) {
        if (selected.length > 0 && !selected.some((k) => storeKeys.includes(k))) {
          return false
        }
      }

      if (sizeKey && s.size_key !== sizeKey) return false
      if (priceRange && s.price_range_id !== priceRange) return false
      if (hospitalityKey && s.hospitality_key !== hospitalityKey) return false

      if (achievementFilter.hasAward && !s.hasAward) return false
      if (achievementFilter.hasMedia && !s.hasMedia) return false

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
    foodKeys,
    serviceKeys,
    drinkKeys,
    customerKeys,
    atmosphereKeys,
    hospitalityKey,
    achievementFilter,
  ])

  const count = filteredStores.length

  // ============================
  // ✅ 検索バー表示用フィルター【完全対応】
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

    ...foodKeys.map((k) => labelMap.get(k) ?? k),
    ...serviceKeys.map((k) => labelMap.get(k) ?? k),
    ...drinkKeys.map((k) => labelMap.get(k) ?? k),

    ...customerKeys.map((k) => labelMap.get(k) ?? k),
    ...atmosphereKeys.map((k) => labelMap.get(k) ?? k),
    hospitalityKey ? labelMap.get(hospitalityKey) ?? hospitalityKey : null,

    achievementFilter.hasAward ? "受賞あり" : null,
    achievementFilter.hasMedia ? "メディア掲載あり" : null,
  ].filter(Boolean) as string[]

  // ============================
  // ✅ パネル制御
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

  // ============================
  // ✅ return（Home 側と完全一致）
  // ============================
  return {
    prefecture, setPrefecture,
    area, setArea,
    storeType, setStoreType,

    eventTrendKeys, setEventTrendKeys,
    ruleKeys, setRuleKeys,

    achievementFilter, setAchievementFilter,

    seatTypeKeys, setSeatTypeKeys,
    smokingKeys, setSmokingKeys,
    environmentKeys, setEnvironmentKeys,
    otherKeys, setOtherKeys,
    baggageKeys, setBaggageKeys,
    securityKeys, setSecurityKeys,
    toiletKeys, setToiletKeys,
    floorKeys, setFloorKeys,
    sizeKey, setSizeKey,

    priceRange, setPriceRange,
    pricingSystemKeys, setPricingSystemKeys,
    discountKeys, setDiscountKeys,
    vipKeys, setVipKeys,
    paymentMethodKeys, setPaymentMethodKeys,

    soundKeys, setSoundKeys,
    lightingKeys, setLightingKeys,
    productionKeys, setProductionKeys,

    customerKeys, setCustomerKeys,
    atmosphereKeys, setAtmosphereKeys,
    hospitalityKey, setHospitalityKey,

    foodKeys, setFoodKeys,
    serviceKeys, setServiceKeys,
    drinkKeys, setDrinkKeys,

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