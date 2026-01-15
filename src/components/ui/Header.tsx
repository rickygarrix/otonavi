import HomeButton from '@/components/ui/HomeButton';

type HeaderProps =
  | {
      variant: 'result';
      count: number;
      labels: string;
    }
  | {
      variant: 'title';
      title: string;
    }
  | {
      variant?: 'simple';
    };

export default function Header(props: HeaderProps) {
  const variant = props.variant ?? 'simple';

  return (
    <header className="sticky inset-x-0 top-0 z-200 flex h-20 items-center gap-4 px-4">
      <HomeButton />

      {props.variant === 'result' && (
        <>
          <div className="flex items-center gap-1 font-bold">
            <span className="inline-block shrink-0 text-lg font-bold tracking-widest">
              {props.count}
            </span>
            <span className="mt-0.5 inline-block text-[10px]">件</span>
          </div>

          {props.labels.length > 0 && (
            <span className="text-blue-4 line-clamp-2 flex-1 text-xs leading-[1.5]">
              {props.labels}
            </span>
          )}
        </>
      )}

      {props.variant === 'title' && (
        <span className="text-dark-5 truncate text-xs font-bold">{props.title}</span>
      )}

      {props.variant === 'simple' && null}
    </header>
  );
}
