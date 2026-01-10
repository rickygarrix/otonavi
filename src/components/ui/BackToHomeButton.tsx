'use client';

type Props = {
  onClick: () => void;
};

export default function BackToHomeButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-50"
    >
      <span className="text-xl">🔍</span>
      別の条件で探す
    </button>
  );
}
