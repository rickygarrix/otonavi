import type { Metadata } from 'next';
import { staticMeta } from '@/lib/metadata';
import AboutClient from './AboutClient';

export const metadata: Metadata = staticMeta({
  title: 'オトナビとは？',
  path: '/about',
});

export default function AboutPage() {
  return <AboutClient />;
}