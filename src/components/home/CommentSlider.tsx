"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Comment = {
  id: number
  comment: string
}

type Phase = "enter" | "stay" | "leave"

export default function CommentSlider() {
  const [comments, setComments] = useState<Comment[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("enter")

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

  useEffect(() => {
    if (comments.length === 0) return

    setPhase("enter")

    const stayTimer = setTimeout(() => {
      setPhase("stay")
    }, 300)

    const leaveTimer = setTimeout(() => {
      setPhase("leave")
    }, 2500)

    const nextTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % comments.length)
    }, 3000)

    return () => {
      clearTimeout(stayTimer)
      clearTimeout(leaveTimer)
      clearTimeout(nextTimer)
    }
  }, [index, comments.length])

  const current = comments[index]?.comment ?? ""

  return (
    <div className="h-[40px] flex items-center justify-center overflow-hidden">
      <div
        className={`
          bg-black/50 px-4 py-1 rounded-full
          text-white text-sm font-medium
          transition-all duration-300 ease-in-out

          ${phase === "enter"
            ? "opacity-0 -translate-y-4"
            : phase === "stay"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }
        `}
      >
        {current}
      </div>
    </div>
  )
}