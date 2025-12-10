"use client"

import AreaSelector from "@/components/filters/AreaSelector"
import AchievementSelector from "@/components/filters/AchievementSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"
import { RegionKey } from "@/app/page"

type Props = {
  setPrefecture: (v: string | null) => void
  setArea: (v: string | null) => void
  setStoreType: (v: string | null) => void
  setEventTrendKeys: (v: string[]) => void
  setRuleKeys: (v: string[]) => void
  setAchievementFilter: (v: any) => void

  setBaggageKeys: (v: string[]) => void
  setSecurityKeys: (v: string[]) => void
  setToiletKeys: (v: string[]) => void
  setSizeKey: (v: string | null) => void
  setFloorKeys: (v: string[]) => void
  setSeatTypeKeys: (v: string[]) => void
  setSmokingKeys: (v: string[]) => void
  setEnvironmentKeys: (v: string[]) => void
  setOtherKeys: (v: string[]) => void

  setPriceRange: (v: string | null) => void
  setPricingSystemKeys: (v: string[]) => void
  setDiscountKeys: (v: string[]) => void
  setVipKeys: (v: string[]) => void
  setPaymentMethodKeys: (v: string[]) => void

  setSoundKeys: (v: string[]) => void
  setLightingKeys: (v: string[]) => void
  setProductionKeys: (v: string[]) => void

  setDrinkKeys: (v: string[]) => void
  setFoodKeys: (v: string[]) => void
  setServiceKeys: (v: string[]) => void

  setCustomerKeys: (v: string[]) => void
  setAtmosphereKeys: (v: string[]) => void
  setHospitalityKey: (v: string | null) => void

  regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>>
  areaRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  drinkCategoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  achievementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>

  genericSectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}

export default function HomeFilterSections(p: Props) {
  const register = (key: string) => (el: HTMLDivElement | null) => {
    p.genericSectionRefs.current[key] = el
  }

  return (
    <>
      <AreaSelector
        onChange={(prefId, areaId) => {
          p.setPrefecture(prefId)
          p.setArea(areaId)
        }}
        regionRefs={p.regionRefs}
        areaRefs={p.areaRefs}
      />

      {/* ================= 店舗タイプ ================= */}
      <GenericSelector
        title="店舗タイプ"
        table="store_types"
        selection="single"
        onChange={p.setStoreType}
        sectionRef={register("店舗タイプ")}
      />

      {/* ================= イベントの傾向 ================= */}
      <GenericSelector
        title="イベントの傾向"
        table="event_trend_definitions"
        selection="multi"
        onChange={p.setEventTrendKeys}
        columns={3}
        sectionRef={register("イベントの傾向")}
      />

      {/* ================= ルール ================= */}
      <GenericSelector
        title="ルール / マナー"
        table="rule_definitions"
        selection="multi"
        onChange={p.setRuleKeys}
        columns={3}
        sectionRef={register("ルール / マナー")}
      />

      {/* ================= 実績 ================= */}
      <AchievementSelector
        onChange={p.setAchievementFilter}
        achievementRefs={p.achievementRefs}
      />

      {/* ================= 設備 ================= */}
      <GenericSelector
        title="荷物預かり"
        table="baggage_definitions"
        selection="multi"
        onChange={p.setBaggageKeys}
        columns={3}
        sectionRef={register("荷物預かり")}
      />

      <GenericSelector
        title="セキュリティ"
        table="security_definitions"
        selection="multi"
        onChange={p.setSecurityKeys}
        columns={3}
        sectionRef={register("セキュリティ")}
      />

      <GenericSelector
        title="トイレ"
        table="toilet_definitions"
        selection="multi"
        onChange={p.setToiletKeys}
        columns={3}
        sectionRef={register("トイレ")}
      />

      <GenericSelector
        title="広さ"
        table="size_definitions"
        selection="single"
        onChange={p.setSizeKey}
        sectionRef={register("広さ")}
      />

      <GenericSelector
        title="フロアの位置"
        table="floor_definitions"
        selection="multi"
        onChange={p.setFloorKeys}
        columns={3}
        sectionRef={register("フロアの位置")}
      />

      <GenericSelector
        title="座席タイプ"
        table="seat_type_definitions"
        selection="multi"
        onChange={p.setSeatTypeKeys}
        columns={3}
        sectionRef={register("座席タイプ")}
      />

      <GenericSelector
        title="喫煙"
        table="smoking_definitions"
        selection="multi"
        onChange={p.setSmokingKeys}
        columns={3}
        sectionRef={register("喫煙")}
      />

      <GenericSelector
        title="周辺環境"
        table="environment_definitions"
        selection="multi"
        onChange={p.setEnvironmentKeys}
        columns={3}
        sectionRef={register("周辺環境")}
      />

      <GenericSelector
        title="その他"
        table="other_definitions"
        selection="multi"
        onChange={p.setOtherKeys}
        columns={3}
        sectionRef={register("その他")}
      />

      {/* ================= 料金 ================= */}
      <GenericSelector
        title="価格帯"
        table="price_range_definitions"
        selection="single"
        onChange={p.setPriceRange}
        sectionRef={register("価格帯")}
      />

      <GenericSelector
        title="料金システム"
        table="pricing_system_definitions"
        selection="multi"
        onChange={p.setPricingSystemKeys}
        columns={3}
        sectionRef={register("料金システム")}
      />

      <GenericSelector
        title="ディスカウント"
        table="discount_definitions"
        selection="multi"
        onChange={p.setDiscountKeys}
        columns={3}
        sectionRef={register("ディスカウント")}
      />

      <GenericSelector
        title="VIP"
        table="vip_definitions"
        selection="multi"
        onChange={p.setVipKeys}
        columns={3}
        sectionRef={register("VIP")}
      />

      <GenericSelector
        title="支払い方法"
        table="payment_method_definitions"
        selection="multi"
        onChange={p.setPaymentMethodKeys}
        columns={3}
        sectionRef={register("支払い方法")}
      />

      {/* ================= 音響・照明・演出 ================= */}
      <GenericSelector
        title="音響"
        table="sound_definitions"
        selection="multi"
        onChange={p.setSoundKeys}
        columns={3}
        sectionRef={register("音響")}
      />

      <GenericSelector
        title="照明"
        table="lighting_definitions"
        selection="multi"
        onChange={p.setLightingKeys}
        columns={3}
        sectionRef={register("照明")}
      />

      <GenericSelector
        title="演出"
        table="production_definitions"
        selection="multi"
        onChange={p.setProductionKeys}
        columns={3}
        sectionRef={register("演出")}
      />

      {/* ================= 飲食・サービス ================= */}
      <DrinkSelector
        title="ドリンク"
        onChange={p.setDrinkKeys}
        drinkCategoryRefs={p.drinkCategoryRefs}
      />

      <GenericSelector
        title="フード"
        table="food_definitions"
        selection="multi"
        onChange={p.setFoodKeys}
        columns={3}
        sectionRef={register("フード")}
      />

      <GenericSelector
        title="サービス"
        table="service_definitions"
        selection="multi"
        onChange={p.setServiceKeys}
        columns={3}
        sectionRef={register("サービス")}
      />

      {/* ================= 客層・雰囲気 ================= */}
      <GenericSelector
        title="客層"
        table="customer_definitions"
        selection="multi"
        onChange={p.setCustomerKeys}
        columns={3}
        sectionRef={register("客層")}
      />

      <GenericSelector
        title="雰囲気"
        table="atmosphere_definitions"
        selection="multi"
        onChange={p.setAtmosphereKeys}
        columns={3}
        sectionRef={register("雰囲気")}
      />

      <GenericSelector
        title="接客"
        table="hospitality_definitions"
        selection="single"
        onChange={p.setHospitalityKey}
        sectionRef={register("接客")}
      />
    </>
  )
}