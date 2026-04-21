import { type ReactNode } from 'react';
import { Icon } from '../Icon';
import './FormField.scss';

export interface FormFieldProps {
  children: ReactNode;
  size?: 'md' | 'lg';
  status?: 'default' | 'error' | 'success' | 'warning';
  disabled?: boolean;
  title?: string;
  description?: string;
  helpText?: string;
  required?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showHelpText?: boolean;
  showHelpIcon?: boolean;
  className?: string;
}

const helpIconMap = {
  default: 'info-circle-filled',
  success: 'check-circle-filled',
  error: 'exclamation-circle-filled',
  warning: 'exclamation-circle-filled',
} as const;

const helpIconCategoryMap = {
  default: 'general',
  success: 'general',
  error: 'general',
  warning: 'general',
} as const;

export function FormField({
  children,
  size = 'lg',
  status = 'default',
  disabled = false,
  title = 'Add title',
  description = 'Add description content',
  helpText = 'Add help content',
  required = false,
  showTitle = true,
  showDescription = true,
  showHelpText = true,
  showHelpIcon = true,
  className,
}: FormFieldProps) {
  const rootClass = [
    'jf-form-field',
    `jf-form-field--${size}`,
    disabled && 'jf-form-field--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const helpStatus = disabled ? 'disabled' : status;

  return (
    <div className={rootClass}>
      {showTitle && (
        <div className="jf-form-field__label">
          <div className="jf-form-field__title">
            <span className="jf-form-field__title-text">{title}</span>
            {required && <span className="jf-form-field__required">*</span>}
          </div>
          {showDescription && (
            <p className="jf-form-field__description">{description}</p>
          )}
        </div>
      )}

      <div className="jf-form-field__input">
        {children}
      </div>

      {showHelpText && (
        <div className={`jf-form-field__help jf-form-field__help--${helpStatus}`}>
          {showHelpIcon && (
            <Icon
              name={helpIconMap[status] ?? 'info-circle-filled'}
              category={helpIconCategoryMap[status] ?? 'general'}
              size={16}
            />
          )}
          <span className="jf-form-field__help-text">{helpText}</span>
        </div>
      )}
    </div>
  );
}
