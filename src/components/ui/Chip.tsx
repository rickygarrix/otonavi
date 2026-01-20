'use client';

import { CircleQuestionMark } from 'lucide-react';

type Props = {
  label: string;
  selected: boolean;
  onChange: (checked: boolean) => void;
  hinted?: boolean;
  className?: string;
};

export default function Chip({ label, selected, onChange, hinted, className }: Props) {
  const isSelected = selected === true;

  //状態ごとのクラス
  const outerUnselected = 'bg-gray-1 active:bg-gray-2';
  const outerSelected =
    'from-blue-3 to-blue-4 bg-gradient-to-tr active:opacity-90 shadow-sm active:shadow-none';
  const innerUnselected = 'text-gray-3 bg-white active:bg-light-1';
  const innerSelected = 'bg-blue-1 active:opacity-90 text-blue-4';

  return (
    <label className={`inline-block h-12 w-full cursor-pointer p-1 ${className || ''}`}>
      <input
        onChange={(e) => onChange(e.target.checked)}
        checked={isSelected}
        type="checkbox"
        className="sr-only"
      />
      <span
        className={`block h-full rounded-full p-px ${isSelected ? outerSelected : outerUnselected}`}
      >
        <span
          className={`relative flex h-full items-center justify-center rounded-full text-sm font-normal ${isSelected ? innerSelected : innerUnselected}`}
        >
          {label}
          {hinted && <CircleQuestionMark aria-hidden="true" className="absolute -top-1 -right-1 h-2 w-2" strokeWidth={2.0} />}
        </span>
      </span>
    </label >
  );
}
