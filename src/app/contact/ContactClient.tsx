'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/button/Button';

// 元のスタイルをそのまま外部化（UI維持のため）
export const contactStyles = {
  step: 'flex items-center justify-center w-16 h-16 z-10',
  wrapper: 'flex flex-col gap-2',
  label: 'flex gap-1 text-sm font-medium',
  input: 'h-12 px-4 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base focus:outline-blue-3 transition-all',
  textarea: 'min-h-40 px-4 py-3 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base resize-none focus:outline-blue-3 transition-all',
  inputDisabled: 'px-4 py-3 bg-dark-5/10 rounded-3xl outline outline-1 outline-offset-[-1px] text-dark-5/50 outline-dark-5/10 text-md',
  textareaDisabled: 'min-h-40 px-4 py-3 bg-dark-5/10 rounded-3xl outline outline-1 outline-offset-[-1px] outline-dark-5/10 text-dark-5/50 text-md',
};

// ステッパーを共通コンポーネントとして export
export function Stepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="relative flex h-20 items-center justify-between pr-4 pl-24">
      {[1, 2, 3].map((s) => (
        <div key={s} className={contactStyles.step}>
          {step === s ? (
            <div className={`${s === 1 ? 'ring-4 ring-blue-2' : 'outline-4 outline-blue-2'} bg-blue-4 text-light-1 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold`}>
              {s === 1 ? '入力' : s === 2 ? '確認' : '完了'}
            </div>
          ) : (
            <div className="bg-light-5 h-4 w-4 rounded-full" />
          )}
        </div>
      ))}
      <div className={`absolute right-12 left-32 h-[2px] bg-gradient-to-r ${
        step === 1 ? 'from-blue-3 to-light-5' :
        step === 2 ? 'via-blue-3 from-light-5 to-light-5' :
        'from-light-5 to-blue-3'
      }`} />
    </div>
  );
}

export default function ContactClient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (stored) try { setForm(JSON.parse(stored)); } catch { /* ignore */ }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem('contactForm', JSON.stringify(form));
    router.push('/contact/confirm');
  };

  const isValid = Object.values(form).every(v => v.trim() !== '');

  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />
      <Stepper step={1} />

      <main>
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl font-bold tracking-widest">お問い合わせ</h1>
          <p className="text-justify text-sm leading-relaxed opacity-80">オトナビについてのご質問や店舗情報に関するご相談など、お気軽にお問い合わせください。3営業日以内にメールにてお返事いたします。</p>
        </section>

        <div className="bg-light-2 flex flex-col gap-8 px-6 pt-10 pb-20">
          <FormField label="お名前" name="name" value={form.name} onChange={handleChange} placeholder="音箱 太郎" autoComplete="name" />
          <FormField label="メールアドレス" name="email" value={form.email} onChange={handleChange} placeholder="otonavi@example.jp" autoComplete="email" />

          <div className={contactStyles.wrapper}>
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className={contactStyles.label}>お問い合わせ内容<span className="text-red-4">*</span></label>
              <p className="text-gray-4 text-xs">わかる範囲で概要をご記入ください。</p>
            </div>
            <textarea id="message" name="message" required className={contactStyles.textarea} value={form.message} onChange={handleChange} />
          </div>

          <div className="mt-4">
            <Button onClick={handleConfirm} label="内容確認へ" rightIcon={ArrowRight} disabled={!isValid} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FormField({ label, name, ...props }: any) {
  return (
    <div className={contactStyles.wrapper}>
      <label htmlFor={name} className={contactStyles.label}>{label}<span className="text-red-4">*</span></label>
      <input id={name} name={name} required className={contactStyles.input} {...props} />
    </div>
  );
}