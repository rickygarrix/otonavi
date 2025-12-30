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

const SPECIAL_2COL_LABELS = [
  "ノンアルコール",
  "ソフトドリンク",
  "オリジナルドリンク",
  "スパークリング",
] as const

type SpecialLabel = typeof SPECIAL_2COL_LABELS[number]

const WATER_LABEL = "水無料"

const isSpecialLabel = (label: string): label is SpecialLabel => {
  return (SPECIAL_2COL_LABELS as readonly string[]).includes(label)
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
        .select("key, label")
        .eq("is_active", true)

      if (error) {
        console.error("DrinkSelector load error:", error)
        return
      }

      setItems((data ?? []) as DrinkDefinition[])
    }

    load()
  }, [])

  const { normalDrinks, specialDrinks, waterDrink } = useMemo(() => {
    const normal: DrinkDefinition[] = []
    const special: DrinkDefinition[] = []
    let water: DrinkDefinition | null = null

    for (const item of items) {
      if (item.label === WATER_LABEL) {
        water = item
      } else if (isSpecialLabel(item.label)) {
        special.push(item)
      } else {
        normal.push(item)
      }
    }

    normal.sort((a, b) => a.label.localeCompare(b.label, "ja"))

    return {
      normalDrinks: normal,
      specialDrinks: special,
      waterDrink: water,
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
      <div className="grid grid-cols-3 gap-3">
        {normalDrinks.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            selected={selectedKeys.includes(item.key)}
            onClick={() => toggle(item.key)}
          />
        ))}
      </div>

      {specialDrinks.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {specialDrinks.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              selected={selectedKeys.includes(item.key)}
              onClick={() => toggle(item.key)}
            />
          ))}
        </div>
      )}

      {waterDrink && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Chip
            key={waterDrink.key}
            label={waterDrink.label}
            selected={selectedKeys.includes(waterDrink.key)}
            onClick={() => toggle(waterDrink.key)}
          />
        </div>
      )}
    </div>
  )
}