import { type InputHTMLAttributes, forwardRef, useState, useCallback } from 'react';
import { Icon } from '../Icon';
import './NumberInput.scss';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'error' | 'success' | 'warning' | 'readonly';
  unit?: string;
  showUnit?: boolean;
  step?: number;
  onChange?: (value: number | undefined) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      size = 'md',
      status = 'default',
      unit = 'kg',
      showUnit = true,
      step = 1,
      value,
      onChange,
      onIncrement,
      onDecrement,
      disabled,
      readOnly,
      className,
      placeholder = '0',
      min,
      max,
      ...rest
    },
    ref
  ) => {
    const resolvedStatus = readOnly ? 'readonly' : status;
    const [internalValue, setInternalValue] = useState<string>('');

    const currentValue = value !== undefined ? String(value) : internalValue;

    const updateValue = useCallback((newVal: number) => {
      const clamped = Math.max(
        min !== undefined ? Number(min) : -Infinity,
        Math.min(max !== undefined ? Number(max) : Infinity, newVal)
      );
      if (onChange) {
        onChange(clamped);
      } else {
        setInternalValue(String(clamped));
      }
    }, [onChange, min, max]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === '') {
        if (onChange) onChange(undefined);
        else setInternalValue('');
        return;
      }
      const num = Number(raw);
      if (!isNaN(num)) updateValue(num);
    };

    const handleIncrement = () => {
      if (onIncrement) { onIncrement(); return; }
      const num = currentValue === '' ? 0 : Number(currentValue);
      updateValue(num + step);
    };

    const handleDecrement = () => {
      if (onDecrement) { onDecrement(); return; }
      const num = currentValue === '' ? 0 : Number(currentValue);
      updateValue(num - step);
    };

    const rootClass = [
      'jf-number-input',
      `jf-number-input--${size}`,
      `jf-number-input--${resolvedStatus}`,
      disabled && 'jf-number-input--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={rootClass}>
        <div className="jf-number-input__field-area">
          <input
            ref={ref}
            type="number"
            className="jf-number-input__field"
            disabled={disabled}
            readOnly={readOnly || resolvedStatus === 'readonly'}
            placeholder={placeholder}
            value={currentValue}
            onChange={handleChange}
            step={step}
            min={min}
            max={max}
            {...rest}
          />
          {showUnit && (
            <span className="jf-number-input__unit">{unit}</span>
          )}
        </div>
        <div className="jf-number-input__addon">
          <button
            type="button"
            className="jf-number-input__arrow"
            onClick={handleIncrement}
            disabled={disabled || resolvedStatus === 'readonly'}
            tabIndex={-1}
          >
            <Icon name="caret-up" category="arrows" size={16} />
          </button>
          <button
            type="button"
            className="jf-number-input__arrow"
            onClick={handleDecrement}
            disabled={disabled || resolvedStatus === 'readonly'}
            tabIndex={-1}
          >
            <Icon name="caret-down" category="arrows" size={16} />
          </button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
