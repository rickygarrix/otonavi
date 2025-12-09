// /components/home/HomeFilterSections.tsx
"use client"

import AreaSelector from "@/components/filters/AreaSelector"
import AchievementSelector from "@/components/filters/AchievementSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"

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
}

export default function HomeFilterSections(props: Props) {
  const p = props

  return (
    <>
      <AreaSelector onChange={(prefId, areaId) => {
        p.setPrefecture(prefId)
        p.setArea(areaId)
      }} />

      <GenericSelector title="店舗タイプ" table="store_types" selection="single" onChange={p.setStoreType} />
      <GenericSelector title="イベントの傾向" table="event_trend_definitions" selection="multi" onChange={p.setEventTrendKeys} columns={3} />
      <GenericSelector title="ルール / マナー" table="rule_definitions" selection="multi" onChange={p.setRuleKeys} columns={3} />
      <AchievementSelector onChange={p.setAchievementFilter} />

      <GenericSelector title="荷物預かり" table="baggage_definitions" selection="multi" onChange={p.setBaggageKeys} columns={3} />
      <GenericSelector title="セキュリティ" table="security_definitions" selection="multi" onChange={p.setSecurityKeys} columns={3} />
      <GenericSelector title="トイレ" table="toilet_definitions" selection="multi" onChange={p.setToiletKeys} columns={3} />
      <GenericSelector title="広さ" table="size_definitions" selection="single" onChange={p.setSizeKey} />

      <DrinkSelector title="ドリンク" onChange={p.setDrinkKeys} />
      <GenericSelector title="フード" table="food_definitions" selection="multi" onChange={p.setFoodKeys} columns={3} />

      <GenericSelector title="客層" table="customer_definitions" selection="multi" onChange={p.setCustomerKeys} columns={3} />
      <GenericSelector title="雰囲気" table="atmosphere_definitions" selection="multi" onChange={p.setAtmosphereKeys} columns={3} />
      <GenericSelector title="接客" table="hospitality_definitions" selection="single" onChange={p.setHospitalityKey} />
    </>
  )
}