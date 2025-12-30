"use client"

import Chip from "@/components/ui/Chip"

type Props = {
  label: string
  selected?: boolean
  onClick?: () => void
}

export default function PrefectureChip({ label, selected, onClick }: Props) {
  return <Chip label={label} selected={selected} onClick={onClick} />
}