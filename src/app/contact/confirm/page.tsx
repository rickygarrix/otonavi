import type { Metadata } from 'next';
import { noindex } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';
import ConfirmClient from './ConfirmClient';

export const metadata: Metadata = noindex({
    title: 'お問い合わせ内容の確認',
    description: 'お問い合わせ内容の確認ページです。',
    // confirm/complete は正規URLを /contact に寄せる
    alternates: { canonical: new URL('/contact', SITE_URL).toString() },
});

export default function ConfirmPage() {
    return <ConfirmClient />;
}