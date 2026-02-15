'use client';

import AreaSelector from '@/components/selectors/AreaSelector';
import GenericSelector from '@/components/selectors/GenericSelector';

type Props = {
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  filterMap: Record<string, string[]>;
  updateFilter: (table: string, values: string[]) => void;
};

// 表示順とカラム設定
const FILTER_CONFIG = [
  { key: '客層', table: 'audience_types', cols: 2 },
  { key: '雰囲気', table: 'atmospheres', cols: 3 },
  { key: '広さ', table: 'sizes', cols: 3 },
  { key: 'ドリンク', table: 'drinks', cols: 3, variant: 'drink' as const },
  { key: '価格帯', table: 'price_ranges', cols: 3 },
  { key: '支払い方法', table: 'payment_methods', cols: 2 },
  { key: '荷物預かり', table: 'luggages', cols: 2 },
  { key: '喫煙', table: 'smoking_policies', cols: 3 },
  { key: 'トイレ', table: 'toilets', cols: 3 },
  { key: '周辺環境', table: 'environments', cols: 2 },
  { key: 'その他', table: 'amenities', cols: 2 },
] as const;

export default function HomeFilterSections({ sectionRefs, filterMap, updateFilter }: Props) {
  return (
    <div className="pb-10">
      {/* 1. エリアセクション */}
      <section
        ref={(el) => { sectionRefs.current['エリア'] = el; }}
        className="flex flex-col gap-4 p-4"
      >
        <h3 className="text-md font-bold tracking-widest text-dark-5">エリア</h3>
        <AreaSelector
          prefectureKeys={filterMap['prefectures'] || []}
          cityKeys={filterMap['cities'] || []}
          onChange={(p, c) => {
            updateFilter('prefectures', p);
            updateFilter('cities', c);
          }}
        />
      </section>

      {/* 2. その他の属性セクション */}
      {FILTER_CONFIG.map((conf) => (
        <section
          key={conf.key}
          ref={(el) => { sectionRefs.current[conf.key] = el; }}
          className="flex flex-col gap-4 p-4"
        >
          <GenericSelector
            title={conf.key}
            table={conf.table}
            selection="multi"
            value={filterMap[conf.table] || []}
            columns={conf.cols}
            // 修正ポイント: 'variant' in conf を使って型ガード
            variant={'variant' in conf ? conf.variant : 'default'}
            onChange={(v) => updateFilter(conf.table, v as string[])}
          />
        </section>
      ))}
    </div>
  );
}