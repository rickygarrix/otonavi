'use client';

import { useCallback } from 'react';
import AreaSelector from '@/components/selectors/AreaSelector';
import GenericSelector from '@/components/selectors/GenericSelector';
import DrinkSelector from '@/components/selectors/DrinkSelector';

type Props = {
  clearKey: number;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;

  setPrefectureIds: (v: string[]) => void;
  setCityIds: (v: string[]) => void;

  setCustomerKeys?: (v: string[]) => void;
  setAtmosphereKeys?: (v: string[]) => void;
  setSizeKey?: (v: string[]) => void;
  setDrinkKeys?: (v: string[]) => void;
  setPriceRangeKeys?: (v: string[]) => void;
  setPaymentMethodKeys?: (v: string[]) => void;
  setEventTrendKeys?: (v: string[]) => void;
  setBaggageKeys?: (v: string[]) => void;
  setSmokingKeys?: (v: string[]) => void;
  setToiletKeys?: (v: string[]) => void;
  setEnvironmentKeys?: (v: string[]) => void;
  setOtherKeys?: (v: string[]) => void;
};

/* =========================
   設定
========================= */

type FilterConfig =
  | {
      key: string;
      type: 'city';
    }
  | {
      key: string;
      type: 'drink';
      onChange?: (v: string[]) => void;
    }
  | {
      key: string;
      type: 'generic';
      table: string;
      columns: 2 | 3;
      onChange?: (v: string[]) => void;
    };

export default function HomeFilterSections(props: Props) {
  const {
    clearKey,
    sectionRefs,

    setPrefectureIds,
    setCityIds,

    setCustomerKeys,
    setAtmosphereKeys,
    setSizeKey,
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
    (prefIds: string[], cityIds: string[]) => {
      setPrefectureIds(prefIds);
      setCityIds(cityIds);
    },
    [setPrefectureIds, setCityIds],
  );

  const FILTERS: FilterConfig[] = [
    { key: 'エリア', type: 'city' },

    {
      key: '客層',
      type: 'generic',
      table: 'customer_definitions',
      columns: 2,
      onChange: setCustomerKeys,
    },
    {
      key: '雰囲気',
      type: 'generic',
      table: 'atmosphere_definitions',
      columns: 3,
      onChange: setAtmosphereKeys,
    },
    { key: '広さ', type: 'generic', table: 'size_definitions', columns: 3, onChange: setSizeKey },
    { key: 'ドリンク', type: 'drink', onChange: setDrinkKeys },
    {
      key: '価格帯',
      type: 'generic',
      table: 'price_range_definitions',
      columns: 3,
      onChange: setPriceRangeKeys,
    },
    {
      key: '支払い方法',
      type: 'generic',
      table: 'payment_method_definitions',
      columns: 2,
      onChange: setPaymentMethodKeys,
    },
    {
      key: 'イベントの傾向',
      type: 'generic',
      table: 'event_trend_definitions',
      columns: 3,
      onChange: setEventTrendKeys,
    },
    {
      key: '荷物預かり',
      type: 'generic',
      table: 'baggage_definitions',
      columns: 2,
      onChange: setBaggageKeys,
    },
    {
      key: '喫煙',
      type: 'generic',
      table: 'smoking_definitions',
      columns: 3,
      onChange: setSmokingKeys,
    },
    {
      key: 'トイレ',
      type: 'generic',
      table: 'toilet_definitions',
      columns: 3,
      onChange: setToiletKeys,
    },
    {
      key: '周辺環境',
      type: 'generic',
      table: 'environment_definitions',
      columns: 2,
      onChange: setEnvironmentKeys,
    },
    {
      key: 'その他',
      type: 'generic',
      table: 'other_definitions',
      columns: 2,
      onChange: setOtherKeys,
    },
  ];

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
              <h3 className="text-md text-dark-5 leading-[1.5] font-bold tracking-widest">
                エリア
              </h3>
              <AreaSelector clearKey={clearKey} onChange={handleCityChange} />
            </>
          )}

          {filter.type === 'drink' && filter.onChange && (
            <DrinkSelector title={filter.key} clearKey={clearKey} onChange={filter.onChange} />
          )}

          {filter.type === 'generic' && filter.onChange && (
            <GenericSelector
              title={filter.key}
              table={filter.table}
              selection="multi"
              columns={filter.columns}
              clearKey={clearKey}
              onChange={filter.onChange}
            />
          )}
        </section>
      ))}
    </div>
  );
}
