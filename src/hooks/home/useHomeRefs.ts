// src/hooks/useHomeRefs.ts
'use client';

import { useRef } from 'react';
import type React from 'react';
import { RegionKey } from '@/types/location';
import type { HomeSectionRefs, TokyoCityKey } from '@/types/home';

export function useHomeRefs(): HomeSectionRefs {
  const regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>> = {
    [RegionKey.北海道東北]: useRef(null),
    [RegionKey.関東]: useRef(null),
    [RegionKey.中部]: useRef(null),
    [RegionKey.近畿]: useRef(null),
    [RegionKey.中国四国]: useRef(null),
    [RegionKey.九州沖縄]: useRef(null),
  };

  const cityRefs = useRef<Record<TokyoCityKey, HTMLDivElement | null>>({
    東京23区: null,
    東京23区以外: null,
  });

  const drinkCategoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const achievementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const genericSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return {
    regionRefs,
    cityRefs,
    drinkCategoryRefs,
    achievementRefs,
    genericSectionRefs,
  };
}
