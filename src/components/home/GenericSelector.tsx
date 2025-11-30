"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

// ===================================================
// マスタ行の型
// ===================================================
type Item = {
  id: string
  key?: string | null
  label: string
  description?: string | null
  is_active: boolean
}

// ===================================================
// Props 型
// ===================================================
type BaseProps = {
  title: string
  table: string
}

type SingleProps = BaseProps & {
  selection: "single"
  onChange: (value: string | null) => void
}

type MultiProps = BaseProps & {
  selection: "multi"
  onChange: (value: string[]) => void
}

type Props = SingleProps | MultiProps

// ===================================================
// Component
// ===================================================
export default function GenericSelector(props: Props) {
  const { title, table, selection, onChange } = props

  const [items, setItems] = useState<Item[]>([])
  const [selected, setSelected] = useState<string | string[] | null>(
    selection === "single" ? null : []
  )

  // ===================================================
  // 🔹 Supabase マスタ読み込み
  // ===================================================
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("is_active", true)
        .order("label", { ascending: true })

      if (error) {
        console.error(`GenericSelector load error (${table}):`, error)
        return
      }

      setItems((data ?? []) as Item[])
    }

    load()
  }, [table])

  // ===================================================
  // 🔹 選択トグル
  // ===================================================
  const toggle = (id: string) => {
    if (selection === "single") {
      const next = selected === id ? null : id
      setSelected(next)
      onChange(next)
      return
    }

    // multi 選択
    const prev = Array.isArray(selected) ? selected : []
    const next = prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]

    setSelected(next)
    onChange(next)
  }

  const isSelected = (id: string) =>
    selection === "single"
      ? selected === id
      : Array.isArray(selected) && selected.includes(id)

  // ===================================================
  // 🔹 選択中項目の説明文を生成（single & multi 対応）
  // ===================================================
  const selectedDescriptions = (() => {
    if (!items.some((i) => i.description)) return null

    if (selection === "single") {
      const found = items.find((i) => i.id === selected)
      return found?.description ?? null
    }

    // multi: 選択した複数 description を結合
    const selectedIds = Array.isArray(selected) ? selected : []
    const descs = selectedIds
      .map((id) => items.find((i) => i.id === id)?.description)
      .filter(Boolean)

    if (descs.length === 0) return null
    return descs.join(" / ")
  })()

  // ===================================================
  // 🔹 UI
  // ===================================================
  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">{title}</h2>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={isSelected(item.id)}
            onClick={() => toggle(item.id)}
          />
        ))}
      </div>

      {/* 🔥 description がある項目のみ説明文表示 */}
      {selectedDescriptions && (
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          {selectedDescriptions}
        </p>
      )}
    </div>
  )
}