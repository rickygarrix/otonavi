// src/lib/fetchStores.ts
import { searchStores } from '@/lib/searchStores';
import type { HomeStore } from '@/types/store';

export type FetchStoresForSearchParams = {
  filters: string[];
  storeTypeId: string | null;

  // ★追加
  prefectureId?: string | null;
  areaIds?: string[];
};

export async function fetchStoresForSearch({
  filters,
  storeTypeId,
  prefectureId = null,
  areaIds = [],
}: FetchStoresForSearchParams): Promise<HomeStore[]> {
  return await searchStores({
    filters,
    storeTypeId,
    prefectureId,
    areaIds,
  });
}