"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Comment = {
  id: number
  comment: string
}

export default function CommentSlider() {
  const [comments, setComments] = useState<Comment[]>([])
  const [index, setIndex] = useState(0)
  const [anim, setAnim] = useState<"enter" | "leave">("enter")

  useEffect(() => {
    const load = async () => {
      const res = await supabase.from("comments").select("*").order("id")
      if (!res.data) return
      setComments(res.data)
    }
    load()
  }, [])

  // ループアニメーション
  useEffect(() => {
    if (comments.length === 0) return

    const timer = setInterval(() => {
      // 下に消える
      setAnim("leave")

      // leave完了後に次のコメントをセット
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % comments.length)

        // 必ず「上から出てくる」
        setAnim("enter")
      }, 300)
    }, 3000)

    return () => clearInterval(timer)
  }, [comments])

  const current = comments[index]?.comment ?? ""

  return (
    <div className="relative h-[40px] flex justify-center items-center">
      <div
        className={`
          absolute text-white text-sm font-medium
          transition-all duration-300

          ${anim === "enter"
            ? "opacity-100 -translate-y-3" // ← 上から出てくる
            : "opacity-0 translate-y-3"     // ← 下へ消えていく
          }
        `}
      >
        {current}
      </div>
    </div>
  )
}