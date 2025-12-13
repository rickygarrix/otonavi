'use client'

import {
  BuildingStorefrontIcon,
  KeyIcon,
  BanknotesIcon,
  MegaphoneIcon,
  BeakerIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

import type { RegionKey } from '@/app/page'

type FilterItem = {
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  region: RegionKey
}

type Props = {
  onScroll: (region: RegionKey) => void
}

export default function SearchFilter({ onScroll }: Props) {
  const filters: FilterItem[] = [
    { label: '店舗', icon: BuildingStorefrontIcon, region: '北海道・東北' },
    { label: '設備', icon: KeyIcon, region: '関東' },
    { label: '料金', icon: BanknotesIcon, region: '中部' },
    { label: '音響', icon: MegaphoneIcon, region: '近畿' },
    { label: '飲食', icon: BeakerIcon, region: '中国・四国' },
    { label: '客層', icon: UserGroupIcon, region: '九州・沖縄' },
  ]

  return (
    <div className="w-full flex justify-center px-4">
      <div
        className="
          w-full max-w-[800px]
          bg-slate-50/90 rounded-xl backdrop-blur-sm border border-slate-200
          flex justify-between items-center px-3 py-3 shadow-sm
        "
      >
        {filters.map(({ label, icon: Icon, region }) => (
          <button
            key={label}
            onClick={() => onScroll(region)}
            className="
              flex-1 flex flex-col items-center justify-center
              text-slate-700 hover:opacity-70 active:scale-95
              transition-all py-1
            "
          >
            <Icon className="w-6 h-6 stroke-[1.5]" />
            <span className="text-[11px] mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}