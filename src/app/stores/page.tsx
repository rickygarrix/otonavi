// /stores/page.tsx
import type { Metadata } from 'next';
import { Suspense } from "react"
import StoresClient from "./StoresClient"
import { SITE_URL } from '@/lib/site';

type SearchParams = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// まずは簡易版（label化は後で）
function buildTitle(filters: string[], storeTypeId?: string) {
  if (!filters.length && !storeTypeId) return `検索結果｜オトナビ`;
  const parts: string[] = [];
  if (storeTypeId) parts.push('店舗タイプ');
  if (filters.length) parts.push(`${filters.length}条件`);
  return `${parts.join('・')}の検索結果｜オトナビ`;
}

function buildDescription(filters: string[], storeTypeId?: string) {
  const base =
    'オトナビの検索結果一覧。エリアやこだわり条件で音箱（クラブ・バー・ライブハウス）を探せます。';
  if (!filters.length && !storeTypeId) return base;
  return `${base} 条件付きの検索結果です。`;
}

// canonical固定
function buildCanonical() {
  return `${SITE_URL}/stores`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const filters = asArray(searchParams.filters);
  const storeTypeId = (searchParams.store_type_id as string | undefined) ?? undefined;

  const title = buildTitle(filters, storeTypeId);
  const description = buildDescription(filters, storeTypeId);
  const canonical = buildCanonical();
  const ogImage = new URL('/ogp.png', SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [ogImage],
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function StoresPage() {
  return (
    <Suspense fallback={null}>
      <StoresClient />
    </Suspense>
  )
}