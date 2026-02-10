'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { baseClass, priorityClass, disabledByPriority, type Priority } from './button.styles';

type Props = {
  label: string;
  onClick: () => void;
  priority?: Priority;
  disabled?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
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
      {LeftIcon && <LeftIcon className="h-4 w-4" aria-hidden="true" />}
      <span className="truncate">{label}</span>
      {RightIcon && <RightIcon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
