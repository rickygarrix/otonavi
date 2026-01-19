// src/lib/fetchStores.ts
import { searchStores } from '@/lib/searchStores';
import type { SearchStore } from '@/types/store';

/**
 * 検索用 店舗取得パラメータ
 */
export type FetchStoresForSearchParams = {
  filters: string[];
  storeTypeId: string | null;
  prefectureId?: string | null;
  cityIds?: string[];
};

/**
 * 検索条件から店舗一覧を取得（SearchStore 用）
 */
export async function fetchStoresForSearch({
  filters,
  storeTypeId,
  prefectureId = null,
  cityIds = [],
}: FetchStoresForSearchParams): Promise<SearchStore[]> {
  return await searchStores({
    filters,
    storeTypeId,
    prefectureId,
    cityIds,
  });
}