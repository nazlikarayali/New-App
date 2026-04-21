import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import './ColorInput.scss';

export interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'error' | 'success' | 'warning' | 'readonly';
  color?: string;
  onColorChange?: (color: string) => void;
}

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  (
    {
      size = 'md',
      status = 'default',
      color,
      onColorChange,
      disabled,
      readOnly,
      className,
      ...rest
    },
    ref
  ) => {
    const resolvedStatus = readOnly ? 'readonly' : status;
    const [internalColor, setInternalColor] = useState('#0A1551');

    const currentColor = color !== undefined ? color : internalColor;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (onColorChange) {
        onColorChange(val);
      } else {
        setInternalColor(val);
      }
    };

    const rootClass = [
      'jf-color-input',
      `jf-color-input--${size}`,
      `jf-color-input--${resolvedStatus}`,
      disabled && 'jf-color-input--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={rootClass}>
        <input
          ref={ref}
          type="text"
          className="jf-color-input__field"
          value={currentColor}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly || resolvedStatus === 'readonly'}
          {...rest}
        />
        <div className="jf-color-input__swatch-wrapper">
          <div
            className="jf-color-input__swatch"
            style={{ backgroundColor: currentColor }}
          />
          <input
            type="color"
            className="jf-color-input__picker"
            value={currentColor}
            onChange={handleChange}
            disabled={disabled || resolvedStatus === 'readonly'}
            tabIndex={-1}
          />
        </div>
      </div>
    );
  }
);

ColorInput.displayName = 'ColorInput';
