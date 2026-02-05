'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Tooltip from '@/components/ui/Tooltip';
import Chip from '@/components/ui/Chip';

/* =========================
   Types
========================= */

type BaseProps = {
  title: string;
  table: string;
  columns?: 2 | 3;
  variant?: 'default' | 'drink';
};

type SingleProps = BaseProps & {
  selection: 'single';
  value: string | null;
  onChange?: (value: string | null) => void;
};

type MultiProps = BaseProps & {
  selection: 'multi';
  value: string[];
  onChange?: (value: string[]) => void;
};

type Props = SingleProps | MultiProps;

type MasterRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number | null;
  hint?: string | null;
};

/* =========================
   Component
========================= */

export default function GenericSelector({
  title,
  table,
  selection,
  value,
  onChange,
  columns = 2,
  variant = 'default',
}: Props) {
  const [items, setItems] = useState<MasterRow[]>([]);

  /* =========================
     Tooltip
  ========================= */
  const enableHint =
    table === 'sizes' ||
    table === 'price_ranges' ||
    table === 'luggages' ||
    table === 'smoking_policies';

  /* =========================
     Data fetch
  ========================= */
  useEffect(() => {
    const load = async () => {
      const query = supabase
        .from(table)
        .select(
          enableHint
            ? 'id, key, label, sort_order, hint'
            : 'id, key, label, sort_order',
        )
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error(`GenericSelector load error (${table})`, error);
        return;
      }

      setItems((data ?? []) as MasterRow[]);
    };

    load();
  }, [table, enableHint]);

  /* =========================
     Selection helpers
  ========================= */
  const isSelected = (key: string) =>
    selection === 'single'
      ? value === key
      : value.includes(key);

  const toggle = (key: string) => {
    if (!onChange) return;

    if (selection === 'single') {
      onChange(value === key ? null : key);
    } else {
      onChange(
        value.includes(key)
          ? value.filter((v) => v !== key)
          : [...value, key],
      );
    }
  };

  /* =========================
     Drink variant split
  ========================= */
  const { normalItems, specialItems } = useMemo(() => {
    if (variant !== 'drink') {
      return { normalItems: items, specialItems: [] as MasterRow[] };
    }

    return {
      normalItems: items.filter((i) => (i.sort_order ?? 0) < 90),
      specialItems: items.filter((i) => (i.sort_order ?? 0) >= 90),
    };
  }, [items, variant]);

  /* =========================
     UI helpers
  ========================= */
  const renderList = (list: MasterRow[], cols: 2 | 3) => (
    <ul className={`grid ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {list.map((item) => {
        const chip = (
          <Chip
            label={item.label}
            selected={isSelected(item.key)}
            hinted={enableHint && !!item.hint}
            onChange={() => toggle(item.key)}
          />
        );

        return (
          <li key={item.key}>
            {enableHint && item.hint ? (
              <Tooltip content={item.hint}>{chip}</Tooltip>
            ) : (
              chip
            )}
          </li>
        );
      })}
    </ul>
  );

  /* =========================
     Render
  ========================= */
  return (
    <>
      <h3 className="text-md font-bold tracking-widest text-dark-5">
        {title}
      </h3>

      {variant === 'drink' ? (
        <div>
          {normalItems.length > 0 && renderList(normalItems, 3)}
          {specialItems.length > 0 && renderList(specialItems, 2)}
        </div>
      ) : (
        renderList(items, columns)
      )}
    </>
  );
}