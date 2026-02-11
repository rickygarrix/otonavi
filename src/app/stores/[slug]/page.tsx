import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoreClient from './storeClient';
import { SITE_URL, SITE_DESC } from '@/lib/metadata';
import { fetchStoreBySlug } from '@/lib/api/store'; // 修正済みのAPI関数をインポート

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Metadata生成用
 * ※ fetchStoreBySlug は内部でキャッシュ(Request Memoization)されるため、
 * Page本体と2回呼んでもパフォーマンス上の問題はありません。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await fetchStoreBySlug(slug);

  if (!store) {
    return { title: '店舗が見つかりません' };
  }

  // OGP画像選定（正規化済みの gallery_url を使用）
  const firstGalleryUrl = store.gallery_url;
  const isValidOgpImage =
    firstGalleryUrl &&
    firstGalleryUrl !== '/noshop.svg' &&
    !firstGalleryUrl.endsWith('.svg');

  const ogpImage = isValidOgpImage ? firstGalleryUrl : `${SITE_URL}/ogp.png`;

  return {
    title: store.name,
    description: store.description ?? SITE_DESC,
    openGraph: {
      title: store.name,
      description: store.description ?? SITE_DESC,
      url: `${SITE_URL}/stores/${store.slug}`,
      images: [ogpImage],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogpImage],
    },
  };
}

/**
 * 店舗詳細 サーバーコンポーネント
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;

  // API層の修正済み関数を呼び出すことで、
  // ステータス、エリア、タグ、実績(mentions)がすべて正規化された状態で取得されます
  const store = await fetchStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return <StoreClient store={store} />;
}