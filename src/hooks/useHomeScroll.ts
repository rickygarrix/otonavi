// src/hooks/useHomeScroll.ts
"use client"

import { useCallback } from "react"
import type React from "react"
import type { RegionKey } from "@/app/page"

// --------------------
// Refs 型
// --------------------
type Refs = {
  regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>>
  areaRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  drinkCategoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  achievementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  genericSectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}

// --------------------
// Params 型
// --------------------
type Params = {
  areaMap: Map<string, { is_23ward: boolean }>
  drinkCategoryMap: Map<string, string>
  prefectureRegionMap: Map<string, RegionKey>
  labelToSectionMap: Map<string, string>
  refs: Refs
}

// --------------------
// Hook
// --------------------
export function useHomeScroll({
  areaMap,
  drinkCategoryMap,
  prefectureRegionMap,
  labelToSectionMap,
  refs,
}: Params) {
  const {
    regionRefs,
    areaRefs,
    drinkCategoryRefs,
    achievementRefs,
    genericSectionRefs,
  } = refs

  const scrollByLabel = useCallback(
    (label: string) => {
      // 1) 東京エリア（23区 / 23区以外）
      const area = areaMap.get(label)
      if (area) {
        const key = area.is_23ward ? "東京23区" : "東京23区以外"
        areaRefs.current[key]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        return
      }

      // 2) ドリンクカテゴリ
      const category = drinkCategoryMap.get(label)
      if (category) {
        drinkCategoryRefs.current[category]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        return
      }

      // 3) 実績（Achievement）
      const achievementTarget = achievementRefs.current[label]
      if (achievementTarget) {
        achievementTarget.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        return
      }

      // 4) Generic セクション
      const sectionName = labelToSectionMap.get(label)
      if (sectionName) {
        genericSectionRefs.current[sectionName]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        return
      }

      // 5) 都道府県 → 地域
      const region = prefectureRegionMap.get(label)
      if (region) {
        regionRefs[region].current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    },
    [
      areaMap,
      drinkCategoryMap,
      prefectureRegionMap,
      labelToSectionMap,
      regionRefs,
      areaRefs,
      drinkCategoryRefs,
      achievementRefs,
      genericSectionRefs,
    ]
  )

  return scrollByLabel
}