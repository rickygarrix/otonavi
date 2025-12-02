"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import type { HomeStore } from "@/types/store"
import { supabase } from "@/lib/supabase"

// ===============================
// 画像型
// ===============================
type StoreImage = {
  id: string
  image_url: string
  order_num: number
  caption: string | null
}

// ===============================
// 営業日ラベル
// ===============================
const DAY_LABEL: Record<string, string> = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
  sun: "日",
}

const formatTime = (t: string | null) => (t ? t.slice(0, 5) : "")

// ===============================
// 1行の表示コンポーネント（黒/グレー）
// ===============================
function DetailItem({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  const hasValue = value && value.trim() !== ""

  return (
    <div className="flex justify-between py-2">
      <span
        className={`font-semibold ${hasValue ? "text-slate-900" : "text-slate-400"
          }`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${hasValue ? "text-slate-800" : "text-slate-400"
          }`}
      >
        {hasValue ? value : "—"}
      </span>
    </div>
  )
}

type Props = {
  store: HomeStore | null
  isOpen: boolean
  onClose: () => void
  onCloseAll: () => void
}

export default function StoreDetailPanel({
  store,
  isOpen,
  onClose,
  onCloseAll,
}: Props) {
  const [images, setImages] = useState<StoreImage[]>([])
  const [current, setCurrent] = useState(0)

  // ===============================
  // 店舗画像取得
  // ===============================
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

  const mainImages =
    images.length > 0
      ? images
      : [
        {
          id: "default",
          image_url: "/default_shop.svg",
          order_num: 1,
          caption: null,
        },
      ]

  // ===============================
  // key → label の変換関数
  // （今は key をそのまま表示、あとで label に差し替え可）
  // ===============================
  const toLabelList = (keys: string[]) =>
    keys.length > 0 ? keys.join("、") : null

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full max-w-[480px]
        bg-white z-[70] shadow-xl transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        flex flex-col
      `}
    >
      {store && (
        <div className="overflow-y-auto">
          {/* =============================== */}
          {/* ヘッダー + 画像 */}
          {/* =============================== */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-4 bg-gradient-to-b from-black/70 to-transparent">
              <button onClick={onClose}>
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="text-white font-semibold text-lg truncate">
                {store.name}
              </div>
            </div>

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
                  <img
                    src={img.image_url}
                    alt={store.name}
                    className="w-full h-72 object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
              {mainImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === current ? "bg-white" : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* =============================== */}
          {/* 基本情報 */}
          {/* =============================== */}
          <div className="px-4 py-5">
            <p className="text-slate-600 text-sm">
              {store.prefecture} {store.area} ・ {store.type}
            </p>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {store.name}
            </h2>

            {store.name_kana && (
              <p className="text-slate-500 text-sm mt-1">
                {store.name_kana}
              </p>
            )}

            {store.description && (
              <p className="mt-4 text-slate-700 whitespace-pre-line">
                {store.description}
              </p>
            )}

            {/* =============================== */}
            {/* SNSリンク */}
            {/* =============================== */}
            <div className="mt-6 flex items-center justify-center gap-6">
              {store.official_site_url && (
                <a href={store.official_site_url} target="_blank">
                  <img src="/website.svg" className="w-7 h-7" />
                </a>
              )}
              {store.instagram_url && (
                <a href={store.instagram_url} target="_blank">
                  <img src="/Instagram.svg" className="w-9 h-9" />
                </a>
              )}
              {store.x_url && (
                <a href={store.x_url} target="_blank">
                  <img src="/x.svg" className="w-6 h-6" />
                </a>
              )}
              {store.facebook_url && (
                <a href={store.facebook_url} target="_blank">
                  <img src="/Facebook.jpg" className="w-7 h-7 rounded" />
                </a>
              )}
              {store.tiktok_url && (
                <a href={store.tiktok_url} target="_blank">
                  <img src="/TikTok.svg" className="w-6 h-6" />
                </a>
              )}
            </div>

            {/* =============================== */}
            {/* アクセス */}
            {/* =============================== */}
            <div className="px-4 py-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                アクセス
              </h3>

              {store.access && (
                <p className="text-slate-700 whitespace-pre-line mb-4">
                  {store.access}
                </p>
              )}

              {store.google_map_url && (
                <a href={store.google_map_url} target="_blank">
                  <img
                    src={store.google_map_url}
                    className="w-full rounded-xl mb-4"
                  />
                </a>
              )}

              {store.address && (
                <p className="text-slate-700 whitespace-pre-line">
                  {store.address}
                </p>
              )}
            </div>

            {/* =============================== */}
            {/* 営業時間 */}
            {/* =============================== */}
            <div className="px-4 mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                営業時間
              </h2>

              {store.open_hours?.map((h) => (
                <div
                  key={h.day_of_week}
                  className="flex gap-4 text-slate-700"
                >
                  <div className="w-10 font-medium">
                    {DAY_LABEL[h.day_of_week]}
                  </div>
                  {h.is_closed ? (
                    <div className="text-slate-500">定休日</div>
                  ) : (
                    <div>
                      {formatTime(h.open_time)}〜
                      {formatTime(h.close_time)}
                      {h.last_order_time && (
                        <span className="text-slate-500 ml-2">
                          (LO {formatTime(h.last_order_time)})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* =============================== */}
            {/* 🔍 ここにフィルター条件 */}
            {/* =============================== */}
            <div className="px-4 mt-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                この店舗の特徴
              </h2>

              {/* 店舗タイプ */}
              <DetailItem label="店舗タイプ" value={store.type} />

              <DetailItem
                label="イベントの傾向"
                value={toLabelList(store.event_trend_keys)}
              />

              <DetailItem
                label="ルール／マナー"
                value={toLabelList(store.rule_keys)}
              />

              <DetailItem
                label="荷物預かり"
                value={toLabelList(store.baggage_keys)}
              />

              <DetailItem
                label="セキュリティ"
                value={toLabelList(store.security_keys)}
              />

              <DetailItem
                label="トイレ"
                value={toLabelList(store.toilet_keys)}
              />

              <DetailItem label="広さ" value={store.size_key} />

              <DetailItem
                label="フロアの位置"
                value={toLabelList(store.floor_keys)}
              />

              <DetailItem
                label="座席タイプ"
                value={toLabelList(store.seat_type_keys)}
              />

              <DetailItem
                label="喫煙"
                value={toLabelList(store.smoking_keys)}
              />

              <DetailItem
                label="周辺環境"
                value={toLabelList(store.environment_keys)}
              />

              {/* 料金系 */}
              <DetailItem
                label="価格帯"
                value={store.price_range_label}
              />
              <DetailItem
                label="料金システム"
                value={toLabelList(store.pricing_system_keys)}
              />
              <DetailItem
                label="ディスカウント"
                value={toLabelList(store.discount_keys)}
              />
              <DetailItem
                label="VIP"
                value={toLabelList(store.vip_keys)}
              />
              <DetailItem
                label="支払い方法"
                value={toLabelList(store.payment_method_keys)}
              />

              {/* 音響・照明 */}
              <DetailItem
                label="音響"
                value={toLabelList(store.sound_keys)}
              />
              <DetailItem
                label="照明"
                value={toLabelList(store.lighting_keys)}
              />
              <DetailItem
                label="演出"
                value={toLabelList(store.production_keys)}
              />

              {/* 飲食 */}
              <DetailItem
                label="ドリンク"
                value={toLabelList(store.drink_keys)}
              />
              <DetailItem
                label="フード"
                value={toLabelList(store.food_keys)}
              />
              <DetailItem
                label="サービス"
                value={toLabelList(store.service_keys)}
              />

              {/* 客層・雰囲気 */}
              <DetailItem
                label="客層"
                value={toLabelList(store.customer_keys)}
              />
              <DetailItem
                label="雰囲気"
                value={toLabelList(store.atmosphere_keys)}
              />
              <DetailItem
                label="接客"
                value={store.hospitality_label}
              />
            </div>

            {/* =============================== */}
            {/* 🔍 別の条件で探す */}
            {/* =============================== */}
            <div className="px-6 py-10">
              <button
                onClick={onCloseAll}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                border border-slate-300 text-slate-700 text-lg font-medium hover:bg-slate-50 transition"
              >
                <span className="text-xl">🔍</span>
                別の条件で探す
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}