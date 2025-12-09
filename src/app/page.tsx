"use client"

import { useRef } from "react"

import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"

import SearchFilter from "@/components/filters/SearchFilter"
import SearchFilterStickyWrapper from "@/components/filters/SearchFilterStickyWrapper"

import AreaSelector from "@/components/filters/AreaSelector"
import AchievementSelector from "@/components/filters/AchievementSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"
import Footer from "@/components/Footer"

import { useHomeStores } from "@/hooks/useHomeStores"
import { useStoreFilters } from "@/hooks/useStoreFilters"

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  const {
    prefecture, setPrefecture,
    area, setArea,
    storeType, setStoreType,

    eventTrendKeys, setEventTrendKeys,
    ruleKeys, setRuleKeys,

    achievementFilter, setAchievementFilter,

    seatTypeKeys, setSeatTypeKeys,
    smokingKeys, setSmokingKeys,
    environmentKeys, setEnvironmentKeys,
    otherKeys, setOtherKeys,
    baggageKeys, setBaggageKeys,
    securityKeys, setSecurityKeys,
    toiletKeys, setToiletKeys,
    floorKeys, setFloorKeys,
    sizeKey, setSizeKey,

    priceRange, setPriceRange,
    pricingSystemKeys, setPricingSystemKeys,
    discountKeys, setDiscountKeys,
    vipKeys, setVipKeys,
    paymentMethodKeys, setPaymentMethodKeys,

    soundKeys, setSoundKeys,
    lightingKeys, setLightingKeys,
    productionKeys, setProductionKeys,

    customerKeys, setCustomerKeys,
    atmosphereKeys, setAtmosphereKeys,
    hospitalityKey, setHospitalityKey,

    foodKeys, setFoodKeys,
    serviceKeys, setServiceKeys,
    drinkKeys, setDrinkKeys,

    filteredStores,
    selectedFilters,
    count,

    isResultOpen,
    isDetailOpen,
    selectedStore,
    handleSearch,
    handleSelectStore,
    handleCloseAll,
    handleClear,
  } = useStoreFilters(stores)

  // ============================
  // ✅ セクションスクロール用 ref
  // ============================
  const storeRef = useRef<HTMLHeadingElement | null>(null)
  const equipmentRef = useRef<HTMLHeadingElement | null>(null)
  const priceRef = useRef<HTMLHeadingElement | null>(null)
  const soundRef = useRef<HTMLHeadingElement | null>(null)
  const drinkRef = useRef<HTMLHeadingElement | null>(null)
  const customerRef = useRef<HTMLHeadingElement | null>(null)

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />

        <div className="mt-[80px]">
          <LogoHero />
        </div>

        <div className="mt-[40px]">
          {!loading && (
            <HomeLatestStores
              stores={stores}
              onSelectStore={handleSelectStore}
            />
          )}
        </div>

        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>

        <div className="h-[160px]" />
      </div>

      {/* ================= SearchFilter Sticky ================= */}
      <SearchFilterStickyWrapper>
        <SearchFilter
          onScrollStore={() => storeRef.current?.scrollIntoView({ behavior: "smooth" })}
          onScrollEquipment={() => equipmentRef.current?.scrollIntoView({ behavior: "smooth" })}
          onScrollPrice={() => priceRef.current?.scrollIntoView({ behavior: "smooth" })}
          onScrollSound={() => soundRef.current?.scrollIntoView({ behavior: "smooth" })}
          onScrollDrink={() => drinkRef.current?.scrollIntoView({ behavior: "smooth" })}
          onScrollCustomer={() => customerRef.current?.scrollIntoView({ behavior: "smooth" })}
        />
      </SearchFilterStickyWrapper>

      {/* ================= 店舗情報 ================= */}
      <h2 ref={storeRef} className="px-6 text-xl font-bold text-slate-800 mb-4 mt-6">
        店舗情報
      </h2>

      {/* ✅ prefecture / area は string | null（uuid）で統一 */}
      <AreaSelector
        onChange={(prefId, areaId) => {
          setPrefecture(prefId)
          setArea(areaId)
        }}
      />

      <GenericSelector title="店舗タイプ" table="store_types" selection="single" onChange={setStoreType} />
      <GenericSelector title="イベントの傾向" table="event_trend_definitions" selection="multi" onChange={setEventTrendKeys} columns={3} />
      <GenericSelector title="ルール / マナー" table="rule_definitions" selection="multi" onChange={setRuleKeys} columns={3} />
      <AchievementSelector onChange={setAchievementFilter} />

      {/* ================= 設備 ================= */}
      <h2 ref={equipmentRef} className="px-6 text-xl font-bold text-slate-800 mb-4 mt-8">
        設備
      </h2>

      <GenericSelector title="荷物預かり" table="baggage_definitions" selection="multi" onChange={setBaggageKeys} columns={3} />
      <GenericSelector title="セキュリティ" table="security_definitions" selection="multi" onChange={setSecurityKeys} columns={3} />
      <GenericSelector title="トイレ" table="toilet_definitions" selection="multi" onChange={setToiletKeys} columns={3} />
      <GenericSelector title="広さ" table="size_definitions" selection="single" onChange={setSizeKey} />
      <GenericSelector title="フロアの位置" table="floor_definitions" selection="multi" onChange={setFloorKeys} columns={3} />
      <GenericSelector title="座席タイプ" table="seat_type_definitions" selection="multi" onChange={setSeatTypeKeys} columns={3} />
      <GenericSelector title="喫煙" table="smoking_definitions" selection="multi" onChange={setSmokingKeys} columns={3} />
      <GenericSelector title="周辺環境" table="environment_definitions" selection="multi" onChange={setEnvironmentKeys} columns={3} />
      <GenericSelector title="その他" table="other_definitions" selection="multi" onChange={setOtherKeys} columns={3} />

      {/* ================= 料金 ================= */}
      <h2 ref={priceRef} className="px-6 text-xl font-bold text-slate-800 mb-4 mt-8">
        料金体系
      </h2>

      <GenericSelector title="価格帯" table="price_range_definitions" selection="single" onChange={setPriceRange} />
      <GenericSelector title="料金システム" table="pricing_system_definitions" selection="multi" onChange={setPricingSystemKeys} columns={3} />
      <GenericSelector title="ディスカウント" table="discount_definitions" selection="multi" onChange={setDiscountKeys} columns={3} />
      <GenericSelector title="VIP" table="vip_definitions" selection="multi" onChange={setVipKeys} columns={3} />
      <GenericSelector title="支払い方法" table="payment_method_definitions" selection="multi" onChange={setPaymentMethodKeys} columns={3} />

      {/* ================= 音響 ================= */}
      <h2 ref={soundRef} className="px-6 text-xl font-bold text-slate-800 mb-4 mt-8">
        音響・照明
      </h2>

      <GenericSelector title="音響" table="sound_definitions" selection="multi" onChange={setSoundKeys} columns={3} />
      <GenericSelector title="照明" table="lighting_definitions" selection="multi" onChange={setLightingKeys} columns={3} />
      <GenericSelector title="演出" table="production_definitions" selection="multi" onChange={setProductionKeys} columns={3} />

      {/* ================= 飲食 ================= */}
      <h2 ref={drinkRef} className="px-6 text-xl font-bold text-slate-800 mb-4 mt-8">
        飲食・サービス
      </h2>

      <DrinkSelector title="ドリンク" onChange={setDrinkKeys} />
      <GenericSelector title="フード" table="food_definitions" selection="multi" onChange={setFoodKeys} columns={3} />
      <GenericSelector title="サービス" table="service_definitions" selection="multi" onChange={setServiceKeys} columns={3} />

      {/* ================= 客層 ================= */}
      <h2 ref={customerRef} className="px-6 text-xl font-bold text-slate-800 mb-4 mt-8">
        客層・雰囲気
      </h2>

      <GenericSelector title="客層" table="customer_definitions" selection="multi" onChange={setCustomerKeys} columns={3} />
      <GenericSelector title="雰囲気" table="atmosphere_definitions" selection="multi" onChange={setAtmosphereKeys} columns={3} />
      <GenericSelector title="接客" table="hospitality_definitions" selection="single" onChange={setHospitalityKey} />

      {/* ================= 検索バー ================= */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      <Footer />

      {/* ================= パネル ================= */}
      <SearchResultPanel
        isOpen={isResultOpen}
        onCloseAll={handleCloseAll}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}
      />

      <StoreDetailPanel
        store={selectedStore}
        isOpen={isDetailOpen}
        onCloseAll={handleCloseAll}
      />

      <div className="h-[50px]" />
    </>
  )
}