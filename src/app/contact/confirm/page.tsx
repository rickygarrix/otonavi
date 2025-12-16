"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type ContactForm = {
  name: string
  email: string
  message: string
}

export default function ContactConfirmPage() {
  const router = useRouter()
  const [form, setForm] = useState<ContactForm | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("contactForm")
    if (!stored) {
      router.replace("/contact")
      return
    }
    setForm(JSON.parse(stored))
  }, [router])

  const submit = async () => {
    if (!form) return

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    sessionStorage.removeItem("contactForm")
    router.push("/contact/complete")
  }

  if (!form) return null

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">内容確認</h1>

      <p><strong>お名前：</strong>{form.name}</p>
      <p className="mt-2"><strong>メール：</strong>{form.email}</p>

      <p className="mt-4 whitespace-pre-wrap">
        <strong>お問い合わせ内容：</strong><br />
        {form.message}
      </p>

      <div className="mt-6 space-y-3">
        <button
          className="btn-primary w-full"
          onClick={submit}
        >
          送信する
        </button>

        <button
          className="btn-secondary w-full"
          onClick={() => router.back()}
        >
          戻る
        </button>
      </div>
    </div>
  )
}