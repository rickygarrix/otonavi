'use client';

import { useCallback, useMemo } from 'react';
import AreaSelector from '@/components/selectors/AreaSelector';
import GenericSelector from '@/components/selectors/GenericSelector';

type Props = {
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;

  prefectureKeys: string[];
  cityKeys: string[];
  setPrefectureKeys: (v: string[]) => void;
  setCityKeys: (v: string[]) => void;

  customerKeys: string[];
  atmosphereKeys: string[];
  sizeKeys: string[];
  drinkKeys: string[];
  priceRangeKeys: string[];
  paymentMethodKeys: string[];
  eventTrendKeys: string[];
  baggageKeys: string[];
  smokingKeys: string[];
  toiletKeys: string[];
  environmentKeys: string[];
  otherKeys: string[];

  setCustomerKeys: (v: string[]) => void;
  setAtmosphereKeys: (v: string[]) => void;
  setSizeKeys: (v: string[]) => void;
  setDrinkKeys: (v: string[]) => void;
  setPriceRangeKeys: (v: string[]) => void;
  setPaymentMethodKeys: (v: string[]) => void;
  setEventTrendKeys: (v: string[]) => void;
  setBaggageKeys: (v: string[]) => void;
  setSmokingKeys: (v: string[]) => void;
  setToiletKeys: (v: string[]) => void;
  setEnvironmentKeys: (v: string[]) => void;
  setOtherKeys: (v: string[]) => void;
};

type FilterConfig =
  | {
    key: string;
    type: 'city';
  }
  | {
    key: string;
    type: 'generic' | 'drink';
    table: string;
    columns: 2 | 3;
    value: string[];
    onChange: (v: string[]) => void;
  };

export default function HomeFilterSections(props: Props) {
  const {
    sectionRefs,

    prefectureKeys,
    cityKeys,
    setPrefectureKeys,
    setCityKeys,

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
    environmentKeys,
    otherKeys,

    setCustomerKeys,
    setAtmosphereKeys,
    setSizeKeys,
    setDrinkKeys,
    setPriceRangeKeys,
    setPaymentMethodKeys,
    setEventTrendKeys,
    setBaggageKeys,
    setSmokingKeys,
    setToiletKeys,
    setEnvironmentKeys,
    setOtherKeys,
  } = props;

  const handleCityChange = useCallback(
    (prefKeys: string[], cityKeys: string[]) => {
      setPrefectureKeys(prefKeys);
      setCityKeys(cityKeys);
    },
    [setPrefectureKeys, setCityKeys],
  );

  const FILTERS: FilterConfig[] = useMemo(
    () => [
      { key: 'エリア', type: 'city' },

      {
        key: '客層',
        type: 'generic',
        table: 'audience_types',
        columns: 2,
        value: customerKeys,
        onChange: setCustomerKeys,
      },
      {
        key: '雰囲気',
        type: 'generic',
        table: 'atmospheres',
        columns: 3,
        value: atmosphereKeys,
        onChange: setAtmosphereKeys,
      },
      {
        key: '広さ',
        type: 'generic',
        table: 'sizes',
        columns: 3,
        value: sizeKeys,
        onChange: setSizeKeys,
      },
      {
        key: 'ドリンク',
        type: 'drink',
        table: 'drinks',
        columns: 3,
        value: drinkKeys,
        onChange: setDrinkKeys,
      },
      {
        key: '価格帯',
        type: 'generic',
        table: 'price_ranges',
        columns: 3,
        value: priceRangeKeys,
        onChange: setPriceRangeKeys,
      },
      {
        key: '支払い方法',
        type: 'generic',
        table: 'payment_methods',
        columns: 2,
        value: paymentMethodKeys,
        onChange: setPaymentMethodKeys,
      },
      {
        key: 'イベントの傾向',
        type: 'generic',
        table: 'event_trends',
        columns: 3,
        value: eventTrendKeys,
        onChange: setEventTrendKeys,
      },
      {
        key: '荷物預かり',
        type: 'generic',
        table: 'luggages',
        columns: 2,
        value: baggageKeys,
        onChange: setBaggageKeys,
      },
      {
        key: '喫煙',
        type: 'generic',
        table: 'smoking_policies',
        columns: 3,
        value: smokingKeys,
        onChange: setSmokingKeys,
      },
      {
        key: 'トイレ',
        type: 'generic',
        table: 'toilets',
        columns: 3,
        value: toiletKeys,
        onChange: setToiletKeys,
      },
      {
        key: '周辺環境',
        type: 'generic',
        table: 'environments',
        columns: 2,
        value: environmentKeys,
        onChange: setEnvironmentKeys,
      },
      {
        key: 'その他',
        type: 'generic',
        table: 'amenities',
        columns: 2,
        value: otherKeys,
        onChange: setOtherKeys,
      },
    ],
    [
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
      environmentKeys,
      otherKeys,
    ],
  );

  return (
    <div className="pb-10">
      {FILTERS.map((filter) => (
        <section
          key={filter.key}
          ref={(el) => {
            sectionRefs.current[filter.key] = el;
          }}
          className="flex flex-col gap-4 p-4"
        >
          {filter.type === 'city' && (
            <>
              <h3 className="text-md font-bold tracking-widest text-dark-5">
                エリア
              </h3>
              <AreaSelector
                prefectureKeys={prefectureKeys}
                cityKeys={cityKeys}
                onChange={handleCityChange}
              />
            </>
          )}

          {filter.type !== 'city' && (
            <GenericSelector
              title={filter.key}
              table={filter.table}
              selection="multi"
              value={filter.value}
              columns={filter.columns}
              variant={filter.type === 'drink' ? 'drink' : 'default'}
              onChange={filter.onChange}
            />
          )}
        </section>
      ))}
    </div>
  );
}