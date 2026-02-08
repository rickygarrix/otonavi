'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prefecture, City } from '@/types/location';
import { ChevronsUpDown, Check } from 'lucide-react';

/* =========================
   Types
========================= */

type Props = {
  prefectureKeys: string[];
  cityKeys: string[];
  onChange: (prefectureKeys: string[], cityKeys: string[]) => void;
};

type OpenMenu = 'pref' | 'city' | null;

/* =========================
   Small Components
========================= */

function OptionRow({
  label,
  selected = false,
  onClick,
  variant = 'option',
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'option' | 'header';
}) {
  const isHeader = variant === 'header';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isHeader}
      className={`
        flex h-12 w-full items-center gap-2 rounded-xs px-2 text-start
        transition-colors
        ${isHeader
          ? 'cursor-default text-xs font-semibold text-gray-3'
          : selected
            ? 'bg-black/5 font-semibold text-dark-5'
            : 'text-gray-4 hover:bg-black/3'
        }
      `}
    >
      <Check
        className={`h-4 w-4 shrink-0 ${isHeader ? 'opacity-0' : selected ? 'opacity-100' : 'opacity-0'
          }`}
        strokeWidth={2}
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

function Selector({
  label,
  selected,
  onClick,
  disabled,
  outerUnselected,
  outerSelected,
  innerUnselected,
  innerSelected,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  outerUnselected: string;
  outerSelected: string;
  innerUnselected: string;
  innerSelected: string;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
    h-12 w-full p-1
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `}
    >
      <div
        className={`h-full overflow-hidden rounded-full p-px ${selected ? outerSelected : outerUnselected
          }`}
      >
        <div
          className={`flex h-full items-center gap-2 rounded-full px-4 ${selected ? innerSelected : innerUnselected
            }`}
        >
          <span className="w-full truncate text-start">{label}</span>
          <ChevronsUpDown className="h-4 w-4" strokeWidth={1.2} />
        </div>
      </div>
    </button>
  );
}

/* =========================
   Main Component
========================= */

export default function AreaSelector({
  prefectureKeys,
  cityKeys,
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedPrefKey, setSelectedPrefKey] = useState<string | null>(null);
  const [selectedCityKey, setSelectedCityKey] = useState<string | null>(null);

  const selectedPrefecture =
    prefectures.find((p) => p.key === selectedPrefKey) ?? null;
  const isTokyo = selectedPrefecture?.key === 'tokyo';

  const wards = cities.filter((c) => c.sort_order <= 23);
  const others = cities.filter((c) => c.sort_order > 23);
  const selectedCity =
    cities.find((c) => c.key === selectedCityKey) ?? null;

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  /* =========================
     🔥 外側クリックで閉じる
  ========================= */
  useEffect(() => {
    if (!openMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  /* =========================
     Prefectures
  ========================= */
  useEffect(() => {
    const load = async () => {
      const { data: storePrefs } = await supabase
        .from('stores')
        .select('prefecture_id')
        .not('prefecture_id', 'is', null);

      const ids = Array.from(
        new Set((storePrefs ?? []).map((s) => s.prefecture_id)),
      );

      if (!ids.length) return;

      const { data } = await supabase
        .from('prefectures')
        .select('id, key, name, sort_order')
        .in('id', ids)
        .order('sort_order');

      setPrefectures((data ?? []) as Prefecture[]);
    };

    load();
  }, []);

  /* =========================
     Cities
  ========================= */
  useEffect(() => {
    if (!selectedPrefecture) {
      setCities([]);
      setSelectedCityKey(null);
      return;
    }

    const load = async () => {
      const { data: storeCities } = await supabase
        .from('stores')
        .select('city_id')
        .eq('prefecture_id', selectedPrefecture.id)
        .not('city_id', 'is', null);

      const ids = Array.from(
        new Set((storeCities ?? []).map((s) => s.city_id)),
      );

      if (!ids.length) return;

      const { data } = await supabase
        .from('cities')
        .select('id, key, name, sort_order')
        .in('id', ids)
        .order('sort_order');

      setCities((data ?? []) as City[]);
    };

    load();
  }, [selectedPrefecture]);

  /* =========================
     外部 state 同期
  ========================= */
  useEffect(() => {
    setSelectedPrefKey(prefectureKeys[0] ?? null);
  }, [prefectureKeys]);

  useEffect(() => {
    setSelectedCityKey(cityKeys[0] ?? null);
  }, [cityKeys]);

  /* =========================
     Handlers
  ========================= */
  const selectPrefecture = (p: Prefecture) => {
    setSelectedPrefKey(p.key);
    setSelectedCityKey(null);
    setOpenMenu(null);
    onChange([p.key], []);
  };

  const selectCity = (c: City) => {
    setSelectedCityKey(c.key);
    setOpenMenu(null);
    onChange(selectedPrefKey ? [selectedPrefKey] : [], [c.key]);
  };

  const clearPrefecture = () => {
    setSelectedPrefKey(null);
    setSelectedCityKey(null);
    setOpenMenu(null);
    onChange([], []);
  };

  const clearCity = () => {
    setSelectedCityKey(null);
    setOpenMenu(null);
    onChange(selectedPrefKey ? [selectedPrefKey] : [], []);
  };

  /* =========================
     Styles
  ========================= */
  const outerUnselected = 'bg-gray-1 active:bg-gray-2';
  const outerSelected =
    'from-blue-3 to-blue-4 bg-gradient-to-tr shadow-sm active:opacity-90';
  const innerUnselected = 'bg-white text-gray-3 active:bg-light-1';
  const innerSelected = 'bg-blue-1 text-blue-4 active:opacity-90';

  /* =========================
     UI
  ========================= */
  return (
    <div ref={containerRef} className="relative flex w-full text-sm">
      {/* Prefecture */}
      <div className="relative flex-1">
        <Selector
          label={selectedPrefecture?.name ?? '都道府県'}
          selected={!!selectedPrefecture}
          onClick={() =>
            setOpenMenu((v) => (v === 'pref' ? null : 'pref'))
          }
          {...{
            outerUnselected,
            outerSelected,
            innerUnselected,
            innerSelected,
          }}
        />

        {openMenu === 'pref' && (
          <div className="absolute top-12 left-0 z-20 max-h-100 w-full overflow-y-auto rounded-2xl bg-white/40 p-2 shadow-lg backdrop-blur-lg">
            <OptionRow
              label="都道府県を選択"
              selected={!selectedPrefecture}
              onClick={clearPrefecture}
            />
            {prefectures.map((p) => (
              <OptionRow
                key={p.key}
                label={p.name}
                selected={p.key === selectedPrefKey}
                onClick={() => selectPrefecture(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* City */}
      <div className="relative flex-1">
        <Selector
          label={selectedCity?.name ?? '市区町村'}
          selected={!!selectedCity}
          disabled={!selectedPrefecture}
          onClick={() =>
            setOpenMenu((v) => (v === 'city' ? null : 'city'))
          }
          {...{
            outerUnselected,
            outerSelected,
            innerUnselected,
            innerSelected,
          }}
        />

        {openMenu === 'city' && (
          <div className="absolute top-12 left-0 z-20 max-h-100 w-full overflow-y-auto rounded-2xl bg-white/40 p-2 shadow-lg backdrop-blur-lg">
            <OptionRow
              label="市区町村を選択"
              selected={!selectedCity}
              onClick={clearCity}
            />
            {isTokyo ? (
              <>
                {wards.length > 0 && (
                  <>
                    <div className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-5">
                      東京23区
                    </div>
                    {wards.map((c) => (
                      <OptionRow
                        key={c.key}
                        label={c.name}
                        selected={c.key === selectedCityKey}
                        onClick={() => selectCity(c)}
                      />
                    ))}
                  </>
                )}

                {others.length > 0 && (
                  <>
                    <div className="mt-2 border-t border-gray-1 px-2 pt-4 pb-1 text-xs font-semibold text-gray-5">
                      その他
                    </div>
                    {others.map((c) => (
                      <OptionRow
                        key={c.key}
                        label={c.name}
                        selected={c.key === selectedCityKey}
                        onClick={() => selectCity(c)}
                      />
                    ))}
                  </>
                )}
              </>
            ) : (
              cities.map((c) => (
                <OptionRow
                  key={c.key}
                  label={c.name}
                  selected={c.key === selectedCityKey}
                  onClick={() => selectCity(c)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}