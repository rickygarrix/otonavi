"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import HomeButton from "@/components/ui/HomeButton"
import Footer from "@/components/Footer"

type ContactForm = {
  name: string
  email: string
  message: string
}

export default function ContactConfirmPage() {
  const router = useRouter()
  const [form, setForm] = useState<ContactForm | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("contactForm")
    if (!stored) {
      router.replace("/contact")
      return
    }
    setForm(JSON.parse(stored))
  }, [router])

  const submit = async () => {
    if (!form || !agreed || sending) return

    try {
      setSending(true)

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      // ★ ここでは消さない
      router.push("/contact/complete")
    } finally {
      setSending(false)
    }
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-Brand-Light-2">
      {/* 固定ヘッダー */}
      <div className="fixed top-0 left-0 right-0 z-50 h-20 px-4 flex items-center gap-4 bg-white/70 backdrop-blur">
        <HomeButton onHome={() => router.push("/")} />
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <div className="w-16 h-[2px] bg-slate-200" />
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            確認
          </div>
          <div className="w-16 h-[2px] bg-blue-400" />
          <div className="w-3 h-3 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* ヘッダー余白 */}
      <div className="h-20" />

      {/* 本文 */}
      <div className="px-6 py-10 flex flex-col gap-6">
        <h1 className="text-xl font-bold tracking-widest text-Brand-Dark-1">
          お問い合わせ内容の確認
        </h1>
        <p className="text-sm text-Brand-Dark-1">
          入力した内容に間違いがないかご確認ください。
        </p>

        {/* 名前 */}
        <div>
          <label className="text-sm">お名前 *</label>
          <div className="h-12 px-4 rounded-3xl bg-slate-200 flex items-center">
            {form.name}
          </div>
        </div>

        {/* メール */}
        <div>
          <label className="text-sm">メールアドレス *</label>
          <div className="h-12 px-4 rounded-3xl bg-slate-200 flex items-center">
            {form.email}
          </div>
        </div>

        {/* 内容 */}
        <div>
          <label className="text-sm">お問い合わせ内容 *</label>
          <div className="min-h-[160px] px-4 py-3 rounded-2xl bg-slate-200 whitespace-pre-wrap">
            {form.message}
          </div>
        </div>

        {/* 同意 */}
        <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white outline outline-1 outline-slate-300 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5"
          />
          <span>
            <a href="/privacy" className="text-blue-600 underline">
              プライバシーポリシー
            </a>
            に同意します。
          </span>
        </label>

        {/* ★ ボタン：プライバシーの下 & Footerの上 */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          {/* 書き直す */}
          <button
            onClick={() => router.back()}
            className="
      h-12 rounded-xl
      bg-white
      outline outline-1 outline-slate-300
      flex items-center justify-center gap-2
      text-sm text-Brand-Dark-1
    "
          >
            書き直す ✎
          </button>

          {/* 送信 */}
          <button
            disabled={!agreed || sending}
            onClick={submit}
            className={`
      h-12 rounded-xl
      bg-white
      outline outline-1 outline-slate-300
      flex items-center justify-center gap-2
      text-sm text-Brand-Dark-1
      ${!agreed || sending ? "opacity-40" : ""}
    `}
          >
            {sending ? "送信中…" : "送信 ✈"}
          </button>
        </div>
      </div>

      {/* Footerは普通に最後 */}
      <Footer />
    </div>
  )
}