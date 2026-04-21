import { type ReactNode } from 'react';
import './Indicator.scss';

export type IndicatorSize = 'sm' | 'md' | 'lg';
export type IndicatorStyle = 'color' | 'light' | 'dot';
export type IndicatorStatus = 'information' | 'success' | 'error' | 'neutral';

export interface IndicatorProps {
  size?: IndicatorSize;
  style?: IndicatorStyle;
  status?: IndicatorStatus;
  children?: ReactNode;
  className?: string;
}

export function Indicator({
  size = 'md',
  style = 'color',
  status = 'information',
  children,
  className,
}: IndicatorProps) {
  const rootClass = [
    'jf-indicator',
    `jf-indicator--${size}`,
    `jf-indicator--${style}`,
    `jf-indicator--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (style === 'dot') {
    return (
      <span className={rootClass} aria-hidden={children === undefined}>
        <span className="jf-indicator__dot" />
      </span>
    );
  }

  return (
    <span className={rootClass}>
      <span className="jf-indicator__count">{children}</span>
    </span>
  );
}
