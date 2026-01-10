'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { HomeStore } from '@/types/store';

import Footer from '@/components/ui/Footer';
import BackToHomeButton from '@/components/ui/BackToHomeButton';

import StoreImageCarousel from '@/components/store/StoreImageCarousel';
import StoreBasicInfo from '@/components/store/StoreBasicInfo';
import StoreAccess from '@/components/store/StoreAccess';
import StoreOpenHours from '@/components/store/StoreOpenHours';
import StoreDetailSections from '@/components/store/StoreDetailSections';
import StoreDetailMedia from './StoreDetailMedia';
import { StoreDetailDivider } from './StoreDetailDivider';

const join = (v?: string[]) => (v && v.length > 0 ? v.join(', ') : null);

const formatPaymentMethods = (labels?: string[], otherText?: string | null) => {
  if (!labels || labels.length === 0) return null;

  const hasOther = labels.includes('その他');
  if (hasOther && otherText) {
    const filtered = labels.filter((l) => l !== 'その他');
    return [...filtered, otherText].join(', ');
  }

  return labels.join(', ');
};

type Props = {
  store: HomeStore;
};

export default function StoreDetailView({ store }: Props) {
  const router = useRouter();
  const query = useSearchParams().toString();

  const detailItems: [string, string][] = [
    { order: 10, label: '客層', value: join(store.customer_labels) },
    { order: 20, label: '雰囲気', value: join(store.atmosphere_labels) },
    { order: 30, label: '広さ', value: store.size_label },
    { order: 40, label: 'ドリンク', value: join(store.drink_labels) },
    { order: 50, label: '価格帯', value: store.price_range_label },
    {
      order: 60,
      label: '支払い方法',
      value: formatPaymentMethods(store.payment_method_labels, store.payment_method_other),
    },
    { order: 70, label: 'イベントの傾向', value: join(store.event_trend_labels) },
    { order: 80, label: '荷物預かり', value: join(store.baggage_labels) },
    { order: 90, label: '喫煙', value: join(store.smoking_labels) },
    { order: 100, label: 'トイレ', value: join(store.toilet_labels) },
    { order: 110, label: '周辺環境', value: join(store.environment_labels) },
    { order: 120, label: 'その他', value: join(store.other_labels) },
  ]
    .filter(
      (item): item is { order: number; label: string; value: string } =>
        typeof item.value === 'string' && item.value.trim().length > 0,
    )
    .sort((a, b) => a.order - b.order)
    .map((item) => [item.label, item.value]);

  return (
    <div className="bg-white">
      <main>
        <StoreImageCarousel storeId={store.id} storeName={store.name} />

        <StoreBasicInfo store={store} />

        {store.access && (
          <>
            <StoreDetailDivider />
            <StoreAccess store={store} />
          </>
        )}

        {store.business_hours && (
          <>
            <StoreDetailDivider />
            <StoreOpenHours businessHours={store.business_hours} />
          </>
        )}

        {(store.store_awards?.length > 0 || store.store_media_mentions?.length > 0) && (
          <>
            <StoreDetailDivider />
            <StoreDetailMedia
              awards={store.store_awards}
              mediaMentions={store.store_media_mentions}
            />
          </>
        )}

        {detailItems.length > 0 && (
          <>
            <StoreDetailDivider />
            <StoreDetailSections items={detailItems} />
            <StoreDetailDivider />
          </>
        )}
      </main>

      <div className="p-10">
        <BackToHomeButton onClick={() => router.push(query ? `/stores?${query}` : '/stores')} />
      </div>

      <Footer />
    </div>
  );
}
