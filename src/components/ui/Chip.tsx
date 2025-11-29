"use client"

type Props = {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export default function Chip({ label, selected, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        h-11 px-4 rounded-full
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