import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';
import './Modal.scss';

export type ModalSize = 'sm' | 'md' | 'lg';
export type ModalIntent = 'primary' | 'constructive' | 'destructive';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  intent?: ModalIntent;
  title: string;
  description?: string;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  footerDescription?: string;
  dismissOnBackdrop?: boolean;
  dismissOnEscape?: boolean;
  children?: ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  size = 'md',
  intent = 'primary',
  title,
  description,
  icon,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmLoading = false,
  confirmDisabled = false,
  footerDescription,
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    first?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (dismissOnEscape && e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusables.length === 0) return;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, dismissOnEscape]);

  if (!open) return null;

  const rootClass = ['jf-modal', `jf-modal--${size}`, className].filter(Boolean).join(' ');

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dismissOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="jf-modal__overlay" onMouseDown={handleBackdrop}>
      <div
        ref={dialogRef}
        className={rootClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jf-modal-title"
      >
        <header className="jf-modal__header">
          <div className="jf-modal__header-main">
            {icon && <span className="jf-modal__icon">{icon}</span>}
            <div className="jf-modal__heading">
              <h2 id="jf-modal-title" className="jf-modal__title">
                {title}
              </h2>
              {description && <p className="jf-modal__description">{description}</p>}
            </div>
          </div>
          <Button
            variant="filled"
            colorScheme="secondary"
            shape="rounded"
            iconOnly
            aria-label="Close"
            onClick={onClose}
            leftIcon={<Icon name="xmark" category="general" size={20} />}
          />
        </header>

        <div className="jf-modal__body">{children}</div>

        <footer className="jf-modal__footer">
          <div className="jf-modal__footer-description">
            {footerDescription && (
              <>
                <Icon name="info-circle-filled" category="general" size={16} />
                <span>{footerDescription}</span>
              </>
            )}
          </div>
          <div className="jf-modal__footer-actions">
            <Button variant="ghost" colorScheme="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              colorScheme={intent}
              onClick={onConfirm}
              loading={confirmLoading}
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </Button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}
