import type React from 'react';
import { Icon } from '../Icon/Icon';
import './Button.scss';

// ============================================
// Types
// ============================================
export type ButtonVariant = 'Default' | 'Secondary' | 'Outlined' | 'Disabled';
export type ButtonCorner = 'Default' | 'Rounded';
export type ButtonState = 'Default' | 'Hovered' | 'Disabled';
export type ButtonSize = 'Default' | 'Small';

export interface ButtonProps {
  variant?: ButtonVariant;
  corner?: ButtonCorner;
  size?: ButtonSize;
  state?: ButtonState;
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  iconOnly?: boolean;
  iconOnlyIcon?: string;
  iconOnlyFilled?: boolean;
  iconOnlySm?: boolean;
  selected?: boolean;
  shrinked?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

// ============================================
// Button Component
// ============================================
export const Button: React.FC<ButtonProps> = ({
  variant = 'Default',
  corner = 'Default',
  size = 'Default',
  state = 'Default',
  label = 'Button',
  leftIcon = 'Plus',
  rightIcon = 'Plus',
  iconOnly = false,
  iconOnlyIcon = 'Plus',
  iconOnlyFilled = true,
  iconOnlySm = false,
  selected = false,
  shrinked = false,
  fullWidth = false,
  onClick,
}) => {
  const isDisabled = state === 'Disabled' || variant === 'Disabled';

  // =====================
  // Icon Only Mode
  // =====================
  if (iconOnly) {
    const iconOnlyClasses = [
      'jf-btn-icon',
      iconOnlyFilled ? 'jf-btn-icon--filled' : 'jf-btn-icon--ghost',
      corner === 'Rounded' ? 'jf-btn-icon--rounded' : 'jf-btn-icon--default',
      iconOnlySm && 'jf-btn-icon--sm',
      state === 'Hovered' && 'jf-btn-icon--hovered',
      isDisabled && 'jf-btn-icon--disabled',
      selected && 'jf-btn-icon--selected',
    ].filter(Boolean).join(' ');

    return (
      <button className={iconOnlyClasses} disabled={isDisabled} onClick={onClick}>
        <Icon name={iconOnlyIcon} className="jf-btn-icon__icon" size={iconOnlySm ? 16 : 24} />
      </button>
    );
  }

  // =====================
  // Standard Button
  // =====================
  const hasLeftIcon = leftIcon && leftIcon !== 'none';
  const hasRightIcon = rightIcon && rightIcon !== 'none';

  const classes = [
    'jf-btn',
    `jf-btn--${variant.toLowerCase()}`,
    `jf-btn--corner-${corner.toLowerCase()}`,
    `jf-btn--size-${size.toLowerCase()}`,
    state === 'Hovered' && 'jf-btn--hovered',
    isDisabled && 'jf-btn--disabled',
    selected && 'jf-btn--selected',
    shrinked && 'jf-btn--shrinked',
    fullWidth && 'jf-btn--full-width',
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'Small' ? 16 : 20;

  return (
    <button className={classes} disabled={isDisabled} onClick={onClick}>
      {hasLeftIcon && <Icon name={leftIcon} className="jf-btn__icon" size={iconSize} />}
      <span className="jf-btn__label">{label}</span>
      {hasRightIcon && <Icon name={rightIcon} className="jf-btn__icon" size={iconSize} />}
    </button>
  );
};

export default Button;
