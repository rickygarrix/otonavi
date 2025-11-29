"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type EventTrend = {
  id: string
  key: string
  label: string
  is_active: boolean
}

type Props = {
  onChange: (selectedKeys: string[]) => void
}

export default function EventTrendSelector({ onChange }: Props) {
  const [trends, setTrends] = useState<EventTrend[]>([])
  const [selected, setSelected] = useState<string[]>([])

  //-------------------------------------
  // 📌 Supabase → event_trend_definitions をロード
  //-------------------------------------
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("event_trend_definitions")
        .select("id, key, label, is_active")
        .eq("is_active", true)
        .order("label")

      if (error) {
        console.error("EventTrend load error:", error)
        return
      }

      setTrends(data ?? [])
      setSelected([])       // 初期化
      onChange([])          // 選択なしを返す
    }

    load()
  }, [onChange])

  //-------------------------------------
  // 📌 Chip 押された時のトグル処理
  //-------------------------------------
  const toggle = (id: string) => {
    let updated = []

    if (selected.includes(id)) {
      updated = selected.filter((x) => x !== id)
    } else {
      updated = [...selected, id]
    }

    setSelected(updated)

    // key を返す
    onChange(
      updated.map(
        (id) => trends.find((t) => t.id === id)!.key
      )
    )
  }

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        イベントの傾向
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {trends.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            selected={selected.includes(t.id)}
            onClick={() => toggle(t.id)}
          />
        ))}
      </div>
    </div>
  )
}