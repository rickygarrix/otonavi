'use client';

type Props = {
  businessHours?: string | null;
};

export default function StoreOpenHours({ businessHours }: Props) {
  if (!businessHours) return null;

  return (
    <section className="text-dark-4 flex flex-col gap-4 p-4 text-sm">
      <h2 className="text-dark-5 py-0.5 text-lg font-bold tracking-widest">営業時間</h2>

      <p className="leading-[1.5] whitespace-pre-line">{businessHours}</p>

      {/* 注意文言 */}
      <p className="text-dark-1 relative pl-3 text-[10px] before:absolute before:left-0 before:content-['※']">
        日によって変動する可能性があります。最新情報は公式サイトやSNSをご確認ください。
      </p>
    </section>
  );
}
