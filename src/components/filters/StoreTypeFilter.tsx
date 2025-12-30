"use client"

import { Disc3, Martini, MicVocal, Music } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { GenericMaster } from "@/types/master"

type Props = {
  storeTypes: GenericMaster[]
  activeTypeId: string | null
  onChange: (id: string | null) => void
}

const ICON_MAP: Record<string, LucideIcon> = {
  club: Disc3,
  bar: Martini,
  livehouse: MicVocal,
  other: Music,
}

export default function StoreTypeFilter({
  storeTypes,
  activeTypeId,
  onChange,
}: Props) {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-[720px] h-14 rounded-full flex items-center px-1 border bg-white">
        {storeTypes.map((t) => {
          const isActive = activeTypeId === t.id
          const Icon = ICON_MAP[t.key] ?? Music

          return (
            <button
              key={t.id}
              onClick={() => onChange(isActive ? null : t.id)}
              className={`
                flex-1 h-full flex flex-col items-center justify-center rounded-full
                transition-colors
                ${isActive
                  ? "bg-blue-100 text-blue-900"
                  : "text-slate-700 hover:bg-slate-100"}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-0.5">{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}