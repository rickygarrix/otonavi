'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Options = {
  initialKeys?: string[];
  keyToTableMap?: Map<string, string>;
  cityMap?: Map<string, unknown>;
};

export function useHomeFilterState(
  externalLabelMap?: Map<string, string>,
  options?: Options,
) {
  /* =========================
     options 正規化（★重要）
  ========================= */
  const initialKeys = useMemo(
    () => options?.initialKeys ?? [],
    [options?.initialKeys],
  );

  const keyToTableMap = options?.keyToTableMap;

  // ===== エリア =====
  const [prefectureKeys, setPrefectureKeys] = useState<string[]>([]);
  const [cityKeys, setCityKeys] = useState<string[]>([]);

  // ===== 属性 =====
  const [customerKeys, setCustomerKeys] = useState<string[]>([]);
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([]);
  const [environmentKeys, setEnvironmentKeys] = useState<string[]>([]);
  const [sizeKeys, setSizeKeys] = useState<string[]>([]);
  const [drinkKeys, setDrinkKeys] = useState<string[]>([]);
  const [priceRangeKeys, setPriceRangeKeys] = useState<string[]>([]);
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([]);
  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([]);
  const [baggageKeys, setBaggageKeys] = useState<string[]>([]);
  const [smokingKeys, setSmokingKeys] = useState<string[]>([]);
  const [toiletKeys, setToiletKeys] = useState<string[]>([]);
  const [otherKeys, setOtherKeys] = useState<string[]>([]);

  /* =========================
     URL → state 復元（key完全準拠）
  ========================= */
useEffect(() => {
  if (!keyToTableMap) return;
  if (initialKeys.length === 0) return;

  const byTable: Record<string, string[]> = {
    prefectures: [],
    cities: [],
  };

  initialKeys.forEach((rawKey) => {
    const table = keyToTableMap.get(rawKey);

    // ===== エリア =====
    if (!table) {
      if (options?.cityMap?.has(rawKey)) {
        byTable.cities.push(rawKey);
      } else {
        byTable.prefectures.push(rawKey);
      }
      return;
    }

    // ===== 属性 =====
    const fullKey = `${table}:${rawKey}`;
    if (!byTable[table]) byTable[table] = [];
    byTable[table].push(fullKey);
  });

  setPrefectureKeys(byTable.prefectures);
  setCityKeys(byTable.cities);

  setCustomerKeys(byTable.audience_types ?? []);
  setAtmosphereKeys(byTable.atmospheres ?? []);
  setEnvironmentKeys(byTable.environments ?? []);
  setSizeKeys(byTable.sizes ?? []);
  setDrinkKeys(byTable.drinks ?? []);
  setPriceRangeKeys(byTable.price_ranges ?? []);
  setPaymentMethodKeys(byTable.payment_methods ?? []);
  setEventTrendKeys(byTable.event_trends ?? []);
  setBaggageKeys(byTable.luggages ?? []);
  setSmokingKeys(byTable.smoking_policies ?? []);
  setToiletKeys(byTable.toilets ?? []);
  setOtherKeys(byTable.amenities ?? []);
}, [initialKeys, keyToTableMap, options?.cityMap]);

  /* =========================
     filters 用
  ========================= */
  const selectedKeys = useMemo(
    () => [
      ...prefectureKeys,
      ...cityKeys,
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
    ],
    [
      prefectureKeys,
      cityKeys,
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
    ],
  );

  const selectedLabels = useMemo(
    () => selectedKeys.map((k) => externalLabelMap?.get(k) ?? k),
    [selectedKeys, externalLabelMap],
  );

  const handleClear = useCallback(() => {
    setPrefectureKeys([]);
    setCityKeys([]);
    setCustomerKeys([]);
    setAtmosphereKeys([]);
    setEnvironmentKeys([]);
    setSizeKeys([]);
    setDrinkKeys([]);
    setPriceRangeKeys([]);
    setPaymentMethodKeys([]);
    setEventTrendKeys([]);
    setBaggageKeys([]);
    setSmokingKeys([]);
    setToiletKeys([]);
    setOtherKeys([]);
  }, []);

  return {
    selectedKeys,
    selectedLabels,

    prefectureKeys,
    cityKeys,
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

    setPrefectureKeys,
    setCityKeys,
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

    handleClear,
  };
}