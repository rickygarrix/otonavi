"use client"

import { useCallback } from "react"
import AreaSelector from "@/components/filters/AreaSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"

type GenericConfig = {
  title: string
  table: string
  section: string
  columns?: 2 | 3
  onChange?: (v: string[]) => void
}

type Props = {
  clearKey: number

  // ✅ HTMLElement に統一
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>

  setPrefectureIds: (v: string[]) => void
  setAreaIds: (v: string[]) => void

  setCustomerKeys?: (v: string[]) => void
  setAtmosphereKeys?: (v: string[]) => void
  setSizeKey?: (v: string[]) => void
  setDrinkKeys?: (v: string[]) => void
  setPriceRangeKeys?: (v: string[]) => void
  setPaymentMethodKeys?: (v: string[]) => void
  setEventTrendKeys?: (v: string[]) => void
  setBaggageKeys?: (v: string[]) => void
  setSmokingKeys?: (v: string[]) => void
  setToiletKeys?: (v: string[]) => void
  setEnvironmentKeys?: (v: string[]) => void
  setOtherKeys?: (v: string[]) => void
}

export default function HomeFilterSections({
  clearKey,
  sectionRefs,

  setPrefectureIds,
  setAreaIds,

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
}: Props) {
  const handleAreaChange = useCallback(
    (prefIds: string[], areaIds: string[]) => {
      setPrefectureIds(prefIds)
      setAreaIds(areaIds)
    },
    [setPrefectureIds, setAreaIds]
  )

  const ITEMS = [
    { title: "客層", table: "customer_definitions", section: "客層", columns: 2, onChange: setCustomerKeys },
    { title: "雰囲気", table: "atmosphere_definitions", section: "雰囲気", columns: 3, onChange: setAtmosphereKeys },
    { title: "広さ", table: "size_definitions", section: "広さ", columns: 3, onChange: setSizeKey },
    { title: "価格帯", table: "price_range_definitions", section: "価格帯", columns: 3, onChange: setPriceRangeKeys },
    { title: "支払い方法", table: "payment_method_definitions", section: "支払い方法", columns: 3, onChange: setPaymentMethodKeys },
    { title: "イベントの傾向", table: "event_trend_definitions", section: "イベントの傾向", columns: 3, onChange: setEventTrendKeys },
    { title: "荷物預かり", table: "baggage_definitions", section: "荷物預かり", columns: 2, onChange: setBaggageKeys },
    { title: "喫煙", table: "smoking_definitions", section: "喫煙", columns: 2, onChange: setSmokingKeys },
    { title: "トイレ", table: "toilet_definitions", section: "トイレ", columns: 2, onChange: setToiletKeys },
    { title: "周辺環境", table: "environment_definitions", section: "周辺環境", columns: 3, onChange: setEnvironmentKeys },
    { title: "その他", table: "other_definitions", section: "その他", columns: 2, onChange: setOtherKeys },
  ] satisfies GenericConfig[]

  return (
    <>
      <section
        ref={(el) => { sectionRefs.current["エリア"] = el }}
        className="mt-10 px-4 scroll-mt-[90px]"
      >
        <h2 className="mb-4 text-lg font-bold border-b pb-2">エリア</h2>
        <AreaSelector clearKey={clearKey} onChange={handleAreaChange} />
      </section>

      {setDrinkKeys && (
        <section
          ref={(el) => { sectionRefs.current["ドリンク"] = el }}
          className="mt-14 px-4 scroll-mt-[90px]"
        >
          <DrinkSelector clearKey={clearKey} title="ドリンク" onChange={setDrinkKeys} />
        </section>
      )}

      {ITEMS.map((item) => (
        <section
          key={item.table}
          ref={(el) => { sectionRefs.current[item.section] = el }}
          className="mt-14 px-4 scroll-mt-[90px]"
        >
          <GenericSelector
            title={item.title}
            table={item.table}
            selection="multi"
            onChange={item.onChange!}
            clearKey={clearKey}
            columns={item.columns}
          />
        </section>
      ))}
    </>
  )
}