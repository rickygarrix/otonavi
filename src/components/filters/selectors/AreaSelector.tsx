'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prefecture, Area } from '@/types/location';
import { ChevronsUpDown, Check } from 'lucide-react';

type Props = {
  clearKey: number;
  onChange: (prefectureIds: string[], areaIds: string[]) => void;
};

const TOKYO_NAME = '東京都';

export default function AreaSelector({ clearKey, onChange }: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const [openPref, setOpenPref] = useState(false);
  const [openArea, setOpenArea] = useState(false);

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

  const isTokyo = selectedPrefecture?.name_ja === TOKYO_NAME;

  // ============================
  // エリア（display_order）
  // ============================
  useEffect(() => {
    if (!isTokyo || !selectedPrefecture) {
      setAreas([]);
      setSelectedArea(null);
      return;
    }

    const loadAreas = async () => {
      const { data, error } = await supabase
        .from('areas')
        .select('id, name, is_23ward, display_order')
        .eq('prefecture_id', selectedPrefecture.id)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('areas load error:', error);
        return;
      }

      setAreas((data ?? []) as Area[]);
    };

    loadAreas();
  }, [isTokyo, selectedPrefecture]);

  // ============================
  // clear
  // ============================
  useEffect(() => {
    setSelectedPrefecture(null);
    setSelectedArea(null);
    onChange([], []);
  }, [clearKey, onChange]);

  const selectPrefecture = (p: Prefecture) => {
    setSelectedPrefecture(p);
    setSelectedArea(null);
    setOpenPref(false);
    onChange([p.id], []);
  };

  const selectArea = (a: Area) => {
    setSelectedArea(a);
    setOpenArea(false);
    onChange(selectedPrefecture ? [selectedPrefecture.id] : [], [a.id]);
  };

  // ============================
  // 分類（順序は DB に従う）
  // ============================
  const wards = useMemo(() => areas.filter((a) => a.is_23ward), [areas]);
  const others = useMemo(() => areas.filter((a) => !a.is_23ward), [areas]);

  // ============================
  // 状態ごとのクラス
  // ============================
  const outerUnselected = 'bg-gray-1 active:bg-gray-2';
  const outerSelected =
    'from-blue-3 to-blue-4 bg-gradient-to-tr active:opacity-90 shadow-sm active:shadow-none';
  const innerUnselected = 'text-gray-3 bg-white active:bg-light-1';
  const innerSelected = 'bg-blue-1 active:opacity-90 text-blue-4';

  // ============================
  // UI
  // ============================
  return (
    <div className="relative flex w-full text-sm">
      {/* 都道府県セレクター */}
      <div className="relative flex-1">
        <button
          onClick={() => {
            setOpenArea(false);
            setOpenPref((v) => !v);
          }}
          className="h-12 w-full p-1"
        >
          <div
            className={`h-full overflow-hidden rounded-full p-px ${selectedPrefecture ? outerSelected : outerUnselected}`}
          >
            <div
              className={`flex h-full items-center gap-2 rounded-full px-4 ${selectedPrefecture ? innerSelected : innerUnselected}`}
            >
              <span className="w-full truncate text-start">
                {selectedPrefecture?.name_ja ?? '都道府県'}
              </span>
              <ChevronsUpDown className="h-4 w-4" strokeWidth={1.2} />
            </div>
          </div>
        </button>

        {/* 都道府県メニュー */}
        {openPref && (
          <div className="border-gray-1 absolute z-50 mt-2 h-100 w-50 overflow-y-auto rounded-2xl border bg-white/60 p-2 shadow-lg backdrop-blur-lg">
            {prefectures.map((p) => {
              const isSelected = selectedPrefecture?.id === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => selectPrefecture(p)}
                  className={`active:bg-light-1 flex h-12 w-full items-center gap-2 rounded-xs px-2 text-start ${isSelected ? 'text-dark-5' : 'text-gray-4'}`}
                >
                  <Check
                    className={`h-4 w-4 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                    strokeWidth={1.4}
                  />
                  <span className="min-w-0 flex-1 truncate">{p.name_ja}</span>
                </button>
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
        <button
          onClick={() => {
            setOpenPref(false);
            setOpenArea((v) => !v);
          }}
          className="h-12 w-full p-1"
        >
          <div
            className={`h-full overflow-hidden rounded-full p-px ${selectedArea ? outerSelected : outerUnselected}`}
          >
            <div
              className={`flex h-full items-center gap-2 rounded-full px-4 ${selectedArea ? innerSelected : innerUnselected}`}
            >
              <span className="w-full truncate text-start">{selectedArea?.name ?? 'エリア'}</span>
              <ChevronsUpDown className="h-4 w-4" strokeWidth={1.2} />
            </div>
          </div>
        </button>

        {/* 市区町村メニュー */}
        {openArea && (
          <div className="text-gray-4 border-gray-1 absolute z-50 mt-2 h-100 w-50 overflow-y-auto rounded-2xl border bg-white/60 p-2 shadow-lg backdrop-blur-lg">
            {wards.length > 0 && (
              <>
                <div className="p-2 text-xs font-semibold">東京23区</div>
                {wards.map((a) => {
                  const isSelected = selectedArea?.id === a.id;

                  return (
                    <button
                      key={a.id}
                      onClick={() => selectArea(a)}
                      className={`active:bg-light-1 flex h-12 w-full items-center gap-2 rounded-xs px-2 text-start ${isSelected ? 'text-dark-5' : 'text-gray-4'}`}
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        strokeWidth={1.4}
                      />
                      <span className="min-w-0 flex-1 truncate">{a.name}</span>
                    </button>
                  );
                })}
              </>
            )}

            {others.length > 0 && (
              <>
                <div className="border-gray-1 mt-2 border-t px-2 pt-6 pb-2 text-xs font-semibold">
                  その他
                </div>
                {others.map((a) => {
                  const isSelected = selectedArea?.id === a.id;

                  return (
                    <button
                      key={a.id}
                      onClick={() => selectArea(a)}
                      className={`active:bg-light-1 flex h-12 w-full items-center gap-2 rounded-xs px-2 text-start ${isSelected ? 'text-dark-5' : 'text-gray-4'}`}
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        strokeWidth={1.4}
                      />
                      <span className="min-w-0 flex-1 truncate">{a.name}</span>
                    </button>
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
