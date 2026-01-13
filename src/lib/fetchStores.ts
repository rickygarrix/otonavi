// src/lib/fetchStores.ts
import { searchStores } from '@/lib/searchStores';
import type { HomeStore } from '@/types/store';

export type FetchStoresForSearchParams = {
  filters: string[];
  storeTypeId: string | null;

  // ★追加
  prefectureId?: string | null;
  cityIds?: string[];
};

export async function fetchStoresForSearch({
  filters,
  storeTypeId,
  prefectureId = null,
  cityIds = [],
}: FetchStoresForSearchParams): Promise<HomeStore[]> {
  return await searchStores({
    filters,
    storeTypeId,
    prefectureId,
    cityIds,
  });
}
