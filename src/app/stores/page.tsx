import type { Metadata } from 'next';
import { Suspense } from 'react';
import StoresClient from './StoresClient';
import { storesMeta } from '@/lib/metadata';

type SearchParams = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/**
 * ✅ Next.js 14+ 対応版
 * searchParams は Promise なので await する
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;

  const filters = asArray(params.filters);
  const storeTypeId =
    (params.store_type_id as string | undefined) ?? undefined;

  return storesMeta({ filters, storeTypeId });
}

export default function StoresPage() {
  return (
    <Suspense fallback={null}>
      <StoresClient />
    </Suspense>
  );
}