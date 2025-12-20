"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type DrinkItem = {
  id: string
  key: string
  label: string
  is_active: boolean
}

type Props = {
  title: string
  onChange: (keys: string[]) => void
  clearKey: number
}

export default function DrinkSelector({
  title,
  onChange,
  clearKey,
}: Props) {
  const [items, setItems] = useState<DrinkItem[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // ============================
  // 選択変更 → 親に通知
  // ============================
  useEffect(() => {
    onChange(selectedKeys)
  }, [selectedKeys, onChange])

  // ============================
  // クリア同期
  // ============================
  useEffect(() => {
    setSelectedKeys([])
    onChange([])
  }, [clearKey, onChange])

  // ============================
  // マスタ読込
  // ============================
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("drink_definitions")
        .select("id, key, label, is_active")
        .eq("is_active", true)
        .order("label", { ascending: true })

      if (error) {
        console.error("DrinkSelector load error:", error)
        return
      }

      setItems((data ?? []) as DrinkItem[])
    }

    load()
  }, [])

  // ============================
  // toggle
  // ============================
  const toggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={selectedKeys.includes(item.key)}
            onClick={() => toggle(item.key)}
          />
        ))}
      </div>
    </div>
  )
}