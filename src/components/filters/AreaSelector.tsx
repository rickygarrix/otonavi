"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"

type Prefecture = {
  id: string
  name_ja: string
}

type Area = {
  id: string
  name: string
  is_23ward: boolean
}

type Props = {
  clearKey: number
  onChange: (prefectureIds: string[], areaIds: string[]) => void
}

const TOKYO_NAME = "東京都"

export default function AreaSelector({ clearKey, onChange }: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  const [selectedPrefecture, setSelectedPrefecture] =
    useState<Prefecture | null>(null)
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)

  const [openPref, setOpenPref] = useState(false)
  const [openArea, setOpenArea] = useState(false)

  // ============================
  // 初期ロード
  // ============================
  useEffect(() => {
    supabase
      .from("prefectures")
      .select("id, name_ja")
      .order("code")
      .then(({ data }) => setPrefectures(data ?? []))
  }, [])

  // ============================
  // 東京判定
  // ============================
  const isTokyo = selectedPrefecture?.name_ja === TOKYO_NAME

  // ============================
  // 東京エリア取得
  // ============================
  useEffect(() => {
    if (!isTokyo || !selectedPrefecture) {
      setAreas([])
      setSelectedArea(null)
      return
    }

    supabase
      .from("areas")
      .select("id, name, is_23ward")
      .eq("prefecture_id", selectedPrefecture.id)
      .order("name")
      .then(({ data }) => setAreas(data ?? []))
  }, [isTokyo, selectedPrefecture])

  // ============================
  // clear 同期
  // ============================
  useEffect(() => {
    setSelectedPrefecture(null)
    setSelectedArea(null)
    onChange([], [])
  }, [clearKey, onChange])

  // ============================
  // handlers
  // ============================
  const selectPrefecture = (p: Prefecture) => {
    setSelectedPrefecture(p)
    setSelectedArea(null)
    setOpenPref(false)
    onChange([p.id], [])
  }

  const selectArea = (a: Area) => {
    setSelectedArea(a)
    setOpenArea(false)
    onChange(
      selectedPrefecture ? [selectedPrefecture.id] : [],
      [a.id]
    )
  }

  const wards = useMemo(() => areas.filter(a => a.is_23ward), [areas])
  const others = useMemo(() => areas.filter(a => !a.is_23ward), [areas])

  // ============================
  // 共通スタイル
  // ============================
  const buttonBase =
    "flex-1 h-12 px-4 bg-white rounded-[99px] outline outline-1 outline-offset-[-1px] outline-zinc-100 flex justify-between items-center gap-2 text-sm"

  const labelMuted = "text-gray-400"
  const labelActive = "text-gray-800"

  const pickerBase =
    "absolute z-50 mt-2 w-full max-h-[320px] overflow-y-auto rounded-xl border bg-white shadow-lg"

  // ============================
  // UI
  // ============================
  return (
    <div className="w-full flex gap-2 relative">
      {/* ================= 都道府県 ================= */}
      <div className="relative flex-1">
        <button
          onClick={() => setOpenPref(v => !v)}
          className={buttonBase}
        >
          <span
            className={`line-clamp-1 ${selectedPrefecture ? labelActive : labelMuted
              }`}
          >
            {selectedPrefecture?.name_ja ?? "都道府県"}
          </span>

          <span className="text-gray-400">▾</span>
        </button>

        {openPref && (
          <div className={pickerBase}>
            {prefectures.map(p => (
              <button
                key={p.id}
                onClick={() => selectPrefecture(p)}
                className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-50"
              >
                {p.name_ja}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= 東京エリア ================= */}
      {isTokyo && (
        <div className="relative flex-1">
          <button
            onClick={() => setOpenArea(v => !v)}
            className={buttonBase}
          >
            <span
              className={`line-clamp-1 ${selectedArea ? labelActive : labelMuted
                }`}
            >
              {selectedArea?.name ?? "エリア"}
            </span>

            <span className="text-gray-400">▾</span>
          </button>

          {openArea && (
            <div className={pickerBase}>
              {wards.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-zinc-500">
                    東京23区
                  </div>
                  {wards.map(a => (
                    <button
                      key={a.id}
                      onClick={() => selectArea(a)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-50"
                    >
                      {a.name}
                    </button>
                  ))}
                </>
              )}

              {others.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-zinc-500">
                    その他
                  </div>
                  {others.map(a => (
                    <button
                      key={a.id}
                      onClick={() => selectArea(a)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-50"
                    >
                      {a.name}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}