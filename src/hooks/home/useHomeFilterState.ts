'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Options = {
  initialKeys?: string[];
  keyToTableMap?: Map<string, string>;
  cityMap?: Map<string, unknown>;
};

export function useHomeFilterState(
  externalLabelMap?: Map<string, string>,
  options?: Options,
) {
  // ★ 12個の useState を1つの Record に統合
  const [filterMap, setFilterMap] = useState<Record<string, string[]>>({});

  // 特定のテーブル（カテゴリ）を更新する汎用関数
  const updateFilter = useCallback((table: string, values: string[]) => {
    setFilterMap((prev) => ({ ...prev, [table]: values }));
  }, []);

  // URL (initialKeys) からの状態復元ロジック
  useEffect(() => {
    if (!options?.keyToTableMap || options.initialKeys?.length === 0) return;

    const nextMap: Record<string, string[]> = { prefectures: [], cities: [] };

    options.initialKeys.forEach((rawKey) => {
      let table = options.keyToTableMap?.get(rawKey);

      // エリア判定
      if (!table) {
        table = options.cityMap?.has(rawKey) ? 'cities' : 'prefectures';
      }

      const fullKey = (table === 'prefectures' || table === 'cities')
        ? rawKey
        : `${table}:${rawKey}`;

      if (!nextMap[table]) nextMap[table] = [];
      nextMap[table].push(fullKey);
    });

    setFilterMap(nextMap);
  }, [options?.initialKeys, options?.keyToTableMap, options?.cityMap]);

  // ★ 12個並べていた selectedKeys を一発で作成
  const selectedKeys = useMemo(() => Object.values(filterMap).flat(), [filterMap]);

  const selectedLabels = useMemo(
    () => selectedKeys.map((k) => externalLabelMap?.get(k) ?? k),
    [selectedKeys, externalLabelMap],
  );

  const handleClear = useCallback(() => setFilterMap({}), []);

  return {
    filterMap,     // 各コンポーネントにはこれの該当する index を渡すだけ
    updateFilter,  // Setter もこれ一つ
    selectedKeys,
    selectedLabels,
    handleClear,
  };
}