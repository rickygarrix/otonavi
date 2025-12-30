"use client"

import { useCallback } from "react"
import AreaSelector from "@/components/filters/selectors/AreaSelector"
import GenericSelector from "@/components/filters/selectors/GenericSelector"
import DrinkSelector from "@/components/filters/selectors/DrinkSelector"

type Props = {
  clearKey: number
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

  return (
    <>
      {/* エリア */}
      <section
        ref={(el) => { sectionRefs.current["エリア"] = el }}
        className="mt-10 px-4 scroll-mt-[90px]"
      >
        <h2 className="mb-4 text-lg font-bold pb-2">エリア</h2>
        <AreaSelector clearKey={clearKey} onChange={handleAreaChange} />
      </section>

      {/* 客層 */}
      <section
        ref={(el) => { sectionRefs.current["客層"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="客層"
          table="customer_definitions"
          selection="multi"
          columns={2}
          clearKey={clearKey}
          onChange={setCustomerKeys!}
        />
      </section>

      {/* 雰囲気 */}
      <section
        ref={(el) => { sectionRefs.current["雰囲気"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="雰囲気"
          table="atmosphere_definitions"
          selection="multi"
          columns={3}
          clearKey={clearKey}
          onChange={setAtmosphereKeys!}
        />
      </section>

      {/* 広さ */}
      <section
        ref={(el) => { sectionRefs.current["広さ"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="広さ"
          table="size_definitions"
          selection="multi"
          columns={3}
          clearKey={clearKey}
          onChange={setSizeKey!}
        />
      </section>

      {/* ドリンク */}
      {setDrinkKeys && (
        <section
          ref={(el) => { sectionRefs.current["ドリンク"] = el }}
          className="mt-14 px-4 scroll-mt-[90px]"
        >
          <DrinkSelector
            title="ドリンク"
            clearKey={clearKey}
            onChange={setDrinkKeys}
          />
        </section>
      )}

      {/* 価格帯 */}
      <section
        ref={(el) => { sectionRefs.current["価格帯"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="価格帯"
          table="price_range_definitions"
          selection="multi"
          columns={3}
          clearKey={clearKey}
          onChange={setPriceRangeKeys!}
        />
      </section>

      {/* 支払い方法 */}
      <section
        ref={(el) => { sectionRefs.current["支払い方法"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="支払い方法"
          table="payment_method_definitions"
          selection="multi"
          columns={3}
          clearKey={clearKey}
          onChange={setPaymentMethodKeys!}
        />
      </section>

      {/* イベントの傾向 */}
      <section
        ref={(el) => { sectionRefs.current["イベントの傾向"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="イベントの傾向"
          table="event_trend_definitions"
          selection="multi"
          columns={3}
          clearKey={clearKey}
          onChange={setEventTrendKeys!}
        />
      </section>

      {/* 荷物預かり */}
      <section
        ref={(el) => { sectionRefs.current["荷物預かり"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="荷物預かり"
          table="baggage_definitions"
          selection="multi"
          columns={2}
          clearKey={clearKey}
          onChange={setBaggageKeys!}
        />
      </section>

      {/* 喫煙 */}
      <section
        ref={(el) => { sectionRefs.current["喫煙"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="喫煙"
          table="smoking_definitions"
          selection="multi"
          columns={2}
          clearKey={clearKey}
          onChange={setSmokingKeys!}
        />
      </section>

      {/* トイレ */}
      <section
        ref={(el) => { sectionRefs.current["トイレ"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="トイレ"
          table="toilet_definitions"
          selection="multi"
          columns={2}
          clearKey={clearKey}
          onChange={setToiletKeys!}
        />
      </section>

      {/* 周辺環境 */}
      <section
        ref={(el) => { sectionRefs.current["周辺環境"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="周辺環境"
          table="environment_definitions"
          selection="multi"
          columns={3}
          clearKey={clearKey}
          onChange={setEnvironmentKeys!}
        />
      </section>

      {/* その他 */}
      <section
        ref={(el) => { sectionRefs.current["その他"] = el }}
        className="mt-14 px-4 scroll-mt-[90px]"
      >
        <GenericSelector
          title="その他"
          table="other_definitions"
          selection="multi"
          columns={2}
          clearKey={clearKey}
          onChange={setOtherKeys!}
        />
      </section>
    </>
  )
}