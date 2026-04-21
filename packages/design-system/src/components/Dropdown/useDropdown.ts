import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface UseDropdownOptions {
  disabled?: boolean;
  readOnly?: boolean;
  optionCount: number;
  onSelect: (index: number) => void;
  closeOnSelect?: boolean;
  menuPlacement?: 'auto' | 'top' | 'bottom';
  mobileBehavior?: 'auto' | 'inline' | 'sheet';
}

const MOBILE_MEDIA = '(max-width: 768px)';

export function useDropdown({
  disabled,
  readOnly,
  optionCount,
  onSelect,
  closeOnSelect = true,
  menuPlacement = 'auto',
  mobileBehavior = 'auto',
}: UseDropdownOptions) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [resolvedPlacement, setResolvedPlacement] = useState<'top' | 'bottom'>('bottom');
  const [isMobileSheet, setIsMobileSheet] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA);
    const evaluate = () => {
      if (mobileBehavior === 'sheet') setIsMobileSheet(true);
      else if (mobileBehavior === 'inline') setIsMobileSheet(false);
      else setIsMobileSheet(mq.matches);
    };
    evaluate();
    mq.addEventListener('change', evaluate);
    return () => mq.removeEventListener('change', evaluate);
  }, [mobileBehavior]);

  useLayoutEffect(() => {
    if (!open || isMobileSheet) return;
    if (menuPlacement !== 'auto') {
      setResolvedPlacement(menuPlacement);
      return;
    }
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedMenuH = Math.min(280, optionCount * 40 + 8);
    if (spaceBelow < estimatedMenuH + 16 && spaceAbove > spaceBelow) {
      setResolvedPlacement('top');
    } else {
      setResolvedPlacement('bottom');
    }
  }, [open, menuPlacement, optionCount, isMobileSheet]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    if (isMobileSheet) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobileSheet]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const item = menuRef.current?.querySelector<HTMLElement>(`[data-dd-index="${activeIndex}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const handleTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((i) => Math.min(i + 1, optionCount - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(optionCount - 1);
      } else {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleMenuKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, optionCount - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIndex >= 0) {
        onSelect(activeIndex);
        if (closeOnSelect) setOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const toggle = () => {
    if (disabled || readOnly) return;
    setOpen((o) => !o);
  };

  return {
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    rootRef,
    triggerRef,
    menuRef,
    toggle,
    handleTriggerKey,
    handleMenuKey,
    placement: resolvedPlacement,
    isMobileSheet,
  };
}
