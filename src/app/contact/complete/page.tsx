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

export default function ContactCompletePage() {
  const router = useRouter()
  const [form, setForm] = useState<ContactForm | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("contactForm")
    if (stored) {
      setForm(JSON.parse(stored))
      sessionStorage.removeItem("contactForm")
    }
  }, [])

  return (
    <div className="min-h-screen bg-Brand-Light-2 flex flex-col">
      {/* =========================
          固定ヘッダー（完了）
      ========================= */}
      <div className="fixed top-0 left-0 right-0 z-50 h-20 px-4 flex items-center gap-4 bg-white/70 backdrop-blur">
        <HomeButton onHome={() => router.push("/")} />

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <div className="w-16 h-[2px] bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <div className="w-16 h-[2px] bg-slate-200" />
          <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs font-bold outline outline-4 outline-indigo-300">
            完了
          </div>
        </div>
      </div>

      {/* ヘッダー余白 */}
      <div className="h-20" />

      {/* =========================
          完了メッセージ
      ========================= */}
      <div className="px-6 py-10 flex flex-col gap-6">
        <h1 className="text-xl font-bold tracking-widest text-Brand-Dark-1">
          お問い合わせ完了
        </h1>

        <p className="text-sm leading-6 text-Brand-Dark-1">
          お問い合わせを受け付けました。確認用の自動送信メールが
          届いているかご確認ください。
          <br />
          3営業日以内にメールにてお返事いたします。
        </p>

        <p className="text-xs leading-5 text-Brand-Dark-5">
          メールが届いていない場合、迷惑メールフォルダをご確認いただくか、
          お手数ですが contact@otnv.jp に直接メールをお送りください。
        </p>

        {/* ホームへ */}
        <button
          onClick={() => router.push("/")}
          className="
            w-full h-12
            flex items-center justify-center gap-2
            rounded-lg
            text-sm text-Brand-Light-1
            bg-gradient-to-b from-Brand-Dark-4 to-Brand-Dark-3
            outline outline-1 outline-offset-[-1px] outline-slate-300/50
          "
        >
          ホームへ
        </button>
      </div>

      {/* =========================
          ★ 送信内容（ホームボタンの下）
      ========================= */}
      {form && (
        <div className="px-6 pt-10 pb-20 bg-Brand-Light-2 flex flex-col gap-4">
          <h2 className="text-base font-bold tracking-wider text-Brand-Dark-1">
            送信内容
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-Brand-Dark-1">
              お名前 <span className="text-red-800">*</span>
            </label>
            <div className="h-12 px-4 rounded-3xl bg-slate-900/10 text-slate-900/50 flex items-center">
              {form.name}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-Brand-Dark-1">
              メールアドレス <span className="text-red-800">*</span>
            </label>
            <div className="h-12 px-4 rounded-3xl bg-slate-900/10 text-slate-900/50 flex items-center">
              {form.email}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-Brand-Dark-1">
              お問い合わせ内容 <span className="text-red-800">*</span>
            </label>
            <div className="min-h-[160px] px-4 py-3 rounded-2xl bg-slate-900/10 text-slate-900/50 whitespace-pre-wrap">
              {form.message}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          Footer（常に一番最後）
      ========================= */}
      <Footer />
    </div>
  )
}