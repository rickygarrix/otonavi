'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ArrowRight } from 'lucide-react';

import Header from '@/components/ui/Header';
import HomeButton from '@/components/ui/HomeButton';
import Footer from '@/components/ui/Footer';

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const router = useRouter();

  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });

  // ★ confirm から戻ったとき用：値を復元
  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (stored) {
      try {
        setForm(JSON.parse(stored));
      } catch {
        // JSON壊れてたら無視
      }
    }
  }, []);

  const isValid = Boolean(form.name && form.email && form.message);

  const handleConfirm = () => {
    sessionStorage.setItem('contactForm', JSON.stringify(form));
    router.push('/contact/confirm');
  };

  const styles = {
    step: 'flex items-center justify-center w-16 h-16 z-10',
    wrapper: 'flex flex-col gap-2',
    label: 'flex gap-1 text-sm',
    input:
      'h-12 px-4 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base',
    textarea:
      'min-h-40 px-4 py-3 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base resize-none',
  };

  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />

      {/* ===== Stepper ===== */}
      <div className="relative flex h-20 items-center justify-between pr-4 pl-24">
        <div className={styles.step}>
          <div className="outline-blue-2 bg-blue-4 text-light-1 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold outline-4">
            入力
          </div>
        </div>
        <div className={styles.step}>
          <div className="bg-light-5 h-4 w-4 rounded-full" />
        </div>
        <div className={styles.step}>
          <div className="bg-light-5 h-4 w-4 rounded-full" />
        </div>
        <div className="from-blue-3 to-light-5 absolute right-12 left-32 h-[2px] bg-gradient-to-r" />
      </div>

      {/* ===== Main Content ===== */}
      <main>
        {/* Intro */}
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl leading-[1.5] font-bold tracking-widest">お問い合わせ</h1>

          <p className="text-justify text-sm leading-[1.8]">
            オトナビについてのご質問や店舗情報に関するご相談など、お気軽にお問い合わせください。3営業日以内にメールにてお返事いたします。
          </p>
        </section>

        {/* Form */}
        <div className="bg-light-2 flex flex-col gap-4 px-6 pt-10 pb-20">
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

              <p id="message-help" className="text-gray-4 text-xs leading-[1.5]">
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

          <div className="mt-4 flex gap-4">
            <button
              type="button"
              disabled={!isValid}
              onClick={handleConfirm}
              className={`from-dark-3 border-dark-4 to-dark-2 text-light-1 shadow-dark-3/50 flex h-12 flex-2 items-center justify-center gap-2 rounded-lg border bg-linear-to-t text-sm shadow-xs transition active:scale-102 active:shadow-md ${!isValid ? 'opacity-40' : ''}`}
            >
              内容確認へ
              <ArrowRight className="h-4 w-4" strokeWidth={1.2} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
