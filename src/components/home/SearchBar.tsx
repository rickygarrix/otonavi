'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const hasFilters = selectedFilters.length > 0;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-100 flex w-full justify-center">
      <div className="border-light-2 m-auto w-full max-w-105 border-t bg-white">
        {/* 選択中リスト */}
        <div
          className={`scrollbar-none overflow-hidden transition-all duration-300 ease-in-out ${hasFilters ? 'max-h-12 opacity-100' : 'pointer-events-none max-h-0 opacity-0'}`}
          aria-hidden={!hasFilters}
        >
          <div className="flex h-11 gap-1 overflow-x-auto px-4 pt-4 pb-2 whitespace-nowrap">
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
        </div>

        {/* 検索ボタン */}
        <div className="flex gap-2 px-4 py-2">
          <Button
            onClick={onClear}
            priority="tertiary"
            label="すべてクリア"
            className="flex-1"
          ></Button>

          <Button
            onClick={!isDisabled ? onSearch : undefined}
            disabled={isDisabled}
            label={searchLabel}
            leftIcon={Search}
            className="flex-2"
          ></Button>
        </div>
      </div>
    </div>
  );
}
