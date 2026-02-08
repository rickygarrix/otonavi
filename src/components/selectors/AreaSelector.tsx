'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prefecture, City } from '@/types/location';
import { ChevronsUpDown, Check } from 'lucide-react';

/* =========================
   Types
========================= */

type Props = {
  clearKey: number;
  prefectureKeys: string[];
  cityKeys: string[];
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

  const [selectedPrefecture, setSelectedPrefecture] =
    useState<Prefecture | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const openPref = openMenu === 'pref';
  const openCity = openMenu === 'city';
  const isAnyOpen = openMenu !== null;

  const hasCities = cities.length > 0;

  /* =========================
     Reset
  ========================= */
  useEffect(() => {
    setSelectedPrefecture(null);
    setSelectedCity(null);
    setOpenMenu(null);
  }, [clearKey]);

  /* =========================
     Prefectures (店舗がある県のみ)
  ========================= */
  useEffect(() => {
    const loadPrefectures = async () => {
      const { data: storePrefs, error } = await supabase
        .from('stores')
        .select('prefecture_id')
        .not('prefecture_id', 'is', null);

      if (error) {
        console.error('stores prefecture load error:', error);
        return;
      }

      const usedPrefectureIds = Array.from(
        new Set((storePrefs ?? []).map((s) => s.prefecture_id)),
      );

      if (!usedPrefectureIds.length) {
        setPrefectures([]);
        return;
      }

      const { data, error: prefError } = await supabase
        .from('prefectures')
        .select('id, name, sort_order')
        .in('id', usedPrefectureIds)
        .order('sort_order', { ascending: true });

      if (prefError) {
        console.error('prefectures load error:', prefError);
        return;
      }

      setPrefectures((data ?? []) as Prefecture[]);
    };

    loadPrefectures();
  }, []);

  /* =========================
     Cities（都道府県ベース）
  ========================= */
  useEffect(() => {
    if (!selectedPrefecture) {
      setCities([]);
      setSelectedCity(null);
      return;
    }

    const loadCities = async () => {
      const { data: storeCities, error } = await supabase
        .from('stores')
        .select('city_id')
        .eq('prefecture_id', selectedPrefecture.id)
        .not('city_id', 'is', null);

      if (error) {
        console.error('stores city load error:', error);
        return;
      }

      const usedCityIds = Array.from(
        new Set((storeCities ?? []).map((s) => s.city_id)),
      );

      if (!usedCityIds.length) {
        setCities([]);
        setSelectedCity(null);
        return;
      }

      const { data, error: cityError } = await supabase
        .from('cities')
        .select('id, name, sort_order, key')
        .in('id', usedCityIds)
        .order('sort_order', { ascending: true });

      if (cityError) {
        console.error('cities load error:', cityError);
        return;
      }

      setCities((data ?? []) as City[]);
    };

    loadCities();
  }, [selectedPrefecture]);

  /* =========================
     URL / 外部 state 同期
  ========================= */
  useEffect(() => {
    if (!prefectures.length) return;

    const pref =
      prefectures.find((p) => p.name === prefectureKeys[0]) ?? null;
    setSelectedPrefecture(pref);
  }, [prefectureKeys, prefectures]);

  useEffect(() => {
    if (!cities.length) return;

    const city = cities.find((c) => c.name === cityKeys[0]) ?? null;
    setSelectedCity(city);
  }, [cityKeys, cities]);

  const isTokyo = selectedPrefecture?.name === '東京都';

  /* =========================
     Classification
  ========================= */
  const wards = useMemo(
    () =>
      isTokyo
        ? cities.filter((c) => c.sort_order <= 23)
        : [],
    [cities, isTokyo],
  );

  const others = useMemo(
    () =>
      isTokyo
        ? cities.filter((c) => c.sort_order > 23)
        : cities,
    [cities, isTokyo],
  );


  /* =========================
     Handlers
  ========================= */
  const selectPrefecture = (p: Prefecture) => {
    setSelectedPrefecture(p);
    setSelectedCity(null);
    setOpenMenu(null);
    onChange([p.name], []);
  };

  const selectCity = (c: City) => {
    setSelectedCity(c);
    setOpenMenu(null);
    onChange(
      selectedPrefecture ? [selectedPrefecture.name] : [],
      [c.name],
    );
  };

  const clearPrefecture = () => {
    setSelectedPrefecture(null);
    setSelectedCity(null);
    setOpenMenu(null);
    onChange([], []);
  };

  const clearCity = () => {
    setSelectedCity(null);
    setOpenMenu(null);
    onChange(
      selectedPrefecture ? [selectedPrefecture.name] : [],
      [],
    );
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
          selected={selectedPrefecture !== null}
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
              selected={selectedPrefecture === null}
              onClick={clearPrefecture}
            />
            {prefectures.map((p) => (
              <OptionRow
                key={p.id}
                label={p.name}
                selected={selectedPrefecture?.id === p.id}
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
          selected={selectedCity !== null}
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
              selected={selectedCity === null}
              onClick={clearCity}
            />

            {isTokyo && wards.length > 0 && (
              <>
                <div className="p-2 text-xs font-semibold">
                  東京23区
                </div>
                {wards.map((c) => (
                  <OptionRow
                    key={c.id}
                    label={c.name}
                    selected={selectedCity?.id === c.id}
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
                    key={c.id}
                    label={c.name}
                    selected={selectedCity?.id === c.id}
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