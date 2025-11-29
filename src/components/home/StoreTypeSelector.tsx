'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Chip from '@/components/ui/Chip'

type StoreType = {
  id: string
  label: string
  is_active: boolean
}

type Props = {
  onChange: (type: string | null) => void
}

export default function StoreTypeSelector({ onChange }: Props) {
  const [types, setTypes] = useState<StoreType[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('store_types')
        .select('id, label, is_active')
        .eq('is_active', true)
        .order('label')

      if (error) {
        console.error(error)
        return
      }

      setTypes(data ?? [])
      setSelected(null)
      onChange(null)
    }

    load()
  }, [onChange])

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        店舗タイプ
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {types.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            selected={selected === t.id}
            onClick={() => {
              setSelected(t.id)
              onChange(t.label)
            }}
          />
        ))}
      </div>
    </div>
  )
}