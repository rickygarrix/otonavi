'use client';

import { useEffect, useRef, useState } from 'react';
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

type TooltipState = {
  text: string;
  x: number;
  y: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function GenericSelector({
  title,
  table,
  selection,
  onChange,
  columns = 2,
  clearKey,
}: Props) {
  const [items, setItems] = useState<(GenericMaster & { description?: string | null })[]>([]);
  const [selected, setSelected] = useState<string[] | string | null>(
    selection === 'single' ? null : [],
  );

  // ===== Tooltip =====
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const pressTimer = useRef<number | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const isTouchingRef = useRef(false);

  // description を持つテーブルだけ有効
  const enableDescription =
    table === 'size_definitions' || table === 'price_range_definitions';

  // =========================
  // データ取得
  // =========================
  useEffect(() => {
    const load = async () => {
      const selectColumns = enableDescription
        ? 'id, key, label, display_order, description'
        : 'id, key, label, display_order';

        const { data, error } = await supabase
        .from(table)
        .select(selectColumns)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error(`GenericSelector load error (${table}):`, error);
        return;
      }

      const rows = (data ?? []) as unknown as (GenericMaster & {
        description?: string | null;
      })[];

      setItems(
        rows.map((d) => ({
          ...d,
          table,
        })),
      );
    };

    load();
  }, [table, enableDescription]);

  // =========================
  // クリア処理
  // =========================
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

  // =========================
  // 選択トグル
  // =========================
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

  // =========================
  // Tooltip位置（ターゲット中央の真上）
  // =========================
  const getAnchorPoint = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    return {
      x: clamp(x, 12, window.innerWidth - 12),
      y: clamp(y, 12, window.innerHeight - 12),
    };
  };

  const showTooltipAtTargetTop = (text: string, target: HTMLElement) => {
    const { x, y } = getAnchorPoint(target);
    setTooltip({ text, x, y });
  };

  const hideTooltip = () => setTooltip(null);

  const clearAllTimers = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  // =========================
  // 📱 Mobile: 0.5秒「長押し」した時だけ表示
  // =========================
  const onTouchStart = (
    e: React.TouchEvent,
    description: string | null | undefined,
    target: HTMLElement,
  ) => {
    if (!enableDescription || !description) return;

    // タップ（クリック化）を止める
    e.preventDefault();
    isTouchingRef.current = true;

    clearAllTimers();

    pressTimer.current = window.setTimeout(() => {
      showTooltipAtTargetTop(description, target);
    }, 500); // ← 0.5秒長押し
  };

  const onTouchMove = () => {
    // 指が動いたらキャンセル
    clearAllTimers();
    hideTooltip();
  };

  const onTouchEnd = () => {
    // 指を離したら即非表示
    clearAllTimers();
    hideTooltip();

    setTimeout(() => {
      isTouchingRef.current = false;
    }, 50);
  };

  // =========================
  // 🖥 PC: 0.5秒ホバーで表示（動いても消えない、離れたら消える）
  // =========================
  const onMouseEnter = (description: string | null | undefined, target: HTMLElement) => {
    if (isTouchingRef.current) return;
    if (!enableDescription || !description) return;

    clearAllTimers();

    hoverTimer.current = window.setTimeout(() => {
      showTooltipAtTargetTop(description, target);
    }, 500);
  };

  const onMouseLeave = () => {
    clearAllTimers();
    hideTooltip();
  };

  // =========================
  // UI
  // =========================
  return (
    <>
      <h3 className="text-md text-dark-5 leading-[1.5] font-bold tracking-widest">{title}</h3>

      <ul className={`grid ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {items.map((item) => (
          <li key={item.key}>
            <div
              onTouchStart={(e) => onTouchStart(e, item.description, e.currentTarget)}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
              onMouseEnter={(e) => onMouseEnter(item.description, e.currentTarget)}
              onMouseLeave={onMouseLeave}
            >
              <Chip
                label={item.label}
                selected={isSelected(item.key)}
                onChange={() => toggle(item.key)}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* ===== Tooltip（対象チップの中央の真上） ===== */}
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
            {/* 吹き出し本体 */}
            <div className="max-w-[260px] rounded-full bg-dark-5 px-5 py-2 text-center text-white text-xs leading-4 shadow-lg">
              {tooltip.text}
            </div>

            {/* ▼ しっぽ（三角） */}
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