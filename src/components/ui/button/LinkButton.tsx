import * as React from 'react';
import { baseClass, priorityClass, type Priority } from './button.styles';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  priority?: Priority;
};

export default function LinkButton({ priority = 'primary', className, children, ...props }: Props) {
  return (
    <a
      {...props}
      className={[baseClass, priorityClass[priority], className].filter(Boolean).join(' ')}
    >
      {children}
    </a>
  );
}
