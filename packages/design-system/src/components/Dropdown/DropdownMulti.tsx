import { forwardRef, useImperativeHandle } from 'react';
import { Icon } from '../Icon/Icon';
import { DropdownWrapper } from './DropdownWrapper';
import { DropdownMenuShell } from './DropdownMenuShell';
import { useDropdown } from './useDropdown';
import type { DropdownBaseProps, DropdownOption } from './types';
import './Dropdown.scss';

export interface DropdownMultiProps extends DropdownBaseProps {
  options: DropdownOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  menuPlacement?: 'auto' | 'top' | 'bottom';
  mobileBehavior?: 'auto' | 'inline' | 'sheet';
}

export interface DropdownMultiHandle {
  focus: () => void;
}

export const DropdownMulti = forwardRef<DropdownMultiHandle, DropdownMultiProps>(
  (
    {
      options,
      value = [],
      onChange,
      size = 'md',
      status = 'default',
      disabled = false,
      placeholder = 'Placeholder',
      menuPlacement = 'auto',
      mobileBehavior = 'auto',
      title,
      className,
      ...wrapperProps
    },
    ref
  ) => {
    const readOnly = status === 'readonly';
    const selectedSet = new Set(value);

    const toggleValue = (v: string) => {
      if (selectedSet.has(v)) {
        onChange?.(value.filter((x) => x !== v));
      } else {
        onChange?.([...value, v]);
      }
    };

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
      onSelect: (i) => toggleValue(options[i].value),
      closeOnSelect: false,
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
      'jf-dropdown--multi',
    ]
      .filter(Boolean)
      .join(' ');

    const selectedOptions = options.filter((o) => selectedSet.has(o.value));

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
            <span
              className={`jf-dropdown__value${selectedOptions.length === 0 ? ' jf-dropdown__value--placeholder' : ''}`}
            >
              {selectedOptions.length === 0 ? (
                placeholder
              ) : (
                <span className="jf-dropdown__chips">
                  {selectedOptions.map((opt) => (
                    <span key={opt.value} className="jf-dropdown__chip">
                      <span className="jf-dropdown__chip-label">{opt.label}</span>
                      <span
                        className="jf-dropdown__chip-remove"
                        role="button"
                        aria-label={`Remove ${opt.label}`}
                        tabIndex={-1}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!disabled && !readOnly) toggleValue(opt.value);
                        }}
                      >
                        <Icon name="xmark" category="general" size={12} />
                      </span>
                    </span>
                  ))}
                </span>
              )}
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
              multiselectable
            >
              {options.map((opt, i) => {
                const isSelected = selectedSet.has(opt.value);
                const isActive = i === activeIndex;
                const itemClass = [
                  'jf-dropdown__item',
                  'jf-dropdown__item--checkable',
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
                      toggleValue(opt.value);
                    }}
                  >
                    <span className="jf-dropdown__item-check" aria-hidden>
                      {isSelected && (
                        <Icon name="check-sm" category="general" size={16} />
                      )}
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

DropdownMulti.displayName = 'DropdownMulti';
