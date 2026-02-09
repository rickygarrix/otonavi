import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

type ContactBody = {
  name: string
  email: string
  message: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactBody
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "invalid" }, { status: 400 })
    }

    const from = "オトナビ <noreply@send.otnv.jp>"

    await resend.emails.send({
      from,
      to: process.env.CONTACT_ADMIN_EMAIL!,
      subject: "【お問い合わせ】新着",
      html: `
        <p><strong>名前</strong><br />${name}</p>
        <p><strong>メールアドレス</strong><br />${email}</p>
        <p><strong>お問い合わせ内容</strong><br />${message.replace(/\n/g, "<br />")}</p>
      `,
    })

    await resend.emails.send({
      from,
      to: email,
      subject: "【オトナビ】お問い合わせを受け付けました",
      html: `
        <p>${name} 様</p>
        <p>
          以下の内容でお問い合わせを受け付けました。<br />
          内容を確認のうえ、<strong>3営業日以内</strong>にご連絡いたします。
        </p>
        <p><strong>■ お名前</strong><br />${name}</p>
        <p><strong>■ メールアドレス</strong><br />${email}</p>
        <p><strong>■ お問い合わせ内容</strong><br />${message.replace(/\n/g, "<br />")}</p>
        <p>オトナビ運営</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}