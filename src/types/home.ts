// src/types/home.ts
import type React from "react"
import type { RegionKey } from "@/types/location"

export type TokyoAreaKey = "東京23区" | "東京23区以外"

export type HomeSectionRefs = {
  regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>>
  areaRefs: React.MutableRefObject<Record<TokyoAreaKey, HTMLDivElement | null>>
  drinkCategoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  achievementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  genericSectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}