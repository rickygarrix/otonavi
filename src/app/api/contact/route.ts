import { NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "@/lib/supabaseServer"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "invalid" }, { status: 400 })
    }

    // =========================
    // ① Supabase 保存
    // =========================
    const { error: insertError } = await supabase
      .from("contacts")
      .insert({
        name,
        email,
        message,
      })

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      return NextResponse.json({ error: "db error" }, { status: 500 })
    }

    // =========================
    // ② 管理者通知
    // =========================
    await resend.emails.send({
      from: `Otonavi <${process.env.RESEND_FROM_EMAIL}>`,
      to: process.env.CONTACT_ADMIN_EMAIL!,
      subject: "【お問い合わせ】新着",
      html: `
        <p>名前：${name}</p>
        <p>メール：${email}</p>
        <p>${message}</p>
      `,
    })

    // =========================
    // ③ ユーザー自動返信
    // =========================
    await resend.emails.send({
      from: `Otonavi <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "【オトナビ】お問い合わせありがとうございます",
      html: `
        <p>${name} 様</p>
        <p>お問い合わせありがとうございます。</p>
        <p>内容を確認の上、3営業日以内にご連絡いたします。</p>
        <hr />
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}