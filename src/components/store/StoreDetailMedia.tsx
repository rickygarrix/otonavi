'use client';

import { useMemo } from 'react';
import type { StoreMention } from '@/types/store';

type Props = {
  mentions?: StoreMention[] | null;
};

type MentionItem = {
  id: string;
  text: string;
};

export default function StoreDetailMedia({ mentions }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<number, MentionItem[]>();

    mentions?.forEach((m) => {
      if (!m.year) return;

      if (!map.has(m.year)) {
        map.set(m.year, []);
      }

      map.get(m.year)!.push({
        id: m.id,
        text: m.text,
      });
    });

    return map;
  }, [mentions]);

  if (!mentions || grouped.size === 0) return null;

  const years = Array.from(grouped.keys()).sort((a, b) => b - a);

  return (
    <section className="flex flex-col gap-4 p-4 text-sm text-dark-4">
      <h2 className="py-0.5 text-lg font-bold tracking-widest text-dark-5">
        掲載・受賞実績
      </h2>

      <div className="flex flex-col gap-6">
        {years.map((year) => (
          <div key={year} className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-dark-1">
              {year}
            </span>

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