// src/hooks/useHomeScroll.ts
'use client';

import { useCallback } from 'react';
import type { City, RegionKey } from '@/types/location';
import type { HomeSectionRefs } from '@/types/home';

type Params = {
  cityMap: Map<string, City>;
  drinkCategoryMap: Map<string, string>;
  prefectureRegionMap: Map<string, RegionKey>;
  labelToSectionMap: Map<string, string>;
  refs: HomeSectionRefs;
};

export function useHomeScroll({
  cityMap,
  drinkCategoryMap,
  prefectureRegionMap,
  labelToSectionMap,
  refs,
}: Params) {
  const { regionRefs, cityRefs, drinkCategoryRefs, achievementRefs, genericSectionRefs } = refs;

  const scrollByLabel = useCallback(
    (label: string) => {
      const city = cityMap.get(label);
      if (city) {
        const key = city.is_23ward ? '東京23区' : '東京23区以外';
        cityRefs.current[key]?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const category = drinkCategoryMap.get(label);
      if (category) {
        drinkCategoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const achievement = achievementRefs.current[label];
      if (achievement) {
        achievement.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const section = labelToSectionMap.get(label);
      if (section) {
        genericSectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const region = prefectureRegionMap.get(label);
      if (region) {
        regionRefs[region].current?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [
      cityMap,
      drinkCategoryMap,
      prefectureRegionMap,
      labelToSectionMap,
      regionRefs,
      cityRefs,
      drinkCategoryRefs,
      achievementRefs,
      genericSectionRefs,
    ],
  );

  return scrollByLabel;
}
