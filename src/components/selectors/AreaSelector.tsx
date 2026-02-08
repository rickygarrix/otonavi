'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prefecture, City } from '@/types/location';
import { ChevronsUpDown, Check } from 'lucide-react';

/* =========================
   Types
========================= */

type Props = {
  prefectureKeys: string[]; // key
  cityKeys: string[];       // key
  onChange: (prefectureKeys: string[], cityKeys: string[]) => void;
};

type OpenMenu = 'pref' | 'city' | null;
const MENU_ID = { pref: 'pref-menu', city: 'city-menu' } as const;

type OptionRowProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'option' | 'header';
};

type SelectorProps = {
  label: string;
  selected: boolean;
  menuId: string;
  open: boolean;
  onClick: () => void;
  disabled?: boolean;
  outerUnselected: string;
  outerSelected: string;
  innerUnselected: string;
  innerSelected: string;
};

/* =========================
   Small Components
========================= */

function OptionRow({
  label,
  selected = false,
  onClick,
  variant = 'option',
}: OptionRowProps) {
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
            : 'text-gray-4 hover:bg-black/3'}
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
  menuId,
  open,
  onClick,
  disabled,
  outerUnselected,
  outerSelected,
  innerUnselected,
  innerSelected,
}: SelectorProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={menuId}
      onClick={onClick}
      disabled={disabled}
      className="h-12 w-full p-1"
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
  clearKey,
  prefectureKeys,
  cityKeys,
  onChange,
}: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // key ベース state
  const [selectedPrefKey, setSelectedPrefKey] = useState<string | null>(null);
  const [selectedCityKey, setSelectedCityKey] = useState<string | null>(null);

  const selectedPrefecture =
    prefectures.find((p) => p.key === selectedPrefKey) ?? null;
  const selectedCity =
    cities.find((c) => c.key === selectedCityKey) ?? null;

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const openPref = openMenu === 'pref';
  const openCity = openMenu === 'city';
  const isAnyOpen = openMenu !== null;

  const hasCities = cities.length > 0;



  /* =========================
     Prefectures (店舗がある県のみ)
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
     Cities（都道府県ベース）
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
     URL / 外部 state 同期（key）
  ========================= */
  useEffect(() => {
    setSelectedPrefKey(prefectureKeys[0] ?? null);
  }, [prefectureKeys]);

  useEffect(() => {
    setSelectedCityKey(cityKeys[0] ?? null);
  }, [cityKeys]);

  const isTokyo = selectedPrefecture?.name === '東京都';

  /* =========================
     Classification
  ========================= */
  const wards = useMemo(
    () =>
      isTokyo ? cities.filter((c) => c.sort_order <= 23) : [],
    [cities, isTokyo],
  );

  const others = useMemo(
    () =>
      isTokyo ? cities.filter((c) => c.sort_order > 23) : cities,
    [cities, isTokyo],
  );

  /* =========================
     Handlers（key）
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
    <div className="relative flex w-full text-sm">
      {isAnyOpen && (
        <button
          type="button"
          aria-label="close"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setOpenMenu(null)}
        />
      )}

      {/* Prefecture */}
      <div className="relative flex-1">
        <Selector
          label={selectedPrefecture?.name ?? '都道府県'}
          selected={!!selectedPrefecture}
          menuId={MENU_ID.pref}
          open={openPref}
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

        {openPref && (
          <div className="absolute top-12 left-0 z-20 max-h-100 w-full overflow-y-auto rounded-2xl border border-gray-1 bg-white/40 p-2 shadow-lg backdrop-blur-lg">
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
      <div
        className={`relative flex-1 ${hasCities ? 'visible' : 'invisible'}`}
        aria-hidden={!hasCities}
      >
        <Selector
          label={selectedCity?.name ?? '市区町村'}
          selected={!!selectedCity}
          menuId={MENU_ID.city}
          open={openCity}
          disabled={!hasCities}
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

        {openCity && (
          <div className="absolute top-12 left-0 z-20 max-h-100 w-full overflow-y-auto rounded-2xl border border-gray-1 bg-white/40 p-2 shadow-lg backdrop-blur-lg">
            <OptionRow
              label="市区町村を選択"
              selected={!selectedCity}
              onClick={clearCity}
            />

            {isTokyo && wards.length > 0 && (
              <>
                <div className="p-2 text-xs font-semibold">
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
                {isTokyo && (
                  <div className="mt-2 border-t border-gray-1 px-2 pt-6 pb-2 text-xs font-semibold">
                    その他
                  </div>
                )}
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
          </div>
        )}
      </div>
    </div>
  );
}