'use client';

import Image from 'next/image';
import Link from 'next/link';

type FooterProps = {
  hasFixedBottom?: boolean;
};

export default function Footer({ hasFixedBottom }: FooterProps) {
  return (
    <footer
      className={[
        'bg-dark-5 text-light-3 flex flex-col gap-6 px-4 pt-8',
        hasFixedBottom ? 'pb-26' : 'pb-10',
      ].join(' ')}
    >
      {/* ロゴ */}
      <Link href="/" className="ml-2 flex h-10 items-center">
        <Image src="/logo-white.svg" alt="オトナビ" width={133} height={40} />
      </Link>

      {/* メニュー */}
      <nav>
        <ul>
          <li>
            <FooterLink href="/lp">オトナビとは？</FooterLink>
          </li>
          <li>
            <FooterLink href="/contact">お問い合わせ</FooterLink>
          </li>
          <li>
            <FooterLink href="/terms">利用規約</FooterLink>
          </li>
          <li>
            <FooterLink href="/privacy">プライバシーポリシー</FooterLink>
          </li>
          <li>
            <FooterLink href="/disclosure">特定商取引法に基づく表記</FooterLink>
          </li>
        </ul>
      </nav>

      {/* コピーライト */}
      <p className="text-light-5 mx-2 text-xs">
        <small>© {new Date().getFullYear()} Otonavi</small>
      </p>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-light-3 flex h-12 items-center px-4 text-xs transition-all duration-200 ease-out active:opacity-70"
    >
      {children}
    </Link>
  );
}
