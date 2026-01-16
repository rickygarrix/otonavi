"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Comment = {
  id: number
  comment: string
}

type Phase = "stay" | "leave"

export default function CommentSlider() {
  const [comments, setComments] = useState<Comment[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("stay")

  // コメント取得
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .order("id")

      if (data) setComments(data)
    }

    load()
  }, [])

  // フェーズ制御
  useEffect(() => {
    if (comments.length === 0) return

    const timer = setTimeout(() => {
      setPhase("leave")
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % comments.length)
        setPhase("stay")
      }, 1000) // duration-1000 と一致
    }, 3000)

    return () => clearTimeout(timer)
  }, [index, comments.length])

  const current = comments[index]?.comment ?? ""
  const next = comments[(index + 1) % comments.length]?.comment ?? ""

  return (
    <div className="relative w-full h-8 flex items-center justify-center text-[10px] tracking-widest overflow-hidden">
      
      <div
        className={`absolute ease-in-out
          ${phase === "stay"
            ? "transition-none opacity-0 -translate-y-8"
            : "transition-all duration-1000 opacity-100 translate-y-0"
          }
        `}
      >
        {next}
      </div>
      
      <div
        className={`absolute ease-in-out
          ${phase === "stay"
            ? "transition-none opacity-100 translate-y-0"
            : "transition-all duration-1000 opacity-0 translate-y-8"
          }
        `}
      >
        {current}
      </div>

    </div>
  )
}