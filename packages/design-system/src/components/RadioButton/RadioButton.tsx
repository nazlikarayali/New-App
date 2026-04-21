import { type InputHTMLAttributes, forwardRef } from 'react';
import { Icon } from '../Icon';
import './RadioButton.scss';

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  label?: string;
  description?: string;
  showDescription?: boolean;
  showIcon?: boolean;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      size = 'md',
      error = false,
      label = 'Radio text',
      description = 'Description',
      showDescription = false,
      showIcon = false,
      disabled,
      checked,
      className,
      ...rest
    },
    ref
  ) => {
    const rootClass = [
      'jf-radio',
      `jf-radio--${size}`,
      error && 'jf-radio--error',
      disabled && 'jf-radio--disabled',
      showDescription && 'jf-radio--has-description',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconSize = size === 'sm' ? 16 : 20;

    return (
      <label className={rootClass}>
        <span className="jf-radio__control-wrapper">
          <input
            ref={ref}
            type="radio"
            className="jf-radio__input"
            disabled={disabled}
            checked={checked}
            {...rest}
          />
          <span className="jf-radio__control">
            <span className="jf-radio__dot" />
          </span>
        </span>
        <span className="jf-radio__label-wrapper">
          <span className="jf-radio__label">{label}</span>
          {showDescription && (
            <span className="jf-radio__description">{description}</span>
          )}
        </span>
        {showIcon && (
          <span className="jf-radio__icon">
            <Icon name="info-circle-filled" category="general" size={iconSize} />
          </span>
        )}
      </label>
    );
  }
);

RadioButton.displayName = 'RadioButton';
