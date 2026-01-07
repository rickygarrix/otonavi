"use client"

import { useCallback, useMemo, useState } from "react"

type Options = {
  storeTypeId?: string | null
}

/**
 * Home 専用フィルター状態管理
 * - Home では検索しない
 * - ただし「URLに渡す用の keys」と「表示用 labels」は分けて持つ
 */
export function useHomeFilterState(
  externalLabelMap?: Map<string, string>,
  options?: Options
) {
  // ===== エリア系 =====
  const [prefectureIds, setPrefectureIds] = useState<string[]>([])
  const [areaIds, setAreaIds] = useState<string[]>([])

  // ===== 属性系 =====
  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [environmentKeys, setEnvironmentKeys] = useState<string[]>([])
  const [sizeKeys, setSizeKeys] = useState<string[]>([])

  const [drinkKeys, setDrinkKeys] = useState<string[]>([])
  const [priceRangeKeys, setPriceRangeKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])

  /**
   * ✅ URL に渡す “生キー” 一覧
   * - prefectureIds / areaIds は id のまま
   * - 各 *_keys は key のまま
   */
  const selectedKeys = useMemo(() => {
    return [
      ...prefectureIds,
      ...areaIds,
      ...customerKeys,
      ...atmosphereKeys,
      ...environmentKeys,
      ...sizeKeys,
      ...drinkKeys,
      ...priceRangeKeys,
      ...paymentMethodKeys,
      ...eventTrendKeys,
      ...baggageKeys,
      ...smokingKeys,
      ...toiletKeys,
      ...otherKeys,
    ]
  }, [
    prefectureIds,
    areaIds,
    customerKeys,
    atmosphereKeys,
    environmentKeys,
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

  /**
   * ✅ SearchBar に表示する “ラベル” 一覧
   */
  const selectedLabels = useMemo(() => {
    return selectedKeys.map((k) => externalLabelMap?.get(k) ?? k)
  }, [selectedKeys, externalLabelMap])

  /**
   * ✅ 全解除（Home 用）
   */
  const handleClear = useCallback(() => {
    setPrefectureIds([])
    setAreaIds([])

    setCustomerKeys([])
    setAtmosphereKeys([])
    setEnvironmentKeys([])
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
    // storeTypeId は HomePage 側 state で持つ想定（optionsは将来用）
    storeTypeId: options?.storeTypeId ?? null,

    // ===== raw keys =====
    selectedKeys,

    // ===== display labels =====
    selectedLabels,

    // ===== state =====
    prefectureIds,
    areaIds,

    customerKeys,
    atmosphereKeys,
    environmentKeys,
    sizeKeys,

    drinkKeys,
    priceRangeKeys,
    paymentMethodKeys,

    eventTrendKeys,
    baggageKeys,
    smokingKeys,
    toiletKeys,
    otherKeys,

    // ===== setters =====
    setPrefectureIds,
    setAreaIds,

    setCustomerKeys,
    setAtmosphereKeys,
    setEnvironmentKeys,
    setSizeKeys,

    setDrinkKeys,
    setPriceRangeKeys,
    setPaymentMethodKeys,

    setEventTrendKeys,
    setBaggageKeys,
    setSmokingKeys,
    setToiletKeys,
    setOtherKeys,

    // ===== actions =====
    handleClear,
  }
}