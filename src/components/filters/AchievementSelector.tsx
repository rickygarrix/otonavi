"use client"

import { useState, useEffect } from "react"
import Chip from "@/components/ui/Chip"

type Props = {
  onChange: (selected: { hasAward: boolean; hasMedia: boolean }) => void
  achievementRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}

export default function AchievementSelector({ onChange, achievementRefs }: Props) {
  const [hasAward, setHasAward] = useState(false)
  const [hasMedia, setHasMedia] = useState(false)

  useEffect(() => {
    onChange({ hasAward, hasMedia })
  }, [hasAward, hasMedia, onChange])

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">実績</h2>

      {/* ⭐ 1行で横並び */}
      <div className="flex gap-3">

        {/* 受賞歴アンカー */}
        <div
          ref={(el) => {
            if (!el || !achievementRefs) return
            achievementRefs.current["受賞歴あり"] = el
          }}
          className="scroll-mt-[90px]"
        />

        <Chip
          label="受賞歴あり"
          selected={hasAward}
          onClick={() => setHasAward(!hasAward)}
        />

        {/* メディアアンカー */}
        <div
          ref={(el) => {
            if (!el || !achievementRefs) return
            achievementRefs.current["メディア掲載あり"] = el
          }}
          className="scroll-mt-[90px]"
        />

        <Chip
          label="メディア掲載あり"
          selected={hasMedia}
          onClick={() => setHasMedia(!hasMedia)}
        />
      </div>
    </div>
  )
}