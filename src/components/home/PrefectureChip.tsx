'use client'

type Props = {
  label: string
  selected?: boolean
  onClick: () => void
}

export default function PrefectureChip({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 rounded-full border text-sm
        transition
        ${selected
          ? 'bg-blue-50 text-blue-600 border-blue-400 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200'}
      `}
    >
      {label}
    </button>
  )
}