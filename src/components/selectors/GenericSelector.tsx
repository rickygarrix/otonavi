'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Chip from '@/components/ui/Chip';
import type { GenericMaster } from '@/types/master';

type BaseProps = {
  title: string;
  table: string;
  columns?: 2 | 3;
  sectionRef?: React.RefObject<HTMLDivElement | null> | React.RefCallback<HTMLDivElement> | null;
  clearKey?: number;
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

export default function GenericSelector({
  title,
  table,
  selection,
  onChange,
  columns = 2,
  sectionRef,
  clearKey,
}: Props) {
  const [items, setItems] = useState<GenericMaster[]>([]);
  const [selected, setSelected] = useState<string[] | string | null>(
    selection === 'single' ? null : [],
  );

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from(table)
        .select("id, key, label, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) {
        console.error(`GenericSelector load error (${table}):`, error);
        return;
      }

      setItems(
        (data ?? []).map((d) => ({
          ...d,
          table,
        })),
      );
    };

    load();
  }, [table]);

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
    selection === 'single' ? selected === key : Array.isArray(selected) && selected.includes(key);

  return (
    <div className="w-full px-6 py-6">
      <div ref={sectionRef ?? null} className="scroll-mt-[90px]" />

      <h2 className="mb-6 text-lg font-bold text-slate-900">{title}</h2>

      <div className={`grid gap-3 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {items.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            selected={isSelected(item.key)}
            onChange={() => toggle(item.key)}
          />
        ))}
      </div>
    </div>
  );
}
