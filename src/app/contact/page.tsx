"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import HomeButton from "@/components/ui/HomeButton"
import Footer from "@/components/ui/Footer"

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

  // ★ confirm から戻ったとき用：値を復元
  useEffect(() => {
    const stored = sessionStorage.getItem("contactForm")
    if (stored) {
      try {
        setForm(JSON.parse(stored))
      } catch {
        // JSON壊れてたら無視
      }
    }
  }, [])

  const isValid = Boolean(form.name && form.email && form.message)

  const handleConfirm = () => {
    sessionStorage.setItem("contactForm", JSON.stringify(form))
    router.push("/contact/confirm")
  }

  const styles = {
    step: "flex items-center justify-center w-16 h-16 z-10",
    wrapper: "flex flex-col gap-2",
    label: "flex gap-1 text-sm",
    input:
      "h-12 px-4 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base",
    textarea:
      "min-h-40 px-4 py-3 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base resize-none",
  }

  return (
    <div className="bg-light-1 text-dark-5">
      <HomeButton
        onHome={() => router.push("/")}
        className="fixed top-3 left-4 z-50"
      />

      {/* ===== Stepper ===== */}
      <div className="relative h-20 pl-24 pr-4 flex items-center justify-between">
        <div className={styles.step}>
          <div className="w-10 h-10 outline-4 outline-blue-2 rounded-full bg-blue-4 text-light-1 flex items-center justify-center text-xs font-bold">
            入力
          </div>
        </div>
        <div className={styles.step}>
          <div className="w-4 h-4 rounded-full bg-light-5" />
        </div>
        <div className={styles.step}>
          <div className="w-4 h-4 rounded-full bg-light-5" />
        </div>
        <div className="absolute left-32 right-12 h-[2px] bg-gradient-to-r from-blue-3 to-light-5" />
      </div>

      {/* ===== Main Content ===== */}
      <main>
        {/* Intro */}
        <section className="px-6 py-10">
          <h1 className="text-xl font-bold leading-[1.5] tracking-widest">
            お問い合わせ
          </h1>

          <p className="text-sm leading-[1.8] text-justify">
            オトナビについてのご質問や店舗情報に関するご相談など、お気軽にお問い合わせください。3営業日以内にメールにてお返事いたします。
          </p>
        </section>

        {/* Form */}
        <div className="px-6 pt-10 pb-20 flex flex-col gap-4 bg-light-2">
          {/* お名前 */}
          <div className={styles.wrapper}>
            <label htmlFor="name" className={styles.label}>
              <span>お名前</span>
              <span className="text-red-4" aria-hidden>
                *
              </span>
              <span className="sr-only">必須</span>
            </label>

            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className={styles.input}
              placeholder="音箱 太郎"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* メールアドレス */}
          <div className={styles.wrapper}>
            <label htmlFor="email" className={styles.label}>
              <span>メールアドレス</span>
              <span className="text-red-4" aria-hidden>
                *
              </span>
              <span className="sr-only">必須</span>
            </label>

            <input
              id="email"
              name="email"
              required
              autoComplete="email"
              className={styles.input}
              placeholder="otonavi@example.jp"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* お問い合わせ内容 */}
          <div className={styles.wrapper}>
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className={styles.label}>
                <span>お問い合わせ内容</span>
                <span className="text-red-4" aria-hidden>
                  *
                </span>
                <span className="sr-only">必須</span>
              </label>

              <p
                id="message-help"
                className="text-xs text-gray-4 leading-[1.5]"
              >
                わかる範囲で概要をご記入ください。
              </p>
            </div>

            <textarea
              id="message"
              name="message"
              required
              autoComplete="off"
              aria-describedby="message-help"
              className={styles.textarea}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          {/* 確認ボタン */}
          <button
            type="button"
            disabled={!isValid}
            onClick={handleConfirm}
            className={`h-12 px-4 flex items-center justify-center gap-1 rounded-lg text-sm text-Brand-Light-1 bg-gradient-to-b from-Brand-Dark-4 to-Brand-Dark-3 outline outline-1 outline-offset-[-1px] outline-slate-300/50 transition ${
              !isValid ? "opacity-40" : ""
            }`}
          >
            内容確認へ →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
