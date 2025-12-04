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
  columns?: 2 | 3
}

type SingleProps = BaseProps & {
  selection: "single"
  onChange: (value: string | null) => void   // ★ label を返す
}

type MultiProps = BaseProps & {
  selection: "multi"
  onChange: (value: string[]) => void        // ★ label の配列を返す
}

type Props = SingleProps | MultiProps

// -------------------------------
export default function GenericSelector(props: Props) {
  const { title, table, selection, onChange, columns = 2 } = props

  const [items, setItems] = useState<Item[]>([])
  const [selectedIds, setSelectedIds] = useState<string[] | string | null>(
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
      setSelectedIds(null)
      onChange(null)
    } else {
      setSelectedIds([])
      onChange([])
    }
  }, [table])

  // -------------------------------
  // id → label に変換
  // -------------------------------
  const convertToLabels = (ids: string[] | string | null) => {
    if (!ids) return null

    if (typeof ids === "string") {
      return items.find((i) => i.id === ids)?.label ?? null
    }

    return ids
      .map((id) => items.find((i) => i.id === id)?.label)
      .filter(Boolean) as string[]
  }

  // -------------------------------
  // 選択トグル（ID を保持）＋ label を外に返す
  // -------------------------------
  const toggle = (id: string) => {
    if (selection === "single") {
      const nextId = selectedIds === id ? null : id
      setSelectedIds(nextId)

      // ★ label を返す
      onChange(convertToLabels(nextId) as string | null)
      return
    }

    const prev = Array.isArray(selectedIds) ? selectedIds : []
    const nextIds = prev.includes(id)
      ? prev.filter((v) => v !== id)
      : [...prev, id]

    setSelectedIds(nextIds)

    // ★ label 配列を返す
    onChange(convertToLabels(nextIds) as string[])
  }

  const isSelected = (id: string) =>
    selection === "single"
      ? selectedIds === id
      : Array.isArray(selectedIds) && selectedIds.includes(id)

  // -------------------------------
  // description 表示
  // -------------------------------
  const selectedDescriptions = (() => {
    const labels = convertToLabels(selectedIds)

    if (!items.some((i) => i.description)) return null

    if (selection === "single") {
      const id = selectedIds as string | null
      const found = items.find((i) => i.id === id)
      return found?.description ?? null
    }

    const ids = Array.isArray(selectedIds) ? selectedIds : []
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