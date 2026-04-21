import { type ReactNode, type KeyboardEvent, type Ref } from 'react';
import { createPortal } from 'react-dom';

interface DropdownMenuShellProps {
  placement: 'top' | 'bottom';
  isSheet: boolean;
  title?: string;
  menuRef: Ref<HTMLDivElement>;
  triggerRef?: { readonly current: HTMLElement | null };
  onClose: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  multiselectable?: boolean;
  children: ReactNode;
}

function inheritThemeFrom(el: HTMLElement | null): string | undefined {
  let node: HTMLElement | null = el;
  while (node) {
    const theme = node.dataset?.theme;
    if (theme) return theme;
    node = node.parentElement;
  }
  return undefined;
}

export function DropdownMenuShell({
  placement,
  isSheet,
  title,
  menuRef,
  triggerRef,
  onClose,
  onKeyDown,
  multiselectable,
  children,
}: DropdownMenuShellProps) {
  if (isSheet) {
    const theme = inheritThemeFrom(triggerRef?.current ?? null);
    const sheet = (
      <div className="jf-dropdown__sheet-root" data-theme={theme}>
        <div className="jf-dropdown__sheet-backdrop" onClick={onClose} />
        <div
          ref={menuRef}
          className="jf-dropdown__menu jf-dropdown__menu--sheet"
          role="listbox"
          aria-multiselectable={multiselectable || undefined}
          tabIndex={-1}
          onKeyDown={onKeyDown}
        >
          <div className="jf-dropdown__sheet-handle" aria-hidden />
          {title && <div className="jf-dropdown__sheet-title">{title}</div>}
          <div className="jf-dropdown__sheet-list">{children}</div>
        </div>
      </div>
    );
    return createPortal(sheet, document.body);
  }

  const menuClass = `jf-dropdown__menu jf-dropdown__menu--${placement}`;
  return (
    <div
      ref={menuRef}
      className={menuClass}
      role="listbox"
      aria-multiselectable={multiselectable || undefined}
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
