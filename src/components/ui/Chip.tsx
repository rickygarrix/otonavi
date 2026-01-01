'use client';

type Props = {
  label: string;
  selected?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export default function Chip({ label, selected, onChange, className }: Props) {
  return (
    <label className={`inline-block h-12 cursor-pointer p-1 ${className || ''}`}>
      <input
        onChange={(e) => onChange(e.target.checked)}
        checked={selected}
        type="checkbox"
        className="peer sr-only"
      />
      <span
        className={[
          // グラデボーダー共通
          'block h-full rounded-full p-px',
          // 未選択デフォルト
          'bg-gray-1',
          // 未選択アクティブ
          'active:bg-gray-2',
          // 選択中デフォルト
          'peer-checked:from-blue-3 peer-checked:to-blue-4 peer-checked:bg-gradient-to-tr',
          // 選択中アクティブ
          'peer-checked:active:from-blue-3 peer-checked:active:to-blue-4 peer-checked:active:bg-gradient-to-tr',

          // 本体選択中デフォルト
          'peer-checked:[&>span]:bg-blue-1 peer-checked:[&>span]:text-blue-4 peer-checked:[&>span]:shadow-sm',
          // 本体選択中アクティブ
          'peer-checked:[&>span]:active:opacity-90 peer-checked:[&>span]:active:shadow-none',
        ].join(' ')}
      >
        <span
          className={[
            // 本体共通
            'relative flex h-full items-center justify-center rounded-full text-sm font-normal',
            // 未選択デフォルト
            'text-gray-3 bg-white',
            // 未選択アクティブ
            'active:bg-light-1',
          ].join(' ')}
        >
          {label}
        </span>
      </span>
    </label>
  );
}

/*
export default function Chip({ label, selected, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        m-1 h-12 px-4 rounded-full
        flex items-center justify-center
        text-[14px] font-medium
        border transition-all active:scale-[0.97]

        ${selected
          ? "bg-blue-50 text-blue-700 border-blue-500 shadow-sm"
          : "bg-white text-slate-500 border-slate-200"
        }

        ${className || ""}
      `}
    >
      {label}
    </button>
  )
}
*/
