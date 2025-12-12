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
  const [prefectureIds, setPrefectureIds] = useState<string[]>([])
  const [areaIds, setAreaIds] = useState<string[]>([])
  const [storeTypeKeys, setStoreTypeKeys] = useState<string[]>([])

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
  const [sizeKey, setSizeKey] = useState<string[]>([])

  const [priceRangeKeys, setPriceRangeKeys] = useState<string[]>([])
  const [pricingSystemKeys, setPricingSystemKeys] = useState<string[]>([])
  const [discountKeys, setDiscountKeys] = useState<string[]>([])
  const [vipKeys, setVipKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  const [soundKeys, setSoundKeys] = useState<string[]>([])
  const [lightingKeys, setLightingKeys] = useState<string[]>([])
  const [productionKeys, setProductionKeys] = useState<string[]>([])

  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [hospitalityKeys, setHospitalityKeys] = useState<string[]>([])

  const [foodKeys, setFoodKeys] = useState<string[]>([])
  const [serviceKeys, setServiceKeys] = useState<string[]>([])
  const [drinkKeys, setDrinkKeys] = useState<string[]>([])

  // ============================
  // ✅ labelMap（UUID → 日本語）
  // ============================
  const labelMap = useMemo(() => {
    const map = new Map<string, string>()

    stores.forEach((s: HomeStore) => {
      if (s.prefecture_id && s.prefecture_label) {
        map.set(s.prefecture_id, s.prefecture_label)
      }
      if (s.area_id && s.area_label) {
        map.set(s.area_id, s.area_label)
      }
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
    setPrefectureIds([])
    setAreaIds([])
    setStoreTypeKeys([])

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
    setSizeKey([])

    setPriceRangeKeys([])
    setPricingSystemKeys([])
    setDiscountKeys([])
    setVipKeys([])
    setPaymentMethodKeys([])

    setSoundKeys([])
    setLightingKeys([])
    setProductionKeys([])

    setCustomerKeys([])
    setAtmosphereKeys([])
    setHospitalityKeys([])

    setFoodKeys([])
    setServiceKeys([])
    setDrinkKeys([])

    setAchievementFilter({ hasAward: false, hasMedia: false })
  }, [])

  // ============================
  // ✅ 検索ロジック【完全対応】
  // ============================
  const filteredStores = useMemo(() => {
    return stores.filter((s: HomeStore) => {
      // =====================
      // エリア系
      // =====================
      if (
        prefectureIds.length > 0 &&
        (!s.prefecture_id || !prefectureIds.includes(s.prefecture_id))
      ) return false

      if (
        areaIds.length > 0 &&
        (!s.area_id || !areaIds.includes(s.area_id))
      ) return false

      if (
        storeTypeKeys.length > 0 &&
        (!s.store_type_id || !storeTypeKeys.includes(s.store_type_id))
      ) return false

      // =====================
      // M2M 系（OR 条件）
      // =====================
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
        if (selected.length > 0 && !selected.some(k => storeKeys.includes(k))) {
          return false
        }
      }

      // =====================
      // 単一系
      // =====================
      if (
        sizeKey.length > 0 &&
        (!s.size_key || !sizeKey.includes(s.size_key))
      ) return false

      if (
        priceRangeKeys.length > 0 &&
        (!s.price_range_id || !priceRangeKeys.includes(s.price_range_id))
      ) return false

      if (
        hospitalityKeys.length > 0 &&
        (!s.hospitality_key || !hospitalityKeys.includes(s.hospitality_key))
      ) return false

      // =====================
      // 実績フラグ
      // =====================
      if (achievementFilter.hasAward && !s.hasAward) return false
      if (achievementFilter.hasMedia && !s.hasMedia) return false

      return true
    })
  }, [
    stores,
    prefectureIds,
    areaIds,
    storeTypeKeys,
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
    priceRangeKeys,
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
    hospitalityKeys,
    achievementFilter,
  ])

  const count = filteredStores.length

  // ============================
  // ✅ 検索バー表示用フィルター【完全対応】
  // ============================
  const selectedFilters = [
    ...prefectureIds.map(id => labelMap.get(id) ?? id),
    ...areaIds.map(id => labelMap.get(id) ?? id),
    ...storeTypeKeys.map((k) => labelMap.get(k) ?? k),

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

    ...sizeKey.map((k) => labelMap.get(k) ?? k),

    ...priceRangeKeys.map((k) => labelMap.get(k) ?? k),
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
    ...hospitalityKeys.map((k) => labelMap.get(k) ?? k),

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
    prefectureIds, setPrefectureIds,
    areaIds, setAreaIds,
    storeTypeKeys, setStoreTypeKeys,

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

    priceRangeKeys, setPriceRangeKeys,
    pricingSystemKeys, setPricingSystemKeys,
    discountKeys, setDiscountKeys,
    vipKeys, setVipKeys,
    paymentMethodKeys, setPaymentMethodKeys,

    soundKeys, setSoundKeys,
    lightingKeys, setLightingKeys,
    productionKeys, setProductionKeys,

    customerKeys, setCustomerKeys,
    atmosphereKeys, setAtmosphereKeys,
    hospitalityKeys, setHospitalityKeys,

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