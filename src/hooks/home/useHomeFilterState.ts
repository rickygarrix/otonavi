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

  // URLキーから状態を復元
  useEffect(() => {
    if (!options?.keyToTableMap || !options.initialKeys || options.initialKeys.length === 0) {
      // 初期化
      if (Object.keys(filterMap).length > 0) setFilterMap({});
      return;
    }

    const nextMap: Record<string, string[]> = { prefectures: [], cities: [] };

    options.initialKeys.forEach((rawKey) => {
      let table = options.keyToTableMap?.get(rawKey);

      if (!table) {
        table = options.cityMap?.has(rawKey) ? 'cities' : 'prefectures';
      }

      const fullKey = (table === 'prefectures' || table === 'cities')
        ? rawKey
        : `${table}:${rawKey}`;

      if (!nextMap[table]) nextMap[table] = [];
      if (!nextMap[table].includes(fullKey)) nextMap[table].push(fullKey);
    });

    setFilterMap(nextMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.initialKeys, options?.keyToTableMap, options?.cityMap]);

  const selectedKeys = useMemo(() => Object.values(filterMap).flat(), [filterMap]);
const selectedLabels = useMemo(
  () => {

    if (!externalLabelMap || externalLabelMap.size === 0) return [];

    return selectedKeys.map((k) => externalLabelMap.get(k) ?? "");
  },
  [selectedKeys, externalLabelMap]
);

  const handleClear = useCallback(() => setFilterMap({}), []);

  return { filterMap, updateFilter, selectedKeys, selectedLabels, handleClear };
}