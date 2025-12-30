"use client"

import { useState, useEffect } from "react"
import Chip from "@/components/ui/Chip"

type Props = {
  onChange: (selected: { hasAward: boolean; hasMedia: boolean }) => void
  achievementRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  clearKey: number
}

export default function AchievementSelector({
  onChange,
  achievementRefs,
  clearKey,
}: Props) {
  const [hasAward, setHasAward] = useState(false)
  const [hasMedia, setHasMedia] = useState(false)

  // ✅ クリア時リセット
  useEffect(() => {
    setHasAward(false)
    setHasMedia(false)
    onChange({ hasAward: false, hasMedia: false })
  }, [clearKey, onChange])

  useEffect(() => {
    onChange({ hasAward, hasMedia })
  }, [hasAward, hasMedia, onChange])

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">実績</h2>

      <div className="flex gap-3">
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