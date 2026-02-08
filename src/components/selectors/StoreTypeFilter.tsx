'use client';

import { Headphones, Disc3, MicVocal, Music } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GenericMaster } from '@/types/master';

type Props = {
  storeTypes: GenericMaster[];
  activeTypeKey: string | null; // venue_types:club
  onChange: (key: string | null) => void;
};

/**
 * venue_types の key 部分だけで判定する
 */
const ICON_MAP: Record<string, LucideIcon> = {
  club: Headphones,
  bar: Disc3,
  livehouse: MicVocal,
  other: Music,
};

function getVenueTypeKey(fullKey: string): string {
  // venue_types:club → club
  return fullKey.split(':')[1] ?? fullKey;
}

export default function StoreTypeFilter({
  storeTypes,
  activeTypeKey,
  onChange,
}: Props) {
  return (
    <div className="sticky top-0 z-50 p-4">
      <div className="flex h-14 items-center rounded-full border border-gray-2/40 bg-light-1/90 backdrop-blur-sm">
        {storeTypes.map((t) => {
          const isActive = activeTypeKey === t.key;

          const venueKey = getVenueTypeKey(t.key);
          const Icon = ICON_MAP[venueKey] ?? Music;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(isActive ? null : t.key)}
              className={`flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-full pt-1 transition
                active:scale-110 active:bg-blue-3/5
                ${isActive ? 'bg-blue-3/10 text-blue-4' : 'text-dark-3'}
              `}
            >
              <Icon className="h-6 w-6" strokeWidth={1.4} />
              <span className="text-[10px] leading-none">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}