'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  clearKey?: number;
  variant?: 'default' | 'drink';
};

type SingleProps = BaseProps & {
  selection: 'single';
  onChange?: (value: string | null) => void;
};

type MultiProps = BaseProps & {
  selection: 'multi';
  onChange?: (value: string[]) => void;
};

type Props = SingleProps | MultiProps;

/**
 * DBから取れる「マスター1行」の最小セット
 * ※ GenericMaster の `table` はここでは不要＆DBから返らないので使わない
 */
type MasterRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number | null;
  hint?: string | null;
};

/* =========================
   Utils
========================= */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* =========================
   Component
========================= */

export default function GenericSelector({
  title,
  table,
  selection,
  onChange,
  columns = 2,
  clearKey,
  variant = 'default',
}: Props) {
  const [items, setItems] = useState<MasterRow[]>([]);
  const [selected, setSelected] = useState<string[] | string | null>(
    selection === 'single' ? null : [],
  );

  /* =========================
     Tooltip state
  ========================= */
  const enableHint =
    table === 'sizes' || table === 'price_ranges' || table === 'luggages' || table === 'smoking_policies';

  /* =========================
     Data fetch
  ========================= */
  useEffect(() => {
    const load = async () => {
      if (enableHint) {
        const { data, error } = await supabase
          .from(table)
          .select('id, key, label, sort_order, hint')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error(`GenericSelector load error (${table})`, error);
          return;
        }

        setItems((data ?? []) as MasterRow[]);
      } else {
        const { data, error } = await supabase
          .from(table)
          .select('id, key, label, sort_order')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error(`GenericSelector load error (${table})`, error);
          return;
        }

        setItems((data ?? []) as MasterRow[]);
      }
    };

    load();
  }, [table, enableHint]);

  /* =========================
     Clear selection
  ========================= */
  useEffect(() => {
    if (clearKey === undefined) return;

    if (selection === 'single') {
      setSelected(null);
      onChange?.(null);
    } else {
      setSelected([]);
      onChange?.([]);
    }
  }, [clearKey, selection, onChange]);

  /* =========================
     Selection logic
  ========================= */
  const toggle = (key: string) => {
    if (selection === 'single') {
      const next = selected === key ? null : key;
      setSelected(next);
      onChange?.(next);
      return;
    }

    const prev = Array.isArray(selected) ? selected : [];
    const next = prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key];
    setSelected(next);
    onChange?.(next);
  };

  const isSelected = (key: string) =>
    selection === 'single'
      ? selected === key
      : Array.isArray(selected) && selected.includes(key);

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
        const hinted = enableHint && !!item.hint;
        const chip = (
          <Chip
            label={item.label}
            selected={isSelected(item.key)}
            hinted={hinted}
            onChange={() => toggle(item.key)}
          />
        );

        return (
          <li key={item.key}>
            {hinted ? <Tooltip content={item.hint!}>{chip}</Tooltip> : chip}
          </li>
        )
      })}
    </ul>
  );

  /* =========================
     Render
  ========================= */
  return (
    <>
      <h3 className="text-md text-dark-5 leading-[1.5] font-bold tracking-widest">{title}</h3>

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