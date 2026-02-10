'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

type Priority = 'primary' | 'secondary' | 'tertiary';

type Props = {
  label: string;
  onClick: () => void;
  priority?: Priority;
  disabled?: boolean;

  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;

  className?: string;
};

const baseClass =
  'flex items-center justify-center gap-1 h-12 w-full rounded-lg px-4 text-sm transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-3';

const priorityClass: Record<Priority, string> = {
  primary:
    'bg-dark-5/90 text-light-1 ' +
    'hover:bg-dark-5/80 hover:shadow-sm ' +
    'active:bg-dark-5/70 active:shadow-none',
  secondary:
    'border border-dark-5/70 text-dark-5/90 ' +
    'hover:border-dark-5/60 hover:text-dark-5/80 hover:shadow-sm ' +
    'active:border-dark-5/50 active:text-dark-5/70 active:shadow-none',
  tertiary:
    'bg-dark-5/0 text-dark-5/70 ' +
    'hover:bg-dark-5/1 hover:text-dark-5/60 ' +
    'active:bg-dark-5/2 active:text-dark-5/50',
};

const disabledByPriority: Record<Priority, string> = {
  primary: 'bg-gray-3 text-light-1 opacity-40 cursor-not-allowed',
  secondary: 'border border-gray-3 text-gray-3 opacity-40 cursor-not-allowed',
  tertiary: 'text-gray-3 opacity-40 cursor-not-allowed',
};

export default function Button({
  label,
  onClick,
  priority = 'primary',
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        baseClass,
        disabled ? disabledByPriority[priority] : priorityClass[priority],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {LeftIcon && <LeftIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
      <span className="truncate px-1">{label}</span>
      {RightIcon && <RightIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
    </button>
  );
}
