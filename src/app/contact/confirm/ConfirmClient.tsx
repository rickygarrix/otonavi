'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Eraser, Send } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/button/Button';
import { contactStyles, Stepper } from '../ContactClient';

export default function ConfirmClient() {
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (!stored) return router.replace('/contact');
    try { setForm(JSON.parse(stored)); } catch { router.replace('/contact'); }
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
      if (!res.ok) throw new Error();
      sessionStorage.setItem('contactFormSubmitted', JSON.stringify(form));
      sessionStorage.removeItem('contactForm');
      router.push('/contact/complete');
    } catch {
      setSending(false);
      alert('送信に失敗しました。');
    }
  };

  const displayFields = useMemo(() => [
    { label: 'お名前', value: form?.name, className: 'inputDisabled' },
    { label: 'メールアドレス', value: form?.email, className: 'inputDisabled' },
    { label: 'お問い合わせ内容', value: form?.message, className: 'textareaDisabled' },
  ], [form]);

  if (!form) return null;

  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />
      <Stepper step={2} />

      <main>
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl leading-[1.5] font-bold tracking-widest">お問い合わせ内容の確認</h1>
          <p className="text-justify text-sm leading-[1.8]">入力した内容に間違いがないかご確認ください。</p>
        </section>

        <form className="bg-light-2 flex flex-col gap-4 px-6 pt-10 pb-20">
          {displayFields.map((f) => (
            <div key={f.label} className={contactStyles.wrapper}>
              <div className={contactStyles.label}>
                <span>{f.label}</span><span className="text-red-4">*</span>
              </div>
              <div className={contactStyles[f.className as keyof typeof contactStyles]}>{f.value}</div>
            </div>
          ))}

          <label className="outline-light-5 flex items-center gap-4 rounded-lg p-4 text-sm outline outline-1">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer sr-only" />
            <span className="border-dark-1 peer-checked:border-blue-5 peer-checked:bg-blue-4 flex h-5 w-5 items-center justify-center rounded-sm border bg-white transition">
              <Check className="h-4 w-4 text-white" strokeWidth={3.0} />
            </span>
            <span><a href="/privacy" className="text-blue-4 underline">プライバシーポリシー</a>に同意します。</span>
          </label>

          <div className="mt-4 flex gap-4">
            <Button onClick={() => router.back()} priority="secondary" label="書き直す" rightIcon={Eraser} />
            <Button onClick={submit} label={sending ? '送信中…' : '送信'} rightIcon={Send} disabled={!agreed || sending} />
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}