"use client"

import Chip from "@/components/ui/Chip"

type Props = {
  label: string
  selected?: boolean
  onChange: (checked: boolean) => void
}

export default function PrefectureChip({
  label,
  selected = false,   // ← ★ ここが重要
  onChange,
}: Props) {
  return (
    <Chip
      label={label}
      selected={selected}
      onChange={onChange}
    />
  )
}