"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

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

  const handleConfirm = () => {
    // sessionStorage に保存
    sessionStorage.setItem("contactForm", JSON.stringify(form))
    router.push("/contact/confirm")
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">お問い合わせ</h1>

      <input
        className="input w-full"
        placeholder="お名前"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="input w-full mt-4"
        placeholder="メールアドレス"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <textarea
        className="textarea w-full mt-4"
        placeholder="お問い合わせ内容"
        rows={6}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <button
        className="btn-primary mt-6 w-full"
        onClick={handleConfirm}
        disabled={!form.name || !form.email || !form.message}
      >
        内容確認へ →
      </button>
    </div>
  )
}