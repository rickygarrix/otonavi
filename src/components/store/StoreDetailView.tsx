// StoreDetailView.tsx
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

const join = (v?: string[]) => (v?.length ? v.join("、") : null)
const formatPaymentMethods = (
  labels?: string[],
  otherText?: string | null
) => {
  if (!labels?.length) return null

  const hasOther = labels.includes("その他")
  if (hasOther && otherText) {
    const filtered = labels.filter((l) => l !== "その他")
    return [...filtered, otherText].join("、")
  }
  return labels.join("、")
}

// ---------------------------------
type Props = { store: HomeStore }

export default function StoreDetailView({ store }: Props) {
  const router = useRouter()
  const query = useSearchParams().toString()

  const detailItems: [string, string | null][] = [
    ["客層", join(store.customer_labels)],
    ["雰囲気", join(store.atmosphere_labels)],
    ["広さ", store.size_label],
    ["ドリンク", join(store.drink_labels)],
    ["価格帯", store.price_range_label],
    [
      "支払い方法",
      formatPaymentMethods(
        store.payment_method_labels,
        store.payment_method_other
      ),
    ],
    ["イベントの傾向", join(store.event_trend_labels)],
    ["荷物預かり", join(store.baggage_labels)],
    ["喫煙", join(store.smoking_labels)],
    ["トイレ", join(store.toilet_labels)],
    ["周辺環境", join(store.environment_labels)],
    ["その他", join(store.other_labels)],
  ]

  return (
    <div className="bg-white">
      <StoreImageCarousel storeId={store.id} storeName={store.name} />
      <StoreBasicInfo store={store} />
      <StoreAccess store={store} />
      <StoreOpenHours businessHours={store.business_hours} />

      <StoreDetailMedia
        awards={store.store_awards}
        mediaMentions={store.store_media_mentions}
      />

      <StoreDetailSections items={detailItems} />

      <BackToHomeButton
        onClick={() => router.push(query ? `/stores?${query}` : "/stores")}
        className="px-4 mt-8"
      />
      <Footer />
      <div className="h-12" />
    </div>
  )
}