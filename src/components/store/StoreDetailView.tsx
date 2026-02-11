'use client';

import type { HomeStore } from '@/types/store';
import Footer from '@/components/ui/Footer';
import BackToHomeButton from '@/components/ui/BackToHomeButton';
import StoreGalleryCarousel from '@/components/store/StoreGalleryCarousel';
import StoreBasicInfo from '@/components/store/StoreBasicInfo';
import StoreAccess from '@/components/store/StoreAccess';
import StoreOpenHours from '@/components/store/StoreOpenHours';
import StoreDetailSections from '@/components/store/StoreDetailSections';
import StoreDetailMedia from './StoreDetailMedia';
import { StoreDetailDivider } from './StoreDetailDivider';

/* =========================
   Utils (ロジックをより堅牢に)
========================= */

const join = (v?: string[]) => (v?.length ? v.join(', ') : null);

const formatPaymentMethods = (labels?: string[], otherText?: string | null) => {
  if (!labels?.length) return null;
  // 「その他」が含まれていて、かつ具体的なテキストがある場合のみ差し替え
  const filtered = labels.filter((l) => l !== 'その他');
  if (labels.includes('その他') && otherText) {
    return [...filtered, otherText].join(', ');
  }
  return labels.join(', ');
};

type Props = {
  store: HomeStore;
  onMainImageLoaded?: () => void;
};

export default function StoreDetailView({ store, onMainImageLoaded }: Props) {

  // ★ 表示項目の定義とフィルタリングを一本化
  const detailItems: [string, string][] = [
    { label: '客層', value: join(store.customer_labels) },
    { label: '雰囲気', value: join(store.atmosphere_labels) },
    { label: '広さ', value: store.size_label },
    { label: 'ドリンク', value: join(store.drink_labels) },
    { label: '価格帯', value: store.price_range_label },
    { label: '支払い方法', value: formatPaymentMethods(store.payment_method_labels, store.other_payment_method) },
    { label: 'イベントの傾向', value: join(store.event_trend_labels) },
    { label: '荷物預かり', value: join(store.baggage_labels) },
    { label: '喫煙', value: join(store.smoking_labels) },
    { label: 'トイレ', value: join(store.toilet_labels) },
    { label: '周辺環境', value: join(store.environment_labels) },
    { label: 'その他', value: join(store.other_labels) },
  ]
    .filter((item): item is { label: string; value: string } => !!item.value?.trim())
    .map((item) => [item.label, item.value]);

  return (
    <div className="bg-white">
      <main>
        <StoreGalleryCarousel storeId={store.id} storeName={store.name} onMainImageLoaded={onMainImageLoaded} />
        <StoreBasicInfo store={store} />

        {/* 各セクション：データがある場合のみDividerとセットで表示 */}
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

        {store.hasMentions && (
          <>
            <StoreDetailDivider />
            <StoreDetailMedia mentions={store.mentions} />
          </>
        )}

        {detailItems.length > 0 && (
          <>
            <StoreDetailDivider />
            <StoreDetailSections items={detailItems} />
          </>
        )}
      </main>

      <StoreDetailDivider />
      <div className="p-10">
        <BackToHomeButton />
      </div>
      <Footer />
    </div>
  );
}