// src/lib/fetchStores.ts
import { searchStores } from '@/lib/searchStores';
import type { SearchStore } from '@/types/store';

/**
 * 検索用 店舗取得パラメータ
 * ※ filters はフロント側（useStoreFilters）で使用するため、
 *   DB 取得層では受け取らない
 */
export type FetchStoresForSearchParams = {
  storeTypeId: string | null;
  prefectureId?: string | null;
  cityIds?: string[];
};

/**
 * 検索条件から店舗一覧を取得（SearchStore 用）
 * - DB では大枠（業態・エリア）のみ絞る
 * - 詳細フィルタ（filters）はフロントで処理
 */
export async function fetchStoresForSearch({
  storeTypeId,
  prefectureId = null,
  cityIds = [],
}: FetchStoresForSearchParams): Promise<SearchStore[]> {
  return await searchStores({
    storeTypeId,
    prefectureId,
    cityIds,
  });
}