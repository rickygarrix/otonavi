import type { Metadata } from 'next';
import CompleteClient from './CompleteClient';
import { noindex, SITE_URL } from '@/lib/metadata';

export const metadata: Metadata = noindex({
    title: 'お問い合わせ完了',
    description: 'お問い合わせを受け付けました。',
    alternates: { canonical: new URL('/contact', SITE_URL).toString() },
});

export default function CompletePage() {
    return <CompleteClient />;
}