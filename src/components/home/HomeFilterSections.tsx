"use client"

import { useCallback } from "react"
import AreaSelector from "@/components/filters/AreaSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"

// ==============================
// 型
// ==============================
type GenericConfig = {
  title: string
  table: string
  section: string
  onChange?: (v: string[]) => void
}

type Props = {
  clearKey: number

  // エリア
  setPrefectureIds: (v: string[]) => void
  setAreaIds: (v: string[]) => void

  // 軽量フィルタ（optional）
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
  setOtherKeys?: (v: string[]) => void
}

// ==============================
// Component
// ==============================
export default function HomeFilterSections({
  clearKey,

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
  setOtherKeys,
}: Props) {
  // ============================
  // エリア
  // ============================
  const handleAreaChange = useCallback(
    (prefIds: string[], areaIds: string[]) => {
      setPrefectureIds(prefIds)
      setAreaIds(areaIds)
    },
    [setPrefectureIds, setAreaIds]
  )

  // ============================
  // 表示項目（順番がすべて）
  // ============================
  const ITEMS: GenericConfig[] = [
    { title: "客層", table: "customer_definitions", section: "客層", onChange: setCustomerKeys },
    { title: "雰囲気", table: "atmosphere_definitions", section: "雰囲気", onChange: setAtmosphereKeys },
    { title: "広さ", table: "size_definitions", section: "広さ", onChange: setSizeKey },
    { title: "価格帯", table: "price_range_definitions", section: "価格帯", onChange: setPriceRangeKeys },
    { title: "支払い方法", table: "payment_method_definitions", section: "支払い方法", onChange: setPaymentMethodKeys },
    { title: "イベントの傾向", table: "event_trend_definitions", section: "イベントの傾向", onChange: setEventTrendKeys },
    { title: "荷物預かり", table: "baggage_definitions", section: "荷物預かり", onChange: setBaggageKeys },
    { title: "喫煙", table: "smoking_definitions", section: "喫煙", onChange: setSmokingKeys },
    { title: "トイレ", table: "toilet_definitions", section: "トイレ", onChange: setToiletKeys },
    { title: "その他", table: "other_definitions", section: "その他", onChange: setOtherKeys },
  ].filter((item) => item.onChange)

  return (
    <>
      {/* ================= エリア ================= */}
      <section className="mt-10 px-4">
        <h2 className="mb-4 text-lg font-bold border-b pb-2">
          エリア
        </h2>

        <AreaSelector
          clearKey={clearKey}
          onChange={handleAreaChange}
        />
      </section>

      {/* ================= ドリンク ================= */}
      {setDrinkKeys && (
        <section className="mt-14 px-4">
          <h2 className="mb-4 text-lg font-bold border-b pb-2">
            ドリンク
          </h2>

          <DrinkSelector
            clearKey={clearKey}
            title="ドリンク"
            onChange={setDrinkKeys}
          />
        </section>
      )}

      {/* ================= 軽量フィルタ ================= */}
      {ITEMS.map((item) => (
        <section key={item.table} className="mt-14 px-4">
          <GenericSelector
            title={item.title}
            table={item.table}
            selection="multi"
            onChange={item.onChange!}
            clearKey={clearKey}
          />
        </section>
      ))}
    </>
  )
}