import { type InputHTMLAttributes, useState, useRef } from 'react';
import { Icon } from '../Icon';
import './SearchInput.scss';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  showFilter?: boolean;
  onFilterClick?: () => void;
  onClear?: () => void;
}

const ICON_SIZES = { sm: 16, md: 20, lg: 24 } as const;

export function SearchInput({
  size = 'md',
  showFilter = false,
  onFilterClick,
  onClear,
  value,
  onChange,
  disabled,
  className,
  ...rest
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const iconSize = ICON_SIZES[size];
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = String(currentValue).length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      setInternalValue('');
    }
    inputRef.current?.focus();
  };

  const rootClass = [
    'jf-search',
    `jf-search--${size}`,
    showFilter && 'jf-search--with-filter',
    disabled && 'jf-search--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className="jf-search__field">
        <Icon name="magnifying-glass" size={iconSize} className="jf-search__icon" />
        <input
          ref={inputRef}
          type="text"
          className="jf-search__input"
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            className="jf-search__clear"
            onClick={handleClear}
            tabIndex={-1}
          >
            <Icon name="xmark" size={iconSize} />
          </button>
        )}
      </div>
      {showFilter && (
        <button
          type="button"
          className="jf-search__filter-btn"
          onClick={onFilterClick}
          disabled={disabled}
        >
          <span className="jf-search__filter-text">Filter</span>
          <Icon name="bars-filter" size={iconSize} className="jf-search__filter-icon" />
        </button>
      )}
    </div>
  );
}
