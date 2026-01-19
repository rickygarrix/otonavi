// src/types/home.ts
import type React from 'react';

export type TokyoCityKey = '東京23区' | '東京23区以外';

export type HomeSectionRefs = {
  cityRefs: React.MutableRefObject<Record<TokyoCityKey, HTMLDivElement | null>>;
  drinkCategoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  achievementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  genericSectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
};
