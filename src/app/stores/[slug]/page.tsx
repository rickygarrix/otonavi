// src/app/stores/[slug]/page.tsx
import type { Metadata } from 'next';
import StoreClient from './storeClient';
import { SITE_URL, SITE_DESC } from '@/lib/metadata';
import { getSupabaseServer } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from('stores')
    .select(`
      name,
      slug,
      description,
      store_galleries (
        gallery_url,
        sort_order
      )
    `)
    .eq('slug', slug)
    .maybeSingle();

  // =========================
  // 店舗が見つからない場合
  // =========================
  if (!data) {
    const fallbackOgp = `${SITE_URL}/ogp.png`;

    return {
      title: 'オトナビ',
      description: SITE_DESC,

      openGraph: {
        title: 'オトナビ',
        description: SITE_DESC,
        url: `${SITE_URL}/stores/${slug}`,
        images: [fallbackOgp],
      },

      twitter: {
        card: 'summary_large_image',
        title: 'オトナビ',
        description: SITE_DESC,
        images: [fallbackOgp],
      },
    };
  }

  // =========================
  // OGP画像選定ロジック
  // =========================
  const sortedGalleries =
    data.store_galleries
      ?.slice()
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  const firstGalleryUrl = sortedGalleries?.[0]?.gallery_url ?? null;

  // SVGはOGP非対応なので除外
  const isValidOgpImage =
    typeof firstGalleryUrl === 'string' &&
    !firstGalleryUrl.endsWith('.svg');

  // 最終的に使うOGP画像
  const ogpImage = isValidOgpImage
    ? firstGalleryUrl
    : `${SITE_URL}/ogp.png`;

  // =========================
  // Metadata 本体
  // =========================
  return {
    title: data.name, // ← baseMetadata の template により「店名｜オトナビ」になる

    description: data.description ?? SITE_DESC,

    openGraph: {
      title: data.name,
      description: data.description ?? SITE_DESC,
      url: `${SITE_URL}/stores/${data.slug}`,
      images: [ogpImage],
    },

    twitter: {
      card: 'summary_large_image',
      title: data.name,
      description: data.description ?? SITE_DESC,
      images: [ogpImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <StoreClient slug={slug} />;
}