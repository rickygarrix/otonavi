'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Eraser, Send } from 'lucide-react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Button } from '@/components/ui/button';

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
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  // UI用のデータ定義（ここをいじれば項目追加も一瞬）
  const displayFields = useMemo(() => [
    { label: 'お名前', value: form?.name, className: 'inputDisabled' },
    { label: 'メールアドレス', value: form?.email, className: 'inputDisabled' },
    { label: 'お問い合わせ内容', value: form?.message, className: 'textareaDisabled' },
  ], [form]);

  if (!form) return null;

  const styles = {
    step: 'flex items-center justify-center w-16 h-16 z-10',
    wrapper: 'flex flex-col gap-2',
    label: 'flex gap-1 text-sm',
    inputDisabled: 'px-4 py-3 bg-dark-5/10 rounded-3xl outline outline-1 outline-offset-[-1px] text-dark-5/50 outline-dark-5/10 text-md',
    textareaDisabled: 'min-h-40 px-4 py-3 bg-dark-5/10 rounded-3xl outline outline-1 outline-offset-[-1px] outline-dark-5/10 text-dark-5/50 text-md',
  };

  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />

      {/* ===== Stepper (UI構造を完全維持) ===== */}
      <div className="relative flex h-20 items-center justify-between pr-4 pl-24">
        {[1, 2, 3].map((s) => (
          <div key={s} className={styles.step}>
            {s === 2 ? (
              <div className="outline-blue-2 bg-blue-4 text-light-1 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold outline-4">確認</div>
            ) : (
              <div className="bg-light-5 h-4 w-4 rounded-full" />
            )}
          </div>
        ))}
        <div className="via-blue-3 from-light-5 to-light-5 absolute right-12 left-32 h-[2px] bg-gradient-to-r" />
      </div>

      <main>
        <section className="flex flex-col gap-6 px-6 py-10">
          <h1 className="text-xl leading-[1.5] font-bold tracking-widest">お問い合わせ内容の確認</h1>
          <p className="text-justify text-sm leading-[1.8]">入力した内容に間違いがないかご確認ください。</p>
        </section>

        <form className="bg-light-2 flex flex-col gap-4 px-6 pt-10 pb-20">
          {/* フィールドのレンダリング (UI結果は全く同じ) */}
          {displayFields.map((f) => (
            <div key={f.label} className={styles.wrapper}>
              <div className={styles.label}>
                <span>{f.label}</span>
                <span className="text-red-4" aria-hidden>*</span>
                <span className="sr-only">必須</span>
              </div>
              <div className={styles[f.className as keyof typeof styles]}>{f.value}</div>
            </div>
          ))}

          {/* プライバシーポリシー (UI構造を完全維持) */}
          <label className="outline-light-5 flex items-center gap-4 rounded-lg p-4 text-sm outline outline-1">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer sr-only" />
            <span className="border-dark-1 peer-checked:border-blue-5 peer-checked:bg-blue-4 flex h-5 w-5 items-center justify-center rounded-sm border bg-white transition">
              <Check className="h-4 w-4 text-white" strokeWidth={3.0} />
            </span>
            <span>
              <a href="/privacy" className="text-blue-4 underline">プライバシーポリシー</a>
              に同意します。
            </span>
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