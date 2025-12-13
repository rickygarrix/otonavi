"use client"

// =====================
// Props 用の最小型
// =====================
type Award = {
  id: string
  title: string
  year: number | null
}

type MediaMention = {
  id: string
  media_name: string
  year: number | null
}

type Props = {
  awards?: Award[] | null
  mediaMentions?: MediaMention[] | null
}

// =====================
// UI用内部型
// =====================
type AchievementItem = {
  id: string
  year: number
  text: string
}

export default function StoreDetailMedia({
  awards,
  mediaMentions,
}: Props) {
  const safeAwards = awards ?? []
  const safeMedia = mediaMentions ?? []

  // ---------------------
  // 年ごとにまとめる
  // ---------------------
  const grouped = new Map<number, AchievementItem[]>()

  for (const a of safeAwards) {
    if (!a.year) continue
    if (!grouped.has(a.year)) grouped.set(a.year, [])
    grouped.get(a.year)!.push({
      id: `award-${a.id}`,
      year: a.year,
      text: a.title,
    })
  }

  for (const m of safeMedia) {
    if (!m.year) continue
    if (!grouped.has(m.year)) grouped.set(m.year, [])
    grouped.get(m.year)!.push({
      id: `media-${m.id}`,
      year: m.year,
      text: m.media_name,
    })
  }

  if (grouped.size === 0) return null

  // 年降順
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