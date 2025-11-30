"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

// ===================================================
// マスタ行
// ===================================================
type Item = {
  id: string
  key?: string | null            // store_types など key が無いテーブル対応
  label: string
  description?: string | null    // 🔥 price_range_definitions に対応
  is_active: boolean
}

// ===================================================
// Props
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

  // ---------------------------------------------------
  // 🔹 Supabase からマスタ読み込み
  // ---------------------------------------------------
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

      setItems(data ?? [])
    }

    load()
  }, [table])

  // ---------------------------------------------------
  // 🔹 選択トグル
  // ---------------------------------------------------
  const toggle = (id: string) => {
    if (selection === "single") {
      const next = selected === id ? null : id
      setSelected(next)
      onChange(next as string | null)
      return
    }

    // multi
    const prevArr = Array.isArray(selected) ? selected : []
    const next = prevArr.includes(id)
      ? prevArr.filter((x) => x !== id)
      : [...prevArr, id]

    setSelected(next)
    onChange(next as string[])
  }

  const isSelected = (id: string) => {
    if (selection === "single") return selected === id
    return Array.isArray(selected) && selected.includes(id)
  }

  // ---------------------------------------------------
  // 🔹 UI
  // ---------------------------------------------------
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

      {/* 🔥 description があるマスタは説明文を表示 */}
      {items.some((i) => i.description) && (
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          {items.find((i) => isSelected(i.id))?.description ??
            "※補足説明はありません"}
        </p>
      )}
    </div>
  )
}