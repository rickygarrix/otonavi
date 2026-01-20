import type { Metadata } from 'next';
import StoreClient from './StoreClient';
import { SITE_URL, SITE_NAME, SITE_DESC } from '@/lib/site';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = params.slug;

    // meta用は最小限でOK（重いjoinは避ける）
    const { data } = await supabase
        .from('stores')
        .select('name, slug, description, og_image_url, is_active')
        .eq('slug', slug)
        .maybeSingle();

    // 非公開/存在しない：検索に出さない
    if (!data || !data.is_active) {
        return {
            title: '店舗が見つかりません',
            robots: {
                index: false,
                follow: true,
                googleBot: { index: false, follow: true },
            },
        };
    }

    return storeMeta({
        name: data.name,
        slug: data.slug,
        description: data.description,
        ogImageUrl: data.og_image_url,
        isActive: data.is_active,
    })
}

export default function Page({ params }: Props) {
    return <StoreDetailClient slug={params.slug} />;
}