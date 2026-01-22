import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from 'next/font/google';

export const zenMaru = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-zen-maru',
  display: 'swap',
});

export const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-zen-kaku',
  display: 'swap',
});
