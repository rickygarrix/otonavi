"use client"

import { Search } from "lucide-react"

type Props = {
  selectedFilters: string[]
  onClear: () => void
  onSearch: () => void
  count: number
  onClickFilter?: (label: string) => void
}

export default function FixedSearchBar({
  selectedFilters,
  onClear,
  onSearch,
  count,
  onClickFilter,
}: Props) {
  const isDisabled = count === 0

  const searchLabel = isDisabled
    ? "音箱が見つかりません😢"
    : `${count}件を検索`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-3">
      {selectedFilters.length > 0 && (
        <div className="flex gap-2 mb-2 whitespace-nowrap overflow-x-auto scrollbar-none">
          {selectedFilters.map((label) => (
            <button
              key={label}
              onClick={() => onClickFilter?.(label)}
              className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs active:scale-95 transition"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-1">
        <button
          onClick={onClear}
          className="flex-1 h-12 bg-slate-100 rounded-xl text-slate-900 font-medium"
        >
          すべてクリア
        </button>

        <button
          onClick={!isDisabled ? onSearch : undefined}
          disabled={isDisabled}
          className={`flex-[2] h-12 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition
            ${isDisabled
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-slate-800 text-white active:scale-[0.97]"
            }`}
        >
          <Search className="w-5 h-5" />
          {searchLabel}
        </button>
      </div>
    </div>
  )
}