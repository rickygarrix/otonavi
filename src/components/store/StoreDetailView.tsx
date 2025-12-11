"use client"

import { useEffect, useState } from "react"
import type { HomeStore } from "@/types/store"
import { supabase } from "@/lib/supabase"
import Footer from "@/components/Footer"
import BackToHomeButton from "@/components/ui/BackToHomeButton"
import { useRouter, useSearchParams } from "next/navigation"

type StoreImage = {
  id: string
  image_url: string
  order_num: number
  caption: string | null
}

const DAY_LABEL: Record<string | number, string> = {
  1: "月曜",
  2: "火曜",
  3: "水曜",
  4: "木曜",
  5: "金曜",
  6: "土曜",
  7: "日曜",
  mon: "月曜",
  tue: "火曜",
  wed: "水曜",
  thu: "木曜",
  fri: "金曜",
  sat: "土曜",
  sun: "日曜",
}

const formatTime = (t: string | null) => (t ? t.slice(0, 5) : "")

function DetailItem({ label, value }: { label: string; value: string | null }) {
  const hasValue = value && value.trim() !== ""
  return (
    <div className="flex justify-between py-2 border-b border-slate-100">
      <span className={`font-semibold ${hasValue ? "text-slate-900" : "text-slate-400"}`}>
        {label}
      </span>
      <span className={`text-sm text-right ${hasValue ? "text-slate-800" : "text-slate-400"}`}>
        {hasValue ? value : "—"}
      </span>
    </div>
  )
}

const toJoined = (labels?: string[], keys?: string[]) => {
  if (labels?.length) return labels.join("、")
  if (keys?.length) return keys.join("、")
  return null
}

type Props = { store: HomeStore }

export default function StoreDetailView({ store }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  const [images, setImages] = useState<StoreImage[]>([])
  const [current, setCurrent] = useState(0)

  // ================ 画像取得 ================
  useEffect(() => {
    if (!store?.id) return

    const load = async () => {
      const { data } = await supabase
        .from("store_images")
        .select("*")
        .eq("store_id", store.id)
        .order("order_num")

      setImages(data ?? [])
      setCurrent(0)
    }

    load()
  }, [store?.id])

  const validImages = images.filter((img) => img.image_url?.trim())
  const mainImages =
    validImages.length > 0
      ? validImages
      : [
        {
          id: "default",
          image_url: "/noshop.svg",
          order_num: 1,
          caption: null,
        },
      ]

  // ================ 特別営業時間 展開 ================
  const specialList: Array<{
    date: string
    dow: number
    open_time: string | null
    close_time: string | null
    last_order_time: string | null
    is_closed: boolean
    reason: string | null
  }> = []

  if (store?.special_hours?.length) {
    for (const sp of store.special_hours) {
      const start = new Date(sp.start_date)
      const end = new Date(sp.end_date)
      const cursor = new Date(start)

      while (cursor <= end) {
        const jsDay = cursor.getDay()
        const dow = jsDay === 0 ? 7 : jsDay

        specialList.push({
          date: `${cursor.getFullYear()}/${cursor.getMonth() + 1}/${cursor.getDate()}`,
          dow,
          open_time: sp.open_time,
          close_time: sp.close_time,
          last_order_time: sp.last_order_time,
          is_closed: sp.is_closed,
          reason: sp.reason ?? null,
        })

        cursor.setDate(cursor.getDate() + 1)
      }
    }
  }

  // ================ SNSリンク ================
  const socialLinks = [
    { key: "instagram_url", icon: "/instagram.svg" },
    { key: "x_url", icon: "/x.svg" },
    { key: "facebook_url", icon: "/facebook.svg" },
    { key: "tiktok_url", icon: "/tiktok.svg" },
    { key: "official_site_url", icon: "/website.svg" },
  ]

  return (
    <div className="bg-white">

      {/* ================ 画像スライダー ================ */}
      <div className="relative w-full">
        <div
          className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-none"
          onScroll={(e) => {
            const left = (e.target as HTMLDivElement).scrollLeft
            const width = (e.target as HTMLDivElement).clientWidth
            setCurrent(Math.round(left / width))
          }}
        >
          {mainImages.map((img) => (
            <div key={img.id} className="min-w-full snap-center">
              <img src={img.image_url} alt={store.name} className="w-full h-72 object-cover bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          {mainImages.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${idx === current ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {/* ================ 基本情報 ================ */}
      <div className="px-4 py-5">
        <p className="text-slate-600 text-sm">
          {store.prefecture_label} {store.area_label}　{store.type_label}
        </p>

        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{store.name}</h1>

        {store.name_kana && (
          <p className="text-slate-500 text-sm mt-1">{store.name_kana}</p>
        )}

        {store.description && (
          <p className="mt-4 text-slate-700 whitespace-pre-line">{store.description}</p>
        )}

        <div className="flex gap-5 mt-6">
          {socialLinks.map(({ key, icon }) => {
            const url = (store as any)[key]
            if (!url) return null

            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={icon}
                  alt={key}
                  className="w-7 h-7 opacity-80 hover:opacity-100 transition"
                />
              </a>
            )
          })}
        </div>
      </div>

      {/* ================ アクセス ================ */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-3">アクセス</h2>

        {store.access && <p className="text-slate-700 whitespace-pre-line mb-4">{store.access}</p>}
        {store.address && <p className="text-slate-700 whitespace-pre-line">{store.address}</p>}
      </div>

      {/* ================ 営業時間 ================ */}
      <div className="px-4 mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">営業時間</h2>

        {store.open_hours?.map((h) => (
          <div key={h.day_of_week} className="flex gap-4 text-slate-700 py-1">
            <div className="w-10 font-medium shrink-0">{DAY_LABEL[h.day_of_week]}</div>

            <div className="flex-1">
              {h.is_closed ? (
                <span className="text-slate-500">定休日</span>
              ) : (
                <span>
                  {formatTime(h.open_time)}〜{formatTime(h.close_time)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================ 祝日営業 ================ */}
      <div className="px-4 mt-8">
        <h3 className="text-lg font-bold text-slate-900">祝日営業</h3>

        {specialList.length === 0 ? (
          <p className="text-slate-500 mt-1">特別営業はありません</p>
        ) : (
          specialList.map((sp, i) => (
            <div key={i} className="py-2 text-slate-800">
              <div className="font-medium">
                {sp.date}（{DAY_LABEL[sp.dow]}）
              </div>

              {sp.is_closed ? (
                <div className="text-slate-500">休業</div>
              ) : (
                <div>
                  {formatTime(sp.open_time)}〜{formatTime(sp.close_time)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================ 特徴 ================ */}
      <div className="px-4 mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">この店舗の特徴</h2>

        <DetailItem label="店舗タイプ" value={store.type_label ?? null} />

        <DetailItem label="イベントの傾向" value={toJoined(store.event_trend_labels, store.event_trend_keys)} />
        <DetailItem label="ルール／マナー" value={toJoined(store.rule_labels, store.rule_keys)} />
        <DetailItem label="荷物預かり" value={toJoined(store.baggage_labels, store.baggage_keys)} />
        <DetailItem label="セキュリティ" value={toJoined(store.security_labels, store.security_keys)} />
        <DetailItem label="トイレ" value={toJoined(store.toilet_labels, store.toilet_keys)} />
        <DetailItem label="広さ" value={store.size_label ?? store.size_key ?? null} />
        <DetailItem label="フロア" value={toJoined(store.floor_labels, store.floor_keys)} />
        <DetailItem label="座席タイプ" value={toJoined(store.seat_type_labels, store.seat_type_keys)} />
        <DetailItem label="喫煙" value={toJoined(store.smoking_labels, store.smoking_keys)} />
        <DetailItem label="周辺環境" value={toJoined(store.environment_labels, store.environment_keys)} />
        <DetailItem label="価格帯" value={store.price_range_label ?? null} />
        <DetailItem label="料金システム" value={toJoined(store.pricing_system_labels, store.pricing_system_keys)} />
        <DetailItem label="ディスカウント" value={toJoined(store.discount_labels, store.discount_keys)} />
        <DetailItem label="VIP" value={toJoined(store.vip_labels, store.vip_keys)} />
        <DetailItem label="支払い方法" value={toJoined(store.payment_method_labels, store.payment_method_keys)} />
        <DetailItem label="音響" value={toJoined(store.sound_labels, store.sound_keys)} />
        <DetailItem label="照明" value={toJoined(store.lighting_labels, store.lighting_keys)} />
        <DetailItem label="演出" value={toJoined(store.production_labels, store.production_keys)} />
        <DetailItem label="フード" value={toJoined(store.food_labels, store.food_keys)} />
        <DetailItem label="サービス" value={toJoined(store.service_labels, store.service_keys)} />
      </div>

      {/* ================ 戻るボタン（storesへクエリ保持で戻る） ================ */}
      <BackToHomeButton
        onClick={() => {
          if (query) router.push(`/stores?${query}`)
          else router.push("/stores")
        }}
        className="px-4 mt-8"
      />

      <div className="py-12" />

      <Footer />
    </div>
  )
}