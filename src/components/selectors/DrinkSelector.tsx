'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Chip from '@/components/ui/Chip';
import type { DrinkDefinition } from '@/types/master';

type Props = {
  title: string;
  onChange: (keys: string[]) => void;
  clearKey: number;
};

export default function DrinkSelector({ title, onChange, clearKey }: Props) {
  const [items, setItems] = useState<DrinkDefinition[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    onChange(selectedKeys);
  }, [selectedKeys, onChange]);

  useEffect(() => {
    setSelectedKeys([]);
  }, [clearKey]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('drink_definitions')
        .select('key, label, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('DrinkSelector load error:', error);
        return;
      }

      setItems(data ?? []);
    };

    load();
  }, []);

  const { normalDrinks, specialDrinks } = useMemo(() => {
    return {
      normalDrinks: items.filter((i) => (i.display_order ?? 0) < 90),
      specialDrinks: items.filter((i) => (i.display_order ?? 0) >= 90),
    };
  }, [items]);

  const toggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <>
      <h3 className="text-md text-dark-5 leading-[1.5] font-bold tracking-widest">{title}</h3>

      <div className="flex flex-col">
        {/* 通常ドリンク（3列） */}
        {normalDrinks.length > 0 && (
          <ul className="grid grid-cols-3">
            {normalDrinks.map((item) => (
              <li key={item.key}>
                <Chip
                  label={item.label}
                  selected={selectedKeys.includes(item.key)}
                  onChange={() => toggle(item.key)}
                />
              </li>
            ))}
          </ul>
        )}

        {/* 特殊ドリンク（2列・下段） */}
        {specialDrinks.length > 0 && (
          <ul className="grid grid-cols-2">
            {specialDrinks.map((item) => (
              <li key={item.key}>
                <Chip
                  label={item.label}
                  selected={selectedKeys.includes(item.key)}
                  onChange={() => toggle(item.key)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
