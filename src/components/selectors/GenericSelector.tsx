'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

type TooltipState = {
  text: string;
  x: number;
  y: number;
};

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
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const pressTimer = useRef<number | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const isTouchingRef = useRef(false);

  const enableHint =
    table === 'sizes' || table === 'price_ranges' || table === 'luggages';

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
     Tooltip helpers
  ========================= */
  const getAnchorPoint = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return {
      x: clamp(rect.left + rect.width / 2, 12, window.innerWidth - 12),
      y: clamp(rect.top, 12, window.innerHeight - 12),
    };
  };

  const showTooltipAtTargetTop = (text: string, target: HTMLElement) => {
    const { x, y } = getAnchorPoint(target);
    setTooltip({ text, x, y });
  };

  const hideTooltip = () => setTooltip(null);

  const clearAllTimers = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    pressTimer.current = hoverTimer.current = null;
  };

  /* =========================
     Touch / Mouse handlers
  ========================= */
  const onTouchStart = (hint: string | null | undefined, target: HTMLElement) => {
    if (!enableHint || !hint) return;

    isTouchingRef.current = true;
    clearAllTimers();

    pressTimer.current = window.setTimeout(() => {
      showTooltipAtTargetTop(hint, target);
    }, 1000);
  };

  const onTouchMove = () => {
    clearAllTimers();
    hideTooltip();
  };

  const onTouchEnd = () => {
    clearAllTimers();
    hideTooltip();
    setTimeout(() => {
      isTouchingRef.current = false;
    }, 50);
  };

  const onMouseEnter = (hint: string | null | undefined, target: HTMLElement) => {
    if (isTouchingRef.current) return;
    if (!enableHint || !hint) return;

    clearAllTimers();

    hoverTimer.current = window.setTimeout(() => {
      showTooltipAtTargetTop(hint, target);
    }, 1000);
  };

  const onMouseLeave = () => {
    clearAllTimers();
    hideTooltip();
  };

  /* =========================
     UI helpers
  ========================= */
  const renderList = (list: MasterRow[], cols: 2 | 3) => (
    <ul className={`grid ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {list.map((item) => (
        <li key={item.key}>
          <div
            onTouchStart={(e) => onTouchStart(item.hint, e.currentTarget)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
            onMouseEnter={(e) => onMouseEnter(item.hint, e.currentTarget)}
            onMouseLeave={onMouseLeave}
          >
            <Chip label={item.label} selected={isSelected(item.key)} hinted={enableHint && !!item.hint} onChange={() => toggle(item.key)} />
          </div>
        </li>
      ))}
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

      {tooltip && (
        <div
          className="fixed z-50"
          style={{
            left: tooltip.x,
            top: tooltip.y - 12,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="relative flex flex-col items-center">
            <div className="max-w-[260px] rounded-full bg-dark-5 px-5 py-2 text-center text-xs text-white shadow-lg">
              {tooltip.text}
            </div>
            <div
              className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[6px]
                         border-l-transparent border-r-transparent border-t-dark-5"
              style={{ marginTop: '-1px' }}
            />
          </div>
        </div>
      )}
    </>
  );
}