'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Options = {
  initialKeys?: string[];
  keyToTableMap?: Map<string, string>;
};

export function useHomeFilterState(
  externalLabelMap?: Map<string, string>,
  options?: Options,
) {
  const initialKeys = options?.initialKeys ?? [];
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

  /** URL → state 復元（完全版） */
  useEffect(() => {
    if (!initialKeys.length || !keyToTableMap) return;

    // エリア（name ベース）
    setPrefectureKeys(initialKeys.filter((k) => k.endsWith('都') || k.endsWith('県')));
    setCityKeys(initialKeys.filter((k) => k.endsWith('区') || k.endsWith('市')));

    const byTable: Record<string, string[]> = {};

    initialKeys.forEach((k) => {
      const table = keyToTableMap.get(k);
      if (!table) return;

      if (!byTable[table]) byTable[table] = [];
      byTable[table].push(k);
    });

    setCustomerKeys(byTable['audience_types'] ?? []);
    setAtmosphereKeys(byTable['atmospheres'] ?? []);
    setEnvironmentKeys(byTable['environments'] ?? []);
    setSizeKeys(byTable['sizes'] ?? []);
    setDrinkKeys(byTable['drinks'] ?? []);
    setPriceRangeKeys(byTable['price_ranges'] ?? []);
    setPaymentMethodKeys(byTable['payment_methods'] ?? []);
    setEventTrendKeys(byTable['event_trends'] ?? []);
    setBaggageKeys(byTable['luggages'] ?? []);
    setSmokingKeys(byTable['smoking_policies'] ?? []);
    setToiletKeys(byTable['toilets'] ?? []);
    setOtherKeys(byTable['amenities'] ?? []);
  }, [initialKeys, keyToTableMap]);

  /** filters 用 */
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