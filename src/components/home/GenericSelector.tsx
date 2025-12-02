"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

// -------------------------------
// マスタ型
// -------------------------------
type Item = {
  id: string
  key?: string | null
  label: string
  description?: string | null
  is_active: boolean
}

// -------------------------------
// Props
// -------------------------------
type BaseProps = {
  title: string
  table: string
  columns?: 2 | 3             // ★ ここで列数指定可能
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

// -------------------------------
// Component
// -------------------------------
export default function GenericSelector(props: Props) {
  const { title, table, selection, onChange, columns = 2 } = props
  // ★ columns のデフォルトは 2 列

  const [items, setItems] = useState<Item[]>([])

  const [selected, setSelected] = useState<string | string[] | null>(
    selection === "single" ? null : []
  )

  // -------------------------------
  // マスタ読込
  // -------------------------------
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

  // -------------------------------
  // テーブル切替時に値をリセット
  // -------------------------------
  useEffect(() => {
    if (selection === "single") {
      setSelected(null)
      onChange(null)
    } else {
      setSelected([])
      onChange([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  // -------------------------------
  // 選択トグル
  // -------------------------------
  const toggle = (id: string) => {
    if (selection === "single") {
      const next = selected === id ? null : id
      setSelected(next)
      onChange(next)
      return
    }

    const prev = Array.isArray(selected) ? selected : []
    const next = prev.includes(id)
      ? prev.filter((v) => v !== id)
      : [...prev, id]

    setSelected(next)
    onChange(next)
  }

  // 選択判定
  const isSelected = (id: string) =>
    selection === "single"
      ? selected === id
      : Array.isArray(selected) && selected.includes(id)

  // -------------------------------
  // description 表示
  // -------------------------------
  const selectedDescriptions = (() => {
    if (!items.some((i) => i.description)) return null

    if (selection === "single") {
      const found = items.find((i) => i.id === selected)
      return found?.description ?? null
    }

    const ids = Array.isArray(selected) ? selected : []
    const descs = ids
      .map((id) => items.find((i) => i.id === id)?.description)
      .filter(Boolean)

    return descs.length > 0 ? descs.join(" / ") : null
  })()

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">{title}</h2>

      {/* ★ ここで 2列 / 3列 切り替え */}
      <div className={`grid gap-3 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={isSelected(item.id)}
            onClick={() => toggle(item.id)}
          />
        ))}
      </div>

      {selectedDescriptions && (
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          {selectedDescriptions}
        </p>
      )}
    </div>
  )
}