import { type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { DropdownBaseProps } from './types';

interface DropdownWrapperProps extends DropdownBaseProps {
  children: ReactNode;
}

export function DropdownWrapper({
  title,
  description,
  helperText,
  required = false,
  showTitle = false,
  showDescription = false,
  showHelpText = false,
  status = 'default',
  disabled = false,
  className,
  children,
}: DropdownWrapperProps) {
  const helpStatus = disabled ? 'disabled' : status;
  const rootClass = ['jf-dropdown-wrapper', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      {showTitle && title && (
        <div className="jf-dropdown-wrapper__label">
          <div className="jf-dropdown-wrapper__title">
            <span className="jf-dropdown-wrapper__title-text">{title}</span>
            {required && <span className="jf-dropdown-wrapper__required">*</span>}
          </div>
          {showDescription && description && (
            <p className="jf-dropdown-wrapper__description">{description}</p>
          )}
        </div>
      )}

      {children}

      {showHelpText && helperText && (
        <div className={`jf-dropdown-wrapper__help jf-dropdown-wrapper__help--${helpStatus}`}>
          <Icon
            name={status === 'error' ? 'exclamation-circle-filled' : 'info-circle-filled'}
            category="general"
            size={16}
          />
          <span>{helperText}</span>
        </div>
      )}
    </div>
  );
}
