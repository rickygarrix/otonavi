// components/store/StoreDetailSections.tsx
'use client';

type DetailRow = [label: string, value: string | null];

type Props = {
  items: DetailRow[];
};

function DetailItem({ label, value }: { label: string; value: string | null }) {
  const empty = !value?.trim();

  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-dark-4 shrink-0 font-bold">{label}</span>
      <span className={`text-right ${empty ? 'text-gray-2' : 'text-dark-3'}`}>
        {empty ? '—' : value}
      </span>
    </div>
  );
}

export default function StoreDetailSections({ items }: Props) {
  return (
    <section className="p-4">
      {items.map(([label, value]) => (
        <DetailItem key={label} label={label} value={value} />
      ))}
    </section>
  );
}
