import type { Metadata } from 'next';
import CompleteClient from './CompleteClient';
import { noindex } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = noindex({
    title: 'お問い合わせ完了',
    description: 'お問い合わせを受け付けました。',
    alternates: { canonical: new URL('/contact', SITE_URL).toString() },
});

export default function CompletePage() {
    return <CompleteClient />;
}