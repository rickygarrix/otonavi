"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { HomeStore } from "@/types/store"

import Footer from "@/components/Footer"
import BackToHomeButton from "@/components/ui/BackToHomeButton"

import StoreImageCarousel from "@/components/store/StoreImageCarousel"
import StoreBasicInfo from "@/components/store/StoreBasicInfo"
import StoreAccess from "@/components/store/StoreAccess"
import StoreOpenHours from "@/components/store/StoreOpenHours"
import StoreDetailSections from "@/components/store/StoreDetailSections"
import StoreDetailMedia from "./StoreDetailMedia"

// =====================
// utils
// =====================
const join = (v?: string[]) => (v?.length ? v.join("、") : null)

// =====================
// UI types（ここが超重要）
// =====================
export type DetailRow = [label: string, value: string | null]

export type Section = {
  title: string
  items: DetailRow[]
}

// =====================
// component
// =====================
type Props = { store: HomeStore }

export default function StoreDetailView({ store }: Props) {
  const router = useRouter()
  const query = useSearchParams().toString()

  // =====================
  // UI用セクション構築
  // =====================
  const detailSections: Section[] = [
    {
      title: "店舗情報",
      items: [
        ["店舗タイプ", store.type_label],
        ["イベントの傾向", join(store.event_trend_labels)],
        ["ルール／マナー", join(store.rule_labels)],
      ],
    },
    {
      title: "設備",
      items: [
        ["荷物預かり", join(store.baggage_labels)],
        ["セキュリティ", join(store.security_labels)],
        ["トイレ", join(store.toilet_labels)],
        ["広さ", store.size_label],
        ["フロア", join(store.floor_labels)],
        ["座席タイプ", join(store.seat_type_labels)],
        ["喫煙", join(store.smoking_labels)],
        ["周辺環境", join(store.environment_labels)],
        ["その他", join(store.other_labels)],
      ],
    },
    {
      title: "料金体系",
      items: [
        ["価格帯", store.price_range_label],
        ["料金システム", join(store.pricing_system_labels)],
        ["ディスカウント", join(store.discount_labels)],
        ["VIP", join(store.vip_labels)],
        ["支払い方法", join(store.payment_method_labels)],
      ],
    },
    {
      title: "音響・照明",
      items: [
        ["音響", join(store.sound_labels)],
        ["照明", join(store.lighting_labels)],
        ["演出", join(store.production_labels)],
      ],
    },
    {
      title: "客層・雰囲気",
      items: [
        ["客層", join(store.customer_labels)],
        ["雰囲気", join(store.atmosphere_labels)],
        ["接客", store.hospitality_label],
      ],
    },
  ]

  return (
    <div className="bg-white">
      <StoreImageCarousel
        storeId={store.id}
        storeName={store.name}
      />
      <StoreBasicInfo store={store} />
      <StoreAccess store={store} />
      <StoreOpenHours
        openHours={store.open_hours}
        specialHours={store.special_hours}
      />
      <StoreDetailMedia
        awards={(store as any).store_awards}
        mediaMentions={(store as any).store_media_mentions}
      />
      <StoreDetailSections sections={detailSections} />

      <BackToHomeButton
        onClick={() =>
          router.push(query ? `/stores?${query}` : "/stores")
        }
        className="px-4 mt-8"
      />
      <Footer />
      <div className="h-12" />
    </div>
  )
}