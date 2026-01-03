'use client';

import { Disc3, Martini, MicVocal, Music } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GenericMaster } from '@/types/master';

type Props = {
  storeTypes: GenericMaster[];
  activeTypeId: string | null;
  onChange: (id: string | null) => void;
};

const ICON_MAP: Record<string, LucideIcon> = {
  club: Disc3,
  bar: Martini,
  livehouse: MicVocal,
  other: Music,
};

export default function StoreTypeFilter({ storeTypes, activeTypeId, onChange }: Props) {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="bg-light-1 border-light-2 flex h-14 w-full items-center rounded-full border bg-white">
        {storeTypes.map((t) => {
          const isActive = activeTypeId === t.id;
          const Icon = ICON_MAP[t.key] ?? Music;

          return (
            <button
              key={t.id}
              onClick={() => onChange(isActive ? null : t.id)}
              className={`flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-full pt-1 ${
                isActive ? 'bg-blue-3/10 text-blue-4' : 'text-dark-3'
              } `}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px]">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
