import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Button.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'ghost' | 'transparent';
  colorScheme?: 'primary' | 'secondary' | 'constructive' | 'destructive';
  shape?: 'rectangle' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  loading?: boolean;
  loadingText?: string;
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`jf-btn__spinner ${className || ''}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Button({
  variant = 'filled',
  colorScheme = 'primary',
  shape = 'rectangle',
  size = 'md',
  leftIcon,
  rightIcon,
  iconOnly = false,
  loading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classNames = [
    'jf-btn',
    `jf-btn--${variant}`,
    `jf-btn--${colorScheme}`,
    `jf-btn--${shape}`,
    `jf-btn--${size}`,
    iconOnly && 'jf-btn--icon-only',
    loading && 'jf-btn--loading',
    disabled && 'jf-btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          {!iconOnly && loadingText && (
            <span className="jf-btn__label">{loadingText}</span>
          )}
        </>
      ) : (
        <>
          {leftIcon && <span className="jf-btn__icon">{leftIcon}</span>}
          {!iconOnly && children && (
            <span className="jf-btn__label">{children}</span>
          )}
          {rightIcon && <span className="jf-btn__icon">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
