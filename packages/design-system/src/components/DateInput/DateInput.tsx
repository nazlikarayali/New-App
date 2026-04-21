import { type InputHTMLAttributes, forwardRef } from 'react';
import { Icon } from '../Icon';
import './DateInput.scss';

export interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'error' | 'success' | 'warning' | 'readonly';
}

const ICON_SIZES = { sm: 16, md: 20, lg: 24 } as const;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ size = 'md', status = 'default', disabled, readOnly, className, ...rest }, ref) => {
    const resolvedStatus = readOnly ? 'readonly' : status;

    const rootClass = [
      'jf-date-input',
      `jf-date-input--${size}`,
      `jf-date-input--${resolvedStatus}`,
      disabled && 'jf-date-input--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={rootClass}>
        <div className="jf-date-input__placeholder">
          <span className="jf-date-input__part">mm</span>
          <span className="jf-date-input__separator">/</span>
          <span className="jf-date-input__part">dd</span>
          <span className="jf-date-input__separator">/</span>
          <span className="jf-date-input__part">yyyy</span>
        </div>
        <input
          ref={ref}
          type="date"
          className="jf-date-input__field"
          disabled={disabled}
          readOnly={readOnly || resolvedStatus === 'readonly'}
          {...rest}
        />
        <Icon
          name="calendar-event-filled"
          category="time-date"
          size={ICON_SIZES[size]}
          className="jf-date-input__icon"
        />
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
