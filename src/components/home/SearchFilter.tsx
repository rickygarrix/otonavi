'use client'

import {
  BuildingStorefrontIcon,
  KeyIcon,
  BanknotesIcon,
  MegaphoneIcon,
  BeakerIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

export default function SearchFilter() {
  const filters = [
    { label: '店舗', icon: BuildingStorefrontIcon },
    { label: '設備', icon: KeyIcon },
    { label: '料金', icon: BanknotesIcon },
    { label: '音響', icon: MegaphoneIcon },
    { label: '飲食', icon: BeakerIcon },
    { label: '客層', icon: UserGroupIcon },
  ]

  return (
    <div className="w-full flex justify-center px-4">
      <div
        className="
          w-full
          max-w-[800px]
          bg-slate-50/90
          rounded-xl
          backdrop-blur-sm
          border border-slate-200
          flex justify-between
          items-center
          px-3 py-3
          shadow-sm
        "
      >
        {filters.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="
              flex-1 flex flex-col items-center justify-center
              text-slate-700
              hover:opacity-70
              active:scale-95
              transition-all
              py-1
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