"use client"

import { useState, useMemo, useCallback } from "react"
import type { HomeStore, StoreType } from "@/types/store"

type Options = {
  storeType?: StoreType | null
}

export function useHomeStoreFilters(
  stores: HomeStore[],
  externalLabelMap?: Map<string, string>,
  options?: Options
) {
  const [prefectureIds, setPrefectureIds] = useState<string[]>([])
  const [areaIds, setAreaIds] = useState<string[]>([])

  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [sizeKeys, setSizeKeys] = useState<string[]>([])

  const [drinkKeys, setDrinkKeys] = useState<string[]>([])
  const [priceRangeKeys, setPriceRangeKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])

  const labelMap = useMemo(() => {
    const map = new Map<string, string>()

    stores.forEach((s) => {
      if (s.prefecture_id && s.prefecture_label) map.set(s.prefecture_id, s.prefecture_label)
      if (s.area_id && s.area_label) map.set(s.area_id, s.area_label)
    })

    externalLabelMap?.forEach((v, k) => {
      if (!map.has(k)) map.set(k, v)
    })

    return map
  }, [stores, externalLabelMap])

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      // ✅ null のときは無視、値があるときだけ絞る
      if (options?.storeType != null && s.store_type_id !== options.storeType) {
        return false
      }

      if (prefectureIds.length && (!s.prefecture_id || !prefectureIds.includes(s.prefecture_id))) {
        return false
      }

      if (areaIds.length && (!s.area_id || !areaIds.includes(s.area_id))) {
        return false
      }

      const checks: [string[], string[]][] = [
        [customerKeys, s.customer_keys ?? []],
        [atmosphereKeys, s.atmosphere_keys ?? []],
        [sizeKeys, s.size_key ? [s.size_key] : []],
        [drinkKeys, s.drink_keys ?? []],
        [priceRangeKeys, s.price_range_id ? [s.price_range_id] : []],
        [paymentMethodKeys, s.payment_method_keys ?? []],
        [eventTrendKeys, s.event_trend_keys ?? []],
        [baggageKeys, s.baggage_keys ?? []],
        [smokingKeys, s.smoking_keys ?? []],
        [toiletKeys, s.toilet_keys ?? []],
        [otherKeys, s.other_keys ?? []],
      ]

      for (const [selected, storeValues] of checks) {
        if (selected.length && !selected.some((k) => storeValues.includes(k))) {
          return false
        }
      }

      return true
    })
  }, [
    stores,
    options?.storeType,
    prefectureIds,
    areaIds,
    customerKeys,
    atmosphereKeys,
    sizeKeys,
    drinkKeys,
    priceRangeKeys,
    paymentMethodKeys,
    eventTrendKeys,
    baggageKeys,
    smokingKeys,
    toiletKeys,
    otherKeys,
  ])

  const count = filteredStores.length

  const selectedFilters = [
    ...prefectureIds,
    ...areaIds,
    ...customerKeys,
    ...atmosphereKeys,
    ...sizeKeys,
    ...drinkKeys,
    ...priceRangeKeys,
    ...paymentMethodKeys,
    ...eventTrendKeys,
    ...baggageKeys,
    ...smokingKeys,
    ...toiletKeys,
    ...otherKeys,
  ].map((k) => labelMap.get(k) ?? k)

  const handleClear = useCallback(() => {
    setPrefectureIds([])
    setAreaIds([])
    setCustomerKeys([])
    setAtmosphereKeys([])
    setSizeKeys([])
    setDrinkKeys([])
    setPriceRangeKeys([])
    setPaymentMethodKeys([])
    setEventTrendKeys([])
    setBaggageKeys([])
    setSmokingKeys([])
    setToiletKeys([])
    setOtherKeys([])
  }, [])

  return {
    prefectureIds, setPrefectureIds,
    areaIds, setAreaIds,
    customerKeys, setCustomerKeys,
    atmosphereKeys, setAtmosphereKeys,
    sizeKeys, setSizeKeys,
    drinkKeys, setDrinkKeys,
    priceRangeKeys, setPriceRangeKeys,
    paymentMethodKeys, setPaymentMethodKeys,
    eventTrendKeys, setEventTrendKeys,
    baggageKeys, setBaggageKeys,
    smokingKeys, setSmokingKeys,
    toiletKeys, setToiletKeys,
    otherKeys, setOtherKeys,

    filteredStores,
    selectedFilters,
    count,
    handleClear,
  }
}