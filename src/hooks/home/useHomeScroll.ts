// src/hooks/useHomeScroll.ts
"use client"

import { useCallback } from "react"
import type { Area, RegionKey } from "@/types/location"
import type { HomeSectionRefs } from "@/types/home"

type Params = {
  areaMap: Map<string, Area>
  drinkCategoryMap: Map<string, string>
  prefectureRegionMap: Map<string, RegionKey>
  labelToSectionMap: Map<string, string>
  refs: HomeSectionRefs
}

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
      const area = areaMap.get(label)
      if (area) {
        const key = area.is_23ward ? "東京23区" : "東京23区以外"
        areaRefs.current[key]?.scrollIntoView({ behavior: "smooth" })
        return
      }

      const category = drinkCategoryMap.get(label)
      if (category) {
        drinkCategoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" })
        return
      }

      const achievement = achievementRefs.current[label]
      if (achievement) {
        achievement.scrollIntoView({ behavior: "smooth" })
        return
      }

      const section = labelToSectionMap.get(label)
      if (section) {
        genericSectionRefs.current[section]?.scrollIntoView({ behavior: "smooth" })
        return
      }

      const region = prefectureRegionMap.get(label)
      if (region) {
        regionRefs[region].current?.scrollIntoView({ behavior: "smooth" })
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