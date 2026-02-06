import type { Metadata } from 'next';
import { staticMeta } from '@/lib/metadata';
import ContactClient from './ContactClient';

export const metadata: Metadata = staticMeta({
    title: 'お問い合わせ',
    path: '/contact',
    description:
        'オトナビについてのご質問や店舗情報に関するご相談など、お気軽にお問い合わせください。',
});

export default function ContactPage() {
    return <ContactClient />;
}