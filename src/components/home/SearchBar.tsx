'use client';

import { Search } from 'lucide-react';

type Props = {
  selectedFilters: string[];
  onClear: () => void;
  onSearch: () => void;
  count: number;
  onClickFilter?: (label: string) => void;
};

export default function FixedSearchBar({
  selectedFilters,
  onClear,
  onSearch,
  count,
  onClickFilter,
}: Props) {
  const isDisabled = count === 0;

  const searchLabel = isDisabled ? '音箱が見つかりません😢' : `${count}件を検索`;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-100 flex w-full justify-center">
      <div className="m-auto w-full max-w-105 bg-white">
        {/* 選択中リスト */}
        {selectedFilters.length > 0 && (
          <div className="scrollbar-none flex gap-1 overflow-x-auto px-4 pt-4 pb-2 whitespace-nowrap">
            {selectedFilters.map((label) => (
              <button
                key={label}
                onClick={() => onClickFilter?.(label)}
                className="bg-blue-1 text-blue-4 rounded-full px-2 py-1 text-xs leading-none transition active:scale-110 active:shadow-sm"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* 検索ボタン */}
        <div className="flex gap-2 px-4 py-2">
          <button
            onClick={onClear}
            className="bg-light-1 text-dark-5 active:bg-light-2 active:shadow-dark-1/20 h-12 flex-1 rounded-lg text-sm transition active:scale-102 active:shadow-sm"
          >
            すべてクリア
          </button>

          <button
            onClick={!isDisabled ? onSearch : undefined}
            disabled={isDisabled}
            className={`from-dark-3 border-dark-4 to-dark-2 text-light-1 shadow-dark-3/50 flex h-12 flex-2 items-center justify-center gap-2 rounded-lg border bg-linear-to-t text-sm shadow-xs transition active:scale-102 active:shadow-md ${
              isDisabled ? 'cursor-not-allowed opacity-40 backdrop-blur-lg' : ''
            }`}
          >
            <Search className="h-4 w-4" strokeWidth={1.2} />
            {searchLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
