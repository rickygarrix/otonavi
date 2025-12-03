"use client"

type Props = {
  onClick: () => void
  className?: string
}

export default function BackToHomeButton({ onClick, className }: Props) {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                  border border-slate-300 text-slate-700 text-lg font-medium
                  hover:bg-slate-50 transition"
      >
        <span className="text-xl">🔍</span>
        別の条件で探す
      </button>
    </div>
  )
}