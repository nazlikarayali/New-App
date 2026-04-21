import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import './Toggle.scss';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: ToggleSize;
  error?: boolean;
  loading?: boolean;
  label?: string;
  description?: string;
}

function ToggleThumb({ loading }: { loading?: boolean }) {
  if (loading) {
    return <span className="jf-toggle__spinner" aria-hidden />;
  }
  return (
    <span className="jf-toggle__grip" aria-hidden>
      <span className="jf-toggle__grip-line" />
      <span className="jf-toggle__grip-line" />
      <span className="jf-toggle__grip-line" />
    </span>
  );
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      size = 'md',
      error = false,
      loading = false,
      label,
      description,
      disabled,
      className,
      id: idProp,
      checked,
      defaultChecked,
      onChange,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;

    const rootClass = [
      'jf-toggle',
      `jf-toggle--${size}`,
      error && 'jf-toggle--error',
      disabled && 'jf-toggle--disabled',
      loading && 'jf-toggle--loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const control = (
      <span className={rootClass}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="jf-toggle__input"
          disabled={disabled || loading}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          {...rest}
        />
        <span className="jf-toggle__track" aria-hidden>
          <span className="jf-toggle__thumb">
            <ToggleThumb loading={loading} />
          </span>
        </span>
      </span>
    );

    if (!label && !description) return control;

    return (
      <label htmlFor={id} className={`jf-toggle-field${disabled ? ' jf-toggle-field--disabled' : ''}`}>
        {control}
        <span className="jf-toggle-field__text">
          {label && <span className="jf-toggle-field__label">{label}</span>}
          {description && <span className="jf-toggle-field__description">{description}</span>}
        </span>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
