"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"
import type { DrinkDefinition } from "@/types/master"

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
  const [items, setItems] = useState<DrinkDefinition[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    onChange(selectedKeys)
  }, [selectedKeys, onChange])

  useEffect(() => {
    setSelectedKeys([])
  }, [clearKey])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("drink_definitions")
        .select("key, label, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) {
        console.error("DrinkSelector load error:", error)
        return
      }

      setItems(data ?? [])
    }

    load()
  }, [])

  const { normalDrinks, specialDrinks } = useMemo(() => {
    return {
      normalDrinks: items.filter(
        (i) => (i.display_order ?? 0) < 90
      ),
      specialDrinks: items.filter(
        (i) => (i.display_order ?? 0) >= 90
      ),
    }
  }, [items])

  const toggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        {title}
      </h2>

      <div className="flex flex-col gap-y-6">
        {/* 通常ドリンク（3列） */}
        {normalDrinks.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {normalDrinks.map((item) => (
              <Chip
              key={item.key}
              label={item.label}
              selected={selectedKeys.includes(item.key)}
              onChange={() => toggle(item.key)}
            />
            ))}
          </div>
        )}

        {/* 特殊ドリンク（2列・下段） */}
        {specialDrinks.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {specialDrinks.map((item) => (
              <Chip
              key={item.key}
              label={item.label}
              selected={selectedKeys.includes(item.key)}
              onChange={() => toggle(item.key)}
            />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}