import { type InputHTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import './Checkbox.scss';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  label?: string;
  description?: string;
  showDescription?: boolean;
  showIcon?: boolean;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      error = false,
      label = 'Checkbox text',
      description = 'Description',
      showDescription = false,
      showIcon = false,
      indeterminate = false,
      disabled,
      checked,
      className,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    useEffect(() => {
      if (resolvedRef && 'current' in resolvedRef && resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    const rootClass = [
      'jf-checkbox',
      `jf-checkbox--${size}`,
      error && 'jf-checkbox--error',
      disabled && 'jf-checkbox--disabled',
      showDescription && 'jf-checkbox--has-description',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconSize = size === 'sm' ? 16 : 20;

    return (
      <label className={rootClass}>
        <span className="jf-checkbox__control-wrapper">
          <input
            ref={resolvedRef}
            type="checkbox"
            className="jf-checkbox__input"
            disabled={disabled}
            checked={checked}
            {...rest}
          />
          <span className="jf-checkbox__control">
            <svg className="jf-checkbox__check" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="jf-checkbox__indeterminate" viewBox="0 0 12 12" fill="none">
              <path d="M3 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </span>
        <span className="jf-checkbox__label-wrapper">
          <span className="jf-checkbox__label">{label}</span>
          {showDescription && (
            <span className="jf-checkbox__description">{description}</span>
          )}
        </span>
        {showIcon && (
          <span className="jf-checkbox__icon">
            <Icon name="info-circle-filled" category="general" size={iconSize} />
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
