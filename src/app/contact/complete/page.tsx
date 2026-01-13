'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeButton from '@/components/ui/HomeButton';
import Footer from '@/components/ui/Footer';

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export default function ContactCompletePage() {
  const router = useRouter();
  const [form, setForm] = useState<ContactForm | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactFormSubmitted');
    if (stored) {
      setForm(JSON.parse(stored));
      sessionStorage.removeItem('contactFormSubmitted');
    }
  }, []);

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
      <header className="sticky top-0 z-100 flex h-20 w-full items-center gap-4 px-4">
        <HomeButton />
      </header>

      {/* ===== Stepper ===== */}
      <div className="relative flex h-20 items-center justify-between pr-4 pl-24">
        <div className={styles.step}>
          <div className="bg-light-5 h-4 w-4 rounded-full" />
        </div>
        <div className={styles.step}>
          <div className="bg-light-5 h-4 w-4 rounded-full" />
        </div>
        <div className={styles.step}>
          <div className="outline-blue-2 bg-blue-4 text-light-1 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold outline-4">
            完了
          </div>
        </div>
        <div className="from-light-5 to-blue-3 absolute right-12 left-32 h-[2px] bg-gradient-to-r" />
      </div>

      {/* 本文 */}
      <main>
        {/* Intro */}
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl leading-[1.5] font-bold tracking-widest">お問い合わせ完了</h1>

          <p className="text-justify text-sm leading-[1.8]">
            お問い合わせを受け付けました。確認用の自動送信メールが届いているかご確認ください。3営業日以内にメールにてお返事いたします。
          </p>

          <p className="text-dark-1 text-justify text-xs leading-[1.8]">
            メールが届いていない場合、迷惑メールフォルダをご確認いただくか、お手数ですが
            contact@otnv.jp に直接メールをお送りください。
          </p>

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="from-dark-3 border-dark-4 to-dark-2 text-light-1 shadow-dark-3/50 flex h-12 flex-2 items-center justify-center gap-2 rounded-lg border bg-linear-to-t text-sm shadow-xs transition active:scale-102 active:shadow-md"
            >
              ホームへ
            </button>
          </div>
        </section>

        {form && (
          <div className="bg-light-2 flex flex-col gap-4 px-6 pt-10 pb-20">
            <h2 className="text-dark-5 text-md font-bold tracking-widest">送信内容</h2>

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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
