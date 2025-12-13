// src/hooks/useHomeRefs.ts
"use client"

import { useRef } from "react"
import type React from "react"
import type { RegionKey } from "@/app/page"

export function useHomeRefs() {
  const regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>> = {
    "北海道・東北": useRef(null),
    "関東": useRef(null),
    "中部": useRef(null),
    "近畿": useRef(null),
    "中国・四国": useRef(null),
    "九州・沖縄": useRef(null),
  }

  const areaRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const drinkCategoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const achievementRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const genericSectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  return {
    regionRefs,
    areaRefs,
    drinkCategoryRefs,
    achievementRefs,
    genericSectionRefs,
  }
}