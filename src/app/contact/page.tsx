"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import HomeButton from "@/components/ui/HomeButton"
import Footer from "@/components/Footer"

type ContactForm = {
  name: string
  email: string
  message: string
}

export default function ContactPage() {
  const router = useRouter()

  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  })

  const isValid = Boolean(form.name && form.email && form.message)

  const handleConfirm = () => {
    sessionStorage.setItem("contactForm", JSON.stringify(form))
    router.push("/contact/confirm")
  }

  return (
    <div className="min-h-screen bg-Brand-Light-2 flex flex-col">
      {/* ===== Fixed Header ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 h-20 px-4 flex items-center gap-4 bg-white/70 backdrop-blur">
        <HomeButton onHome={() => router.push("/")} />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            入力
          </div>
          <div className="w-16 h-[2px] bg-blue-400" />
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <div className="w-16 h-[2px] bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* Header Spacer */}
      <div className="h-20" />

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col">
        {/* Intro */}
        <div className="w-full px-6 py-10 flex flex-col items-center gap-6">
          <h1 className="w-full text-Brand-Dark-1 text-xl font-bold leading-8 tracking-widest">
            お問い合わせ
          </h1>

          <p className="w-full text-Brand-Dark-1 text-sm leading-6 text-justify">
            オトナビについてのご質問や店舗情報に関するご相談など、
            お気軽にお問い合わせください。
            <br />
            3営業日以内にメールにてお返事いたします。
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-20 flex flex-col gap-6">
          {/* お名前 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-Brand-Dark-1">
              <span>お名前</span>
              <span className="text-red-800">*</span>
            </div>

            <input
              className="w-full h-12 px-4 bg-Brand-Light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-Brand-Light-4 text-base"
              placeholder="音箱 太郎"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* メールアドレス */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-Brand-Dark-1">
              <span>メールアドレス</span>
              <span className="text-red-800">*</span>
            </div>

            <input
              className="w-full h-12 px-4 bg-Brand-Light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-Brand-Light-4 text-base"
              placeholder="otonavi@example.jp"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* お問い合わせ内容 */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-sm text-Brand-Dark-1">
                <span>お問い合わせ内容</span>
                <span className="text-red-800">*</span>
              </div>
              <p className="text-xs text-gray-500 leading-4">
                わかる範囲で概要をご記入ください。
              </p>
            </div>

            <textarea
              className="w-full min-h-[160px] px-4 py-3 bg-Brand-Light-1 rounded-2xl outline outline-1 outline-offset-[-1px] outline-Brand-Light-4 text-base resize-none"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          {/* 確認ボタン */}
          <button
            disabled={!isValid}
            onClick={handleConfirm}
            className={`w-full h-12 px-4 flex items-center justify-center gap-1 rounded-lg text-sm text-Brand-Light-1 bg-gradient-to-b from-Brand-Dark-4 to-Brand-Dark-3 outline outline-1 outline-offset-[-1px] outline-slate-300/50 transition ${!isValid ? "opacity-40" : ""
              }`}
          >
            内容確認へ →
          </button>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  )
}