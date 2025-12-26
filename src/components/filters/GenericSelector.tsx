"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

// -------------------------------
// 型
// -------------------------------
type Item = {
  id: string
  key: string
  label: string
  description?: string | null // ★ optional のまま
  is_active: boolean
}

type BaseProps = {
  title: string
  table: string
  columns?: 2 | 3
  sectionRef?:
  | React.RefObject<HTMLDivElement | null>
  | React.RefCallback<HTMLDivElement>
  | null
  clearKey?: number
}

type SingleProps = BaseProps & {
  selection: "single"
  onChange?: (value: string | null) => void
}

type MultiProps = BaseProps & {
  selection: "multi"
  onChange?: (value: string[]) => void
}

type Props = SingleProps | MultiProps

// -------------------------------
export default function GenericSelector(props: Props) {
  const {
    title,
    table,
    selection,
    onChange,
    columns = 2,
    sectionRef,
    clearKey,
  } = props

  const [items, setItems] = useState<Item[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[] | string | null>(
    selection === "single" ? null : []
  )

  // -------------------------------
  // マスタ読込（★ description を select しない）
  // -------------------------------
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from(table)
        .select("id, key, label, is_active")
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
  // クリア
  // -------------------------------
  useEffect(() => {
    if (clearKey === undefined) return

    if (selection === "single") {
      setSelectedKeys(null)
      onChange?.(null)
    } else {
      setSelectedKeys([])
      onChange?.([])
    }
  }, [clearKey, selection, onChange])

  // -------------------------------
  // toggle（key ベース）
  // -------------------------------
  const toggle = (key: string) => {
    if (selection === "single") {
      const next = selectedKeys === key ? null : key
      setSelectedKeys(next)
      onChange?.(next)
      return
    }

    const prev = Array.isArray(selectedKeys) ? selectedKeys : []
    const next = prev.includes(key)
      ? prev.filter((v) => v !== key)
      : [...prev, key]

    setSelectedKeys(next)
    onChange?.(next)
  }

  const isSelected = (key: string) =>
    selection === "single"
      ? selectedKeys === key
      : Array.isArray(selectedKeys) && selectedKeys.includes(key)

  // -------------------------------
  // description（存在する時だけ）
  // -------------------------------
  const selectedDescriptions = (() => {
    if (!items.some((i) => i.description)) return null

    if (selection === "single") {
      const key = selectedKeys as string | null
      return items.find((i) => i.key === key)?.description ?? null
    }

    const keys = Array.isArray(selectedKeys) ? selectedKeys : []
    const descs = keys
      .map((k) => items.find((i) => i.key === k)?.description)
      .filter(Boolean)

    return descs.length ? descs.join(" / ") : null
  })()

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="w-full px-6 py-6">
      <div ref={sectionRef ?? null} className="scroll-mt-[90px]" />

      <h2 className="text-lg font-bold text-slate-900 mb-6">
        {title}
      </h2>

      <div
        className={`grid gap-3 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"
          }`}
      >
        {items.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            selected={isSelected(item.key)}
            onClick={() => toggle(item.key)}
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