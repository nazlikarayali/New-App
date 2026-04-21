import { type InputHTMLAttributes, forwardRef } from 'react';
import { Icon } from '../Icon';
import './UrlInput.scss';

export interface UrlInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'error' | 'success' | 'warning' | 'readonly';
  urlPrefix?: string;
  showCopyButton?: boolean;
  onCopy?: () => void;
}

const ICON_SIZES = { sm: 16, md: 20, lg: 24 } as const;

export const UrlInput = forwardRef<HTMLInputElement, UrlInputProps>(
  (
    {
      size = 'md',
      status = 'default',
      urlPrefix = 'https://',
      showCopyButton = true,
      onCopy,
      disabled,
      readOnly,
      className,
      placeholder = 'example.com',
      ...rest
    },
    ref
  ) => {
    const resolvedStatus = readOnly ? 'readonly' : status;

    const rootClass = [
      'jf-url-input',
      `jf-url-input--${size}`,
      `jf-url-input--${resolvedStatus}`,
      disabled && 'jf-url-input--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleCopy = () => {
      if (onCopy) onCopy();
    };

    return (
      <div className={rootClass}>
        <div className="jf-url-input__addon">
          <span className="jf-url-input__prefix">{urlPrefix}</span>
        </div>
        <input
          ref={ref}
          type="url"
          className="jf-url-input__field"
          disabled={disabled}
          readOnly={readOnly || resolvedStatus === 'readonly'}
          placeholder={placeholder}
          {...rest}
        />
        {showCopyButton && (
          <button
            type="button"
            className="jf-url-input__copy"
            onClick={handleCopy}
            tabIndex={-1}
            disabled={disabled}
          >
            <Icon name="copy" size={ICON_SIZES[size]} />
          </button>
        )}
      </div>
    );
  }
);

UrlInput.displayName = 'UrlInput';
