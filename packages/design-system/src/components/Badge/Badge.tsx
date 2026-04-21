import { type ReactNode } from 'react';
import './Badge.scss';

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'rectangle';
export type BadgeEmphasis = 'subtle' | 'bold';
export type BadgeStatus = 'success' | 'error' | 'warning' | 'information' | 'neutral';

export interface BadgeProps {
  children: ReactNode;
  size?: BadgeSize;
  shape?: BadgeShape;
  emphasis?: BadgeEmphasis;
  status?: BadgeStatus;
  icon?: ReactNode;
  className?: string;
}

export function Badge({
  children,
  size = 'md',
  shape = 'rounded',
  emphasis = 'subtle',
  status = 'neutral',
  icon,
  className,
}: BadgeProps) {
  const rootClass = [
    'jf-badge',
    `jf-badge--${size}`,
    `jf-badge--${shape}`,
    `jf-badge--${emphasis}`,
    `jf-badge--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={rootClass}>
      {icon && <span className="jf-badge__icon" aria-hidden>{icon}</span>}
      <span className="jf-badge__label">{children}</span>
    </span>
  );
}
