'use client';

import { useMemo } from 'react';
import type { StoreAward, StoreMediaMention } from '@/types/store';

type Props = {
  awards?: StoreAward[] | null;
  mediaMentions?: StoreMediaMention[] | null;
};

type AchievementItem = {
  id: string;
  text: string;
};

export default function StoreDetailMedia({ awards, mediaMentions }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<number, AchievementItem[]>();

    awards?.forEach((a) => {
      if (!a.year) return;
      if (!map.has(a.year)) map.set(a.year, []);
      map.get(a.year)!.push({
        id: `award-${a.id}`,
        text: a.title,
      });
    });

    mediaMentions?.forEach((m) => {
      if (!m.year) return;
      if (!map.has(m.year)) map.set(m.year, []);
      map.get(m.year)!.push({
        id: `media-${m.id}`,
        text: m.media_name,
      });
    });

    return map;
  }, [awards, mediaMentions]);

  if (grouped.size === 0) return null;

  const years = Array.from(grouped.keys()).sort((a, b) => b - a);

  return (
    <section className="text-dark-4 flex flex-col gap-4 p-4 text-sm">
      <h2 className="text-dark-5 py-0.5 text-lg font-bold tracking-widest">受賞歴／メディア掲載</h2>

      <div className="flex flex-col gap-6">
        {years.map((year) => (
          <div key={year} className="flex flex-col gap-2">
            <span className="text-dark-1 text-[10px] font-bold">{year}</span>

            <ul className="flex flex-col gap-2">
              {grouped.get(year)!.map((item) => (
                <li key={item.id} className="leading-[1.5]">
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
