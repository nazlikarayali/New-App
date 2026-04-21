import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import './Input.scss';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'error' | 'success' | 'warning' | 'readonly';
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      status = 'default',
      leftContent,
      rightContent,
      disabled,
      readOnly,
      className,
      ...rest
    },
    ref
  ) => {
    const resolvedStatus = readOnly ? 'readonly' : status;

    const rootClass = [
      'jf-input',
      `jf-input--${size}`,
      `jf-input--${resolvedStatus}`,
      disabled && 'jf-input--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={rootClass}>
        {leftContent && <span className="jf-input__left">{leftContent}</span>}
        <input
          ref={ref}
          className="jf-input__field"
          disabled={disabled}
          readOnly={readOnly || resolvedStatus === 'readonly'}
          {...rest}
        />
        {rightContent && <span className="jf-input__right">{rightContent}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
