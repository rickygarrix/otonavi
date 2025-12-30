"use client"

import { useMemo } from "react"
import type {
  StoreAward,
  StoreMediaMention,
} from "@/types/store"

type Props = {
  awards?: StoreAward[] | null
  mediaMentions?: StoreMediaMention[] | null
}

type AchievementItem = {
  id: string
  text: string
}

export default function StoreDetailMedia({
  awards,
  mediaMentions,
}: Props) {
  const grouped = useMemo(() => {
    const map = new Map<number, AchievementItem[]>()

    awards?.forEach((a) => {
      if (!a.year) return
      if (!map.has(a.year)) map.set(a.year, [])
      map.get(a.year)!.push({
        id: `award-${a.id}`,
        text: a.title,
      })
    })

    mediaMentions?.forEach((m) => {
      if (!m.year) return
      if (!map.has(m.year)) map.set(m.year, [])
      map.get(m.year)!.push({
        id: `media-${m.id}`,
        text: m.media_name,
      })
    })

    return map
  }, [awards, mediaMentions])

  if (grouped.size === 0) return null

  const years = Array.from(grouped.keys()).sort((a, b) => b - a)

  return (
    <section className="px-4 mt-10">
      <h2 className="text-lg font-bold mb-6">
        受賞歴 / メディア掲載
      </h2>

      <div className="space-y-6">
        {years.map((year) => (
          <div key={year}>
            <div className="text-sm font-semibold text-slate-500 mb-2">
              {year}
            </div>

            <ul className="space-y-2">
              {grouped.get(year)!.map((item) => (
                <li
                  key={item.id}
                  className="text-sm text-slate-700"
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}