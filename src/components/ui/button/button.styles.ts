export type Priority = 'primary' | 'secondary' | 'tertiary';

export const baseClass =
  'flex items-center justify-center gap-1 h-12 w-full rounded-md px-4 text-sm transition ' +
  'hover:shadow-sm ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-3';

export const priorityClass: Record<Priority, string> = {
  primary: 'bg-dark-5/90 text-light-1 hover:bg-dark-5/80 active:bg-dark-5/70',
  secondary:
    'text-dark-5/90 border border-dark-5/70 hover:border-dark-5/60 active:text-dark-5/70 active:border-dark-5/50',
  tertiary: 'text-dark-5/70 active:text-dark-5/60',
};

export const disabledByPriority: Record<Priority, string> = {
  primary: 'bg-gray-3 text-light-1 opacity-40 cursor-not-allowed',
  secondary: 'border border-gray-3 text-gray-3 opacity-40 cursor-not-allowed',
  tertiary: 'text-gray-3 opacity-40 cursor-not-allowed',
};
