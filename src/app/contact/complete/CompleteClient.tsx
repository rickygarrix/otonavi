'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { House } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/button/Button';
import { contactStyles, Stepper } from '../ContactClient';

export default function CompleteClient() {
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactFormSubmitted');
    if (stored) {
      setForm(JSON.parse(stored));
      sessionStorage.removeItem('contactFormSubmitted');
    }
  }, []);

  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />
      <Stepper step={3} />

      <main>
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl leading-[1.5] font-bold tracking-widest">お問い合わせ完了</h1>
          <p className="text-justify text-sm leading-[1.8]">
            お問い合わせを受け付けました。確認用の自動送信メールが届いているかご確認ください。3営業日以内にメールにてお返事いたします。
          </p>
          <p className="text-dark-1 text-justify text-xs leading-[1.8]">
            メールが届いていない場合、迷惑メールフォルダをご確認いただくか、お手数ですが contact@otnv.jp に直接メールをお送りください。
          </p>
          <div className="mt-4 flex gap-4">
            <Button onClick={() => router.push('/')} label="ホームへ" leftIcon={House} />
          </div>
        </section>

        {form && (
          <div className="bg-light-2 flex flex-col gap-4 px-6 pt-10 pb-20">
            <h2 className="text-dark-5 text-md font-bold tracking-widest">送信内容</h2>
            <div className={contactStyles.wrapper}>
              <div className={contactStyles.label}><span>お名前</span><span className="text-red-4">*</span></div>
              <div className={contactStyles.inputDisabled}>{form.name}</div>
            </div>
            <div className={contactStyles.wrapper}>
              <div className={contactStyles.label}><span>メールアドレス</span><span className="text-red-4">*</span></div>
              <div className={contactStyles.inputDisabled}>{form.email}</div>
            </div>
            <div className={contactStyles.wrapper}>
              <div className={contactStyles.label}><span>お問い合わせ内容</span><span className="text-red-4">*</span></div>
              <div className={contactStyles.textareaDisabled}>{form.message}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}