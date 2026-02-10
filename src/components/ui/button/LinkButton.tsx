import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { baseClass, priorityClass, type Priority } from './button.styles';

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  priority?: Priority;
  label: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
};

export default function LinkButton({
  priority = 'primary',
  label,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  ...props
}: Props) {
  return (
    <a
      {...props}
      className={[baseClass, priorityClass[priority], className].filter(Boolean).join(' ')}
    >
      {LeftIcon && <LeftIcon className="h-4 w-4" aria-hidden="true" />}
      <span className="truncate">{label}</span>
      {RightIcon && <RightIcon className="h-4 w-4" aria-hidden="true" />}
    </a>
  );
}
