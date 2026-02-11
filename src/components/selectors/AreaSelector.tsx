'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/infra';
import type { Prefecture, City } from '@/types/master';
import { ChevronsUpDown, Check } from 'lucide-react';

/* =========================
   UI Components
========================= */

function OptionRow({ label, selected = false, onClick, variant = 'option' }: any) {
  const isHeader = variant === 'header';
  return (
    <button type="button" onClick={onClick} disabled={isHeader}
      className={`flex h-12 w-full items-center gap-2 rounded-xs px-2 text-start transition-colors ${
        isHeader ? 'cursor-default text-xs font-semibold text-gray-3' :
        selected ? 'bg-black/5 font-semibold text-dark-5' : 'text-gray-4 hover:bg-black/3'
      }`}>
      <Check className={`h-4 w-4 shrink-0 ${isHeader ? 'opacity-0' : selected ? 'opacity-100' : 'opacity-0'}`} strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

function Selector({ label, selected, onClick, disabled, ...styles }: any) {
  return (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} className={`h-12 w-full p-1 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className={`h-full overflow-hidden rounded-full p-px ${selected ? styles.outerSelected : styles.outerUnselected}`}>
        <div className={`flex h-full items-center gap-2 rounded-full px-4 ${selected ? styles.innerSelected : styles.innerUnselected}`}>
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

export default function AreaSelector({ prefectureKeys, cityKeys, onChange }: any) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<{ prefs: Prefecture[]; cities: City[] }>({ prefs: [], cities: [] });
  const [openMenu, setOpenMenu] = useState<'pref' | 'city' | null>(null);

  // 都道府県ロード
  useEffect(() => {
    (async () => {
      const { data: stores } = await supabase.from('stores').select('prefecture_id').not('prefecture_id', 'is', null);
      const ids = [...new Set(stores?.map(s => s.prefecture_id))];
      if (!ids.length) return;
      const { data: prefs } = await supabase.from('prefectures').select('*').in('id', ids).order('sort_order');
      setData(prev => ({ ...prev, prefs: (prefs ?? []) as Prefecture[] }));
    })();
  }, []);

  // 選択中のオブジェクト特定
  const selectedPref = data.prefs.find(p => p.key === prefectureKeys[0]) ?? null;
  const selectedCity = data.cities.find(c => c.key === cityKeys[0]) ?? null;
  const isTokyo = selectedPref?.key === 'tokyo';

  // 市区町村ロード
  useEffect(() => {
    if (!selectedPref) return setData(prev => ({ ...prev, cities: [] }));
    (async () => {
      const { data: stores } = await supabase.from('stores').select('city_id').eq('prefecture_id', selectedPref.id).not('city_id', 'is', null);
      const ids = [...new Set(stores?.map(s => s.city_id))];
      const { data: cities } = await supabase.from('cities').select('*').in('id', ids).order('sort_order');
      setData(prev => ({ ...prev, cities: (cities ?? []) as City[] }));
    })();
  }, [selectedPref?.id]);

  // 外側クリックで閉じる
  useEffect(() => {
    const close = (e: MouseEvent) => !containerRef.current?.contains(e.target as Node) && setOpenMenu(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // デザイン指定のスタイル定数
  const styles = {
    outerUnselected: 'bg-gray-1 active:bg-gray-2',
    outerSelected: 'from-blue-3 to-blue-4 bg-gradient-to-tr shadow-sm active:opacity-90',
    innerUnselected: 'bg-white text-gray-3 active:bg-light-1',
    innerSelected: 'bg-blue-1 text-blue-4 active:opacity-90',
  };

  return (
    <div ref={containerRef} className="relative flex w-full text-sm">
      {/* Prefecture */}
      <div className="relative flex-1">
        <Selector label={selectedPref?.name ?? '都道府県'} selected={!!selectedPref} onClick={() => setOpenMenu(v => v === 'pref' ? null : 'pref')} {...styles} />
        {openMenu === 'pref' && (
          <div className="absolute top-12 left-0 z-20 max-h-100 w-full overflow-y-auto rounded-2xl bg-white/40 p-2 shadow-lg backdrop-blur-lg">
            <OptionRow label="都道府県を選択" selected={!selectedPref} onClick={() => { onChange([], []); setOpenMenu(null); }} />
            {data.prefs.map(p => (
              <OptionRow key={p.key} label={p.name} selected={p.key === selectedPref?.key} onClick={() => { onChange([p.key], []); setOpenMenu(null); }} />
            ))}
          </div>
        )}
      </div>

      {/* City */}
      <div className="relative flex-1">
        <Selector label={selectedCity?.name ?? '市区町村'} selected={!!selectedCity} disabled={!selectedPref} onClick={() => setOpenMenu(v => v === 'city' ? null : 'city')} {...styles} />
       {openMenu === 'city' && (
  <div className="absolute top-12 left-0 z-20 max-h-100 w-full overflow-y-auto rounded-2xl bg-white/40 p-2 shadow-lg backdrop-blur-lg">
    <OptionRow label="市区町村を選択" selected={!selectedCity} onClick={() => { onChange([selectedPref!.key], []); setOpenMenu(null); }} />

    {isTokyo ? (
      <>
        {/* 東京23区：該当データがある時だけ見出しとリストを表示 */}
        {data.cities.some(c => c.sort_order <= 23) && (
          <>
            <div className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-5">東京23区</div>
            {data.cities.filter(c => c.sort_order <= 23).map(c => (
              <OptionRow key={c.key} label={c.name} selected={c.key === selectedCity?.key} onClick={() => { onChange([selectedPref!.key], [c.key]); setOpenMenu(null); }} />
            ))}
          </>
        )}

        {/* その他：該当データがある時だけ見出しとリストを表示 */}
        {data.cities.some(c => c.sort_order > 23) && (
          <>
            <div className="mt-2 border-t border-gray-1 px-2 pt-4 pb-1 text-xs font-semibold text-gray-5">その他</div>
            {data.cities.filter(c => c.sort_order > 23).map(c => (
              <OptionRow key={c.key} label={c.name} selected={c.key === selectedCity?.key} onClick={() => { onChange([selectedPref!.key], [c.key]); setOpenMenu(null); }} />
            ))}
          </>
        )}
      </>
    ) : (
      /* 東京以外：そのまま全表示 */
      data.cities.map(c => (
        <OptionRow key={c.key} label={c.name} selected={c.key === selectedCity?.key} onClick={() => { onChange([selectedPref!.key], [c.key]); setOpenMenu(null); }} />
      ))
    )}
  </div>
)}
      </div>
    </div>
  );
}