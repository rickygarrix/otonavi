'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Button } from '@/components/ui/button';

export default function ContactClient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  // セッション復元
  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (stored) {
      try { setForm(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // ★ 汎用的な入力ハンドラー（1つで全部使い回す）
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem('contactForm', JSON.stringify(form));
    router.push('/contact/confirm');
  };

  const isValid = Object.values(form).every(v => v.trim() !== '');

  const styles = {
    step: 'flex items-center justify-center w-16 h-16 z-10',
    wrapper: 'flex flex-col gap-2',
    label: 'flex gap-1 text-sm font-medium',
    input: 'h-12 px-4 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base focus:outline-blue-3 transition-all',
    textarea: 'min-h-40 px-4 py-3 bg-light-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-light-4 text-base resize-none focus:outline-blue-3 transition-all',
  };

  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />

      {/* ===== Stepper (そのまま) ===== */}
      <div className="relative flex h-20 items-center justify-between pr-4 pl-24">
        <div className={styles.step}>
          <div className="bg-blue-4 text-light-1 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ring-4 ring-blue-2">
            入力
          </div>
        </div>
        {[1, 2].map(i => (
          <div key={i} className={styles.step}><div className="bg-light-5 h-4 w-4 rounded-full" /></div>
        ))}
        <div className="from-blue-3 to-light-5 absolute right-12 left-32 h-[2px] bg-gradient-to-r" />
      </div>

      <main>
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl font-bold tracking-widest">お問い合わせ</h1>
          <p className="text-justify text-sm leading-relaxed opacity-80">
            オトナビについてのご質問や店舗情報に関するご相談など、お気軽にお問い合わせください。3営業日以内にメールにてお返事いたします。
          </p>
        </section>

        <div className="bg-light-2 flex flex-col gap-8 px-6 pt-10 pb-20">
          {/* お名前 */}
          <FormField label="お名前" name="name" value={form.name} onChange={handleChange} placeholder="音箱 太郎" autoComplete="name" styles={styles} />

          {/* メールアドレス */}
          <FormField label="メールアドレス" name="email" value={form.email} onChange={handleChange} placeholder="otonavi@example.jp" autoComplete="email" styles={styles} />

          {/* お問い合わせ内容 */}
          <div className={styles.wrapper}>
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className={styles.label}>お問い合わせ内容<span className="text-red-4">*</span></label>
              <p className="text-gray-4 text-xs">わかる範囲で概要をご記入ください。</p>
            </div>
            <textarea id="message" name="message" required className={styles.textarea} value={form.message} onChange={handleChange} />
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

// 内部用：さらにスッキリさせるための小コンポーネント
function FormField({ label, name, value, onChange, placeholder, autoComplete, styles }: any) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={name} className={styles.label}>{label}<span className="text-red-4">*</span></label>
      <input id={name} name={name} required autoComplete={autoComplete} className={styles.input} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}