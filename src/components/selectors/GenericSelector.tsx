'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/infra';
import Tooltip from '@/components/ui/Tooltip';
import Chip from '@/components/ui/Chip';

/* =========================
   Types
========================= */
type MasterRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number | null;
  hint?: string | null;
};

// 単一選択と複数選択で value と onChange の型を連動させる
type SelectionProps =
  | {
      selection: 'single';
      value: string | null;
      onChange?: (val: string | null) => void;
    }
  | {
      selection: 'multi';
      value: string[];
      onChange?: (val: string[]) => void;
    };

// 共通のProps定義
type CommonProps = {
  title: string;
  table: string;
  columns?: 2 | 3;
  variant?: 'default' | 'drink';
};

type Props = CommonProps & SelectionProps;

/* =========================
   Main Component
========================= */
export default function GenericSelector({
  title, table, selection, value, onChange, columns = 2, variant = 'default',
}: Props) {
  const [items, setItems] = useState<MasterRow[]>([]);

  // ヒントを有効にするテーブル定義
  const enableHint = ['sizes', 'price_ranges', 'luggages', 'smoking_policies'].includes(table);

 useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from(table)
        .select(`id, key, label, sort_order${enableHint ? ', hint' : ''}`)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        // 型推論のエラーを回避するために戻り値の型を明示
        .returns<MasterRow[]>();

      setItems(data ?? []);
    })();
  }, [table, enableHint]);

  // 選択ロジック
 // 選択ロジック
  const handleToggle = (key: string) => {
    if (!onChange) return;
    const fullKey = `${table}:${key}`;

    if (selection === 'single') {
      // single用のonChangeであることを明示して呼び出す
      const changeFn = onChange as (val: string | null) => void;
      changeFn(value === fullKey ? null : fullKey);
    } else {
      // multi用の値を作成
      const currentValues = value as string[];
      const next = currentValues.includes(fullKey)
        ? currentValues.filter((v) => v !== fullKey)
        : [...currentValues, fullKey];

      // multi用のonChangeであることを明示して呼び出す
      const changeFn = onChange as (val: string[]) => void;
      changeFn(next);
    }
  };

  // ドリンク用の仕分け
  const groups = useMemo(() => {
    if (variant !== 'drink') return [{ list: items, cols: columns }];
    return [
      { list: items.filter(i => (i.sort_order ?? 0) < 90), cols: 3 },
      { list: items.filter(i => (i.sort_order ?? 0) >= 90), cols: 2 },
    ];
  }, [items, variant, columns]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-md font-bold tracking-widest text-dark-5">{title}</h3>
      <div className="flex flex-col gap-2">
        {groups.map((group, idx) => (
          <ul key={idx} className={`grid ${group.cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {group.list.map((item) => {
              const fullKey = `${table}:${item.key}`;
              const isSelected = selection === 'single'
                ? value === fullKey
                : (value as string[]).includes(fullKey);

              const chip = (
                <Chip
                  label={item.label}
                  selected={isSelected}
                  hinted={enableHint && !!item.hint}
                  onChange={() => handleToggle(item.key)}
                />
              );

              return (
                <li key={fullKey}>
                  {enableHint && item.hint ? <Tooltip content={item.hint}>{chip}</Tooltip> : chip}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}