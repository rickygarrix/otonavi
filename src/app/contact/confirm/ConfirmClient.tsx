'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Eraser, Send } from 'lucide-react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export default function ConfirmClient() {
  const router = useRouter();
  const [form, setForm] = useState<ContactForm | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (!stored) {
      router.replace('/contact');
      return;
    }
    setForm(JSON.parse(stored));
  }, [router]);

  const submit = async () => {
    if (!form || !agreed || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // 必要なら res.json() してメッセージ表示
        throw new Error('送信に失敗しました');
      }

      sessionStorage.setItem('contactFormSubmitted', JSON.stringify(form));
      sessionStorage.removeItem('contactForm'); // 入力用は消す

      router.push('/contact/complete');
    } catch {
      setSending(false);
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  if (!form) return null;

  const styles = {
    step: 'flex items-center justify-center w-16 h-16 z-10',
    wrapper: 'flex flex-col gap-2',
    label: 'flex gap-1 text-sm',
    inputDisabled:
      'px-4 py-3 bg-dark-5/10 rounded-3xl outline outline-1 outline-offset-[-1px] text-dark-5/50 outline-dark-5/10 text-md',
    textareaDisabled:
      'min-h-40 px-4 py-3 bg-dark-5/10 rounded-3xl outline outline-1 outline-offset-[-1px] outline-dark-5/10 text-dark-5/50 text-md',
  };

  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />

      {/* ===== Stepper ===== */}
      <div className="relative flex h-20 items-center justify-between pr-4 pl-24">
        <div className={styles.step}>
          <div className="bg-light-5 h-4 w-4 rounded-full" />
        </div>
        <div className={styles.step}>
          <div className="outline-blue-2 bg-blue-4 text-light-1 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold outline-4">
            確認
          </div>
        </div>
        <div className={styles.step}>
          <div className="bg-light-5 h-4 w-4 rounded-full" />
        </div>
        <div className="via-blue-3 from-light-5 to-light-5 absolute right-12 left-32 h-[2px] bg-gradient-to-r" />
      </div>

      {/* 本文 */}
      <main>
        {/* Intro */}
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl leading-[1.5] font-bold tracking-widest">
            お問い合わせ内容の確認
          </h1>

          <p className="text-justify text-sm leading-[1.8]">
            入力した内容に間違いがないかご確認ください。
          </p>
        </section>

        {/* Form */}
        <form className="bg-light-2 flex flex-col gap-4 px-6 pt-10 pb-20">
          {/* お名前 */}
          <div className={styles.wrapper}>
            <div className={styles.label}>
              <span>お名前</span>
              <span className="text-red-4" aria-hidden>
                *
              </span>
              <span className="sr-only">必須</span>
            </div>

            <div className={styles.inputDisabled}>{form.name}</div>
          </div>

          {/* メールアドレス */}
          <div className={styles.wrapper}>
            <div className={styles.label}>
              <span>メールアドレス</span>
              <span className="text-red-4" aria-hidden>
                *
              </span>
              <span className="sr-only">必須</span>
            </div>

            <div className={styles.inputDisabled}>{form.email}</div>
          </div>

          {/* お問い合わせ内容 */}
          <div className={styles.wrapper}>
            <div className={styles.label}>
              <span>お問い合わせ内容</span>
              <span className="text-red-4" aria-hidden>
                *
              </span>
              <span className="sr-only">必須</span>
            </div>

            <div className={styles.textareaDisabled}>{form.message}</div>
          </div>

          {/* プライバシーポリシー */}
          <label className="outline-light-5 flex items-center gap-4 rounded-lg p-4 text-sm outline outline-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
            />

            <span className="border-dark-1 peer-checked:border-blue-5 peer-checked:bg-blue-4 flex h-5 w-5 items-center justify-center rounded-sm border bg-white transition">
              <Check className="h-4 w-4 text-white" strokeWidth={3.0} />
            </span>

            <span>
              <a href="/privacy" className="text-blue-4 underline">
                プライバシーポリシー
              </a>
              に同意します。
            </span>
          </label>

          {/* ボタン */}
          <div className="mt-4 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="from-light-2 to-light-1 border-light-4 text-dark-4 active:shadow-dark-1/20 flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border bg-linear-to-t text-sm transition active:scale-102 active:shadow-sm"
            >
              書き直す
              <Eraser className="h-4 w-4" strokeWidth={1.2} />
            </button>

            <button
              type="button"
              disabled={!agreed || sending}
              onClick={submit}
              className={`from-dark-3 border-dark-4 to-dark-2 text-light-1 shadow-dark-3/50 flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border bg-linear-to-t text-sm shadow-xs transition ${!agreed || sending
                ? 'cursor-not-allowed opacity-40 backdrop-blur-lg'
                : 'active:scale-102 active:shadow-md'
                }`}
            >
              {sending ? '送信中…' : '送信'}
              <Send className="h-4 w-4" strokeWidth={1.2} />
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
