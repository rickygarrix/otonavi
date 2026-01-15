'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prefecture, City } from '@/types/location';
import { ChevronsUpDown, Check } from 'lucide-react';

type Props = {
  clearKey: number;
  onChange: (prefectureIds: string[], cityIds: string[]) => void;
};

type OpenMenu = 'pref' | 'city' | null;
const MENU_ID = { pref: 'pref-menu', city: 'city-menu' } as const;

type OptionRowProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function OptionRow({ label, selected, onClick }: OptionRowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-12 w-full items-center gap-2 rounded-xs px-2 text-start active:bg-black/3 ${selected ? 'text-dark-5 bg-black/5 font-semibold' : 'text-gray-4'}`}
    >
      <Check
        className={`h-4 w-4 shrink-0 ${selected ? 'opacity-100' : 'opacity-0'}`}
        strokeWidth={2.0}
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

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
        className={`h-full overflow-hidden rounded-full p-px ${selected ? outerSelected : outerUnselected}`}
      >
        <div
          className={`flex h-full items-center gap-2 rounded-full px-4 ${selected ? innerSelected : innerUnselected}`}
        >
          <span className="w-full truncate text-start">{label}</span>
          <ChevronsUpDown className="h-4 w-4" strokeWidth={1.2} />
        </div>
      </div>
    </button>
  );
}

export default function AreaSelector({ clearKey, onChange }: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // メニューの開閉
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const openPref = openMenu === 'pref';
  const openCity = openMenu === 'city';
  const isAnyOpen = openMenu !== null;

  // ============================
  // 都道府県（display_order）
  // ============================
  useEffect(() => {
    const loadPrefectures = async () => {
      const { data, error } = await supabase
        .from('prefectures')
        .select('id, name_ja, region, code')
        .order('code', { ascending: true });

      if (error) {
        console.error('prefectures load error:', error);
        return;
      }

      setPrefectures((data ?? []) as Prefecture[]);
    };

    loadPrefectures();
  }, []);

  const isTokyo = selectedPrefecture?.name_ja === '東京都';

  // ============================
  // 市区町村（display_order）
  // ============================
  useEffect(() => {
    if (!isTokyo || !selectedPrefecture) {
      setCities([]);
      setSelectedCity(null);
      return;
    }

    const loadCities = async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, is_23ward, display_order')
        .eq('prefecture_id', selectedPrefecture.id)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('cities load error:', error);
        return;
      }

      setCities((data ?? []) as City[]);
    };

    loadCities();
  }, [isTokyo, selectedPrefecture]);

  const selectPrefecture = (p: Prefecture) => {
    setSelectedPrefecture(p);
    setSelectedCity(null);
    setOpenMenu(null);
    onChange([p.id], []);
  };

  const selectCity = (c: City) => {
    setSelectedCity(c);
    setOpenMenu(null);
    onChange(selectedPrefecture ? [selectedPrefecture.id] : [], [c.id]);
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
    onChange(selectedPrefecture ? [selectedPrefecture.id] : [], []);
  };

  // ============================
  // 分類（順序は DB に従う）
  // ============================
  const wards = useMemo(() => cities.filter((a) => a.is_23ward), [cities]);
  const others = useMemo(() => cities.filter((a) => !a.is_23ward), [cities]);

  // ============================
  // 状態ごとのクラス
  // ============================
  const outerUnselected = 'bg-gray-1 active:bg-gray-2';
  const outerSelected =
    'from-blue-3 to-blue-4 bg-gradient-to-tr active:opacity-90 shadow-sm active:shadow-none';
  const innerUnselected = 'text-gray-3 bg-white active:bg-light-1';
  const innerSelected = 'bg-blue-1 active:opacity-90 text-blue-4';

  // UI
  return (
    <div className="relative flex w-full text-sm">
      {/* スクリム */}
      {isAnyOpen && (
        <button
          type="button"
          aria-label="メニューを閉じる"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setOpenMenu(null)}
        />
      )}

      {/* 都道府県セレクター */}
      <div className="relative flex-1">
        <Selector
          label={selectedPrefecture?.name_ja ?? '都道府県'}
          selected={selectedPrefecture !== null}
          menuId={MENU_ID.pref}
          open={openPref}
          onClick={() => setOpenMenu((current) => (current === 'pref' ? null : 'pref'))}
          {...{ outerUnselected, outerSelected, innerUnselected, innerSelected }}
        />

        {/* 都道府県メニュー */}
        {openPref && (
          <div
            id={MENU_ID.pref}
            role="listbox"
            aria-label="都道府県"
            className="border-gray-1 absolute top-12 left-0 z-20 h-100 w-full overflow-y-auto rounded-2xl border bg-white/40 p-2 shadow-lg backdrop-blur-lg"
          >
            <OptionRow
              label="都道府県を選択"
              selected={selectedPrefecture === null}
              onClick={clearPrefecture}
            />

            {prefectures.map((p) => {
              const isSelected = selectedPrefecture?.id === p.id;

              return (
                <OptionRow
                  key={p.id}
                  label={p.name_ja}
                  selected={isSelected}
                  onClick={() => selectPrefecture(p)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 市区町村セレクター */}
      <div
        className={`relative flex-1 ${isTokyo ? 'visible' : 'invisible'}`}
        aria-hidden={!isTokyo}
      >
        <Selector
          label={selectedCity?.name ?? '市区町村'}
          selected={selectedCity !== null}
          menuId={MENU_ID.city}
          open={openCity}
          disabled={!isTokyo}
          onClick={() => setOpenMenu((current) => (current === 'city' ? null : 'city'))}
          {...{ outerUnselected, outerSelected, innerUnselected, innerSelected }}
        />

        {/* 市区町村メニュー */}
        {openCity && (
          <div
            id={MENU_ID.city}
            role="listbox"
            aria-label="市区町村"
            className="text-gray-4 border-gray-1 absolute top-12 left-0 z-20 h-100 w-full overflow-y-auto rounded-2xl border bg-white/40 p-2 shadow-lg backdrop-blur-lg"
          >
            <OptionRow
              label="市区町村を選択"
              selected={selectedCity === null}
              onClick={clearCity}
            />

            {wards.length > 0 && (
              <>
                <div className="p-2 text-xs font-semibold">東京23区</div>
                {wards.map((c) => {
                  const isSelected = selectedCity?.id === c.id;

                  return (
                    <OptionRow
                      key={c.id}
                      label={c.name}
                      selected={isSelected}
                      onClick={() => selectCity(c)}
                    />
                  );
                })}
              </>
            )}

            {others.length > 0 && (
              <>
                <div className="border-gray-1 mt-2 border-t px-2 pt-6 pb-2 text-xs font-semibold">
                  その他
                </div>
                {others.map((c) => {
                  const isSelected = selectedCity?.id === c.id;

                  return (
                    <OptionRow
                      key={c.id}
                      label={c.name}
                      selected={isSelected}
                      onClick={() => selectCity(c)}
                    />
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
