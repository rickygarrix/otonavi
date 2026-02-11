'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Options = {
  initialKeys?: string[];
  keyToTableMap?: Map<string, string>;
  cityMap?: Map<string, unknown>;
};

export function useHomeFilterState(externalLabelMap: Map<string, string>, options?: Options) {
  const [filterMap, setFilterMap] = useState<Record<string, string[]>>({});

  const updateFilter = useCallback((table: string, values: string[]) => {
    setFilterMap((prev) => ({ ...prev, [table]: values }));
  }, []);

  useEffect(() => {
    if (!options?.keyToTableMap || !options.initialKeys || options.initialKeys.length === 0) {
      if (Object.keys(filterMap).length > 0) setFilterMap({});
      return;
    }

    const nextMap: Record<string, string[]> = {};

    options.initialKeys.forEach((rawKey) => {
      // 1. まずマスタデータにあるか確認（venue_types 等を優先して table を決定）
      let table = options.keyToTableMap?.get(rawKey);

      // 2. マスタにない場合のみエリア判定
      if (!table) {
        table = options.cityMap?.has(rawKey) ? 'cities' : 'prefectures';
      }

      const isArea = table === 'prefectures' || table === 'cities';
      const fullKey = isArea ? rawKey : `${table}:${rawKey}`;

      if (!nextMap[table]) nextMap[table] = [];
      if (!nextMap[table].includes(fullKey)) nextMap[table].push(fullKey);
    });

    setFilterMap(nextMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.initialKeys, options?.keyToTableMap, options?.cityMap]);

  const selectedKeys = useMemo(() => Object.values(filterMap).flat(), [filterMap]);

  const selectedLabels = useMemo(() => {
    if (!externalLabelMap || externalLabelMap.size === 0) return [];
    return selectedKeys.map((k) => externalLabelMap.get(k) ?? "");
  }, [selectedKeys, externalLabelMap]);

  const handleClear = useCallback(() => setFilterMap({}), []);

  return { filterMap, updateFilter, selectedKeys, selectedLabels, handleClear };
}