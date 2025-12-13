"use client"

import type { HomeStore } from "@/types/store"

// =====================
// utils
// =====================
const DAY_LABEL_NUM: Record<number, string> = {
  1: "月",
  2: "火",
  3: "水",
  4: "木",
  5: "金",
  6: "土",
  7: "日",
}

const formatTime = (t: string | null) => (t ? t.slice(0, 5) : "")

const getDayLabel = (d: number) => DAY_LABEL_NUM[d] ?? ""

// =====================
// component
// =====================
type Props = {
  openHours?: HomeStore["open_hours"]
  specialHours?: HomeStore["special_hours"]
}

export default function StoreOpenHours({
  openHours = [],
  specialHours = [],
}: Props) {
  if (openHours.length === 0 && specialHours.length === 0) return null

  return (
    <div className="px-4 mt-10">
      <h2 className="text-xl font-bold mb-3">営業時間</h2>

      {/* =====================
          通常営業時間
      ===================== */}
      {openHours.length > 0 && (
        <div className="mb-4">
          {openHours.map((h, idx) => (
            <div
              key={`${h.day_of_week}-${idx}`}
              className="flex items-center py-1 text-slate-700"
            >
              <div className="min-w-[2.5rem] text-right font-semibold">
                {getDayLabel(h.day_of_week)}
              </div>

              {h.is_closed ? (
                <span className="ml-4 text-slate-500">定休日</span>
              ) : (
                <span className="ml-4">
                  {formatTime(h.open_time)}〜{formatTime(h.close_time)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* =====================
          特別営業時間
      ===================== */}
      {specialHours.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            特別営業時間
          </h3>

          <ul className="space-y-2 text-sm text-slate-700">
            {specialHours.map((h, idx) => (
              <li key={idx}>
                <div className="font-medium">
                  {h.start_date}
                  {h.end_date && h.end_date !== h.start_date && `〜${h.end_date}`}
                </div>

                {h.is_closed ? (
                  <div className="text-slate-500">休業</div>
                ) : (
                  <div>
                    {formatTime(h.open_time)}〜{formatTime(h.close_time)}
                  </div>
                )}

                {h.reason && (
                  <div className="text-xs text-slate-500">
                    {h.reason}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}