'use client';

import { Headphones, Disc3, MicVocal, Music } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GenericMaster } from '@/types/master';

type Props = {
  storeTypes: GenericMaster[];
  activeTypeId: string | null;
  onChange: (id: string | null) => void;
};

const ICON_MAP: Record<string, LucideIcon> = {
  club: Headphones,
  bar: Disc3,
  livehouse: MicVocal,
  other: Music,
};

export default function StoreTypeFilter({ storeTypes, activeTypeId, onChange }: Props) {
  return (
    <div className="sticky top-0 z-50 p-4">
      <div className="bg-light-1/90 border-gray-2/40 flex h-14 items-center rounded-full border backdrop-blur-sm">
        {storeTypes.map((t) => {
          const isActive = activeTypeId === t.id;
          const Icon = ICON_MAP[t.key] ?? Music;

          return (
            <button
              key={t.id}
              onClick={() => onChange(isActive ? null : t.id)}
              className={`active:bg-blue-3/5 flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-full pt-1 duration-200 active:scale-110 ${
                isActive ? 'bg-blue-3/10 text-blue-4' : 'text-dark-3'
              } `}
            >
              <Icon className="h-6 w-6" strokeWidth={1.4} />
              <span className="text-[10px]">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
