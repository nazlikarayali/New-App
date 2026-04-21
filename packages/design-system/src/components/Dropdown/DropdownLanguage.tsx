import { forwardRef, useImperativeHandle, type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import { DropdownWrapper } from './DropdownWrapper';
import { DropdownMenuShell } from './DropdownMenuShell';
import { useDropdown } from './useDropdown';
import { resolveFlag } from './flags';
import type { DropdownBaseProps, DropdownOption } from './types';
import './Dropdown.scss';

export interface DropdownLanguageOption extends DropdownOption {
  countryCode?: string;
  flag?: ReactNode;
}

export interface DropdownLanguageProps extends DropdownBaseProps {
  options: DropdownLanguageOption[];
  value?: string;
  onChange?: (value: string) => void;
  menuPlacement?: 'auto' | 'top' | 'bottom';
  mobileBehavior?: 'auto' | 'inline' | 'sheet';
}

export interface DropdownLanguageHandle {
  focus: () => void;
}

function FlagGlyph({ countryCode, flag }: { countryCode?: string; flag?: ReactNode }) {
  if (flag !== undefined) {
    return <span className="jf-dropdown__flag" aria-hidden>{flag}</span>;
  }
  const src = resolveFlag(countryCode);
  if (src) {
    return <img className="jf-dropdown__flag" src={src} alt="" aria-hidden />;
  }
  return (
    <span className="jf-dropdown__flag" aria-hidden>
      <Icon name="language" category="general" size={20} />
    </span>
  );
}

export const DropdownLanguage = forwardRef<DropdownLanguageHandle, DropdownLanguageProps>(
  (
    {
      options,
      value,
      onChange,
      size = 'md',
      status = 'default',
      disabled = false,
      placeholder = 'Select a language',
      menuPlacement = 'auto',
      mobileBehavior = 'auto',
      title,
      className,
      ...wrapperProps
    },
    ref
  ) => {
    const readOnly = status === 'readonly';
    const selectedIdx = options.findIndex((o) => o.value === value);
    const selected = selectedIdx >= 0 ? options[selectedIdx] : null;

    const {
      open,
      setOpen,
      activeIndex,
      rootRef,
      triggerRef,
      menuRef,
      toggle,
      handleTriggerKey,
      handleMenuKey,
      placement,
      isMobileSheet,
    } = useDropdown({
      disabled,
      readOnly,
      optionCount: options.length,
      onSelect: (i) => onChange?.(options[i].value),
      menuPlacement,
      mobileBehavior,
    });

    useImperativeHandle(ref, () => ({ focus: () => triggerRef.current?.focus() }));

    const triggerClass = [
      'jf-dropdown',
      `jf-dropdown--${size}`,
      `jf-dropdown--${status}`,
      disabled && 'jf-dropdown--disabled',
      open && 'jf-dropdown--open',
      'jf-dropdown--language',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <DropdownWrapper
        size={size}
        status={status}
        disabled={disabled}
        title={title}
        className={className}
        {...wrapperProps}
      >
        <div className="jf-dropdown__root" ref={rootRef}>
          <button
            ref={triggerRef}
            type="button"
            className={triggerClass}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={toggle}
            onKeyDown={handleTriggerKey}
          >
            <span className="jf-dropdown__leading">
              <FlagGlyph countryCode={selected?.countryCode} flag={selected?.flag} />
            </span>
            <span
              className={`jf-dropdown__value${selected ? '' : ' jf-dropdown__value--placeholder'}`}
            >
              {selected ? selected.label : placeholder}
            </span>
            <span className="jf-dropdown__trailing">
              <Icon name={open ? 'angle-up' : 'angle-down'} category="arrows" size={size === 'sm' ? 16 : 24} />
            </span>
          </button>

          {open && !disabled && !readOnly && (
            <DropdownMenuShell
              placement={placement}
              isSheet={isMobileSheet}
              title={title}
              menuRef={menuRef}
              triggerRef={triggerRef}
              onClose={() => setOpen(false)}
              onKeyDown={handleMenuKey}
            >
              {options.map((opt, i) => {
                const isSelected = opt.value === value;
                const isActive = i === activeIndex;
                const itemClass = [
                  'jf-dropdown__item',
                  isSelected && 'jf-dropdown__item--selected',
                  isActive && 'jf-dropdown__item--active',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <div
                    key={opt.value}
                    className={itemClass}
                    role="option"
                    aria-selected={isSelected}
                    data-dd-index={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange?.(opt.value);
                    }}
                  >
                    <span className="jf-dropdown__item-leading">
                      <FlagGlyph countryCode={opt.countryCode} flag={opt.flag} />
                    </span>
                    <span className="jf-dropdown__item-label">{opt.label}</span>
                  </div>
                );
              })}
            </DropdownMenuShell>
          )}
        </div>
      </DropdownWrapper>
    );
  }
);

DropdownLanguage.displayName = 'DropdownLanguage';
