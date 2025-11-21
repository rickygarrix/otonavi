'use client'

import { useEffect, useState } from 'react'
import PrefectureChip from './PrefectureChip'
import { supabase } from '@/lib/supabase'

type Prefecture = {
  id: string
  name_ja: string
  region: string | null
}

type Area = {
  id: string
  name: string
  prefecture_id: string
}

export default function AreaSelector() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null)
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)

  // ============================
  // ① 都道府県を取得
  // ============================
  useEffect(() => {
    const loadPrefectures = async () => {
      const { data, error } = await supabase
        .from('prefectures')
        .select('*')
        .order('code')

      if (error) {
        console.error(error)
        return
      }

      setPrefectures(data)

      // 初期選択 "東京都"
      const tokyo = data.find((p) => p.name_ja === '東京都') ?? null
      setSelectedPrefecture(tokyo)
    }

    loadPrefectures()
  }, [])

  // ============================
  // ② 都道府県選択 → エリアを取得
  // ============================
  useEffect(() => {
    const loadAreas = async () => {
      if (!selectedPrefecture) return

      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('prefecture_id', selectedPrefecture.id)
        .order('name')

      if (error) {
        console.error(error)
        return
      }

      setAreas(data)

      // 初期選択：渋谷区ぽいのがあれば選ぶ
      const first = data.find((a) => a.name.includes('渋谷')) ?? data[0] ?? null
      setSelectedArea(first)
    }

    loadAreas()
  }, [selectedPrefecture])

  // ============================
  // 都道府県をエリアでグルーピング
  // ============================
  const grouped = prefectures.reduce((acc: Record<string, Prefecture[]>, p) => {
    const region = p.region ?? 'その他'
    if (!acc[region]) acc[region] = []
    acc[region].push(p)
    return acc
  }, {})

  return (
    <div className="w-full px-6 py-6">

      {/* タイトル */}
      <h2 className="text-lg font-bold text-slate-900 mb-2">店舗情報</h2>

      <div className="text-slate-500 text-sm mb-6">
        エリア
        <span className="text-blue-600 font-medium">
          {selectedPrefecture?.name_ja} {selectedArea?.name ?? ''}
        </span>
      </div>

      {/* ============================= */}
      {/* 都道府県一覧（グループ別） */}
      {/* ============================= */}
      {Object.entries(grouped).map(([region, list]) => (
        <div key={region} className="mb-8">
          <h3 className="font-semibold text-slate-800 mb-3">{region}</h3>

          <div className="grid grid-cols-3 gap-3">
            {list.map((p) => (
              <PrefectureChip
                key={p.id}
                label={p.name_ja}
                selected={selectedPrefecture?.id === p.id}
                onClick={() => {
                  setSelectedPrefecture(p)
                  setSelectedArea(null)
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* ============================= */}
      {/* 選択された都道府県のエリア一覧 */}
      {/* ============================= */}
      {selectedPrefecture && (
        <>
          <h3 className="font-semibold text-slate-800 mb-3 mt-4">
            {selectedPrefecture.name_ja} のエリア
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {areas.map((a) => (
              <PrefectureChip
                key={a.id}
                label={a.name}
                selected={selectedArea?.id === a.id}
                onClick={() => setSelectedArea(a)}
              />
            ))}
          </div>

        </>
      )}
    </div>
  )
}