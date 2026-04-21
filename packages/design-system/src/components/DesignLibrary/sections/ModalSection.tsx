import { useState } from 'react';
import { Modal } from '../../Modal';
import type { ModalSize, ModalIntent } from '../../Modal';
import { Button } from '../../Button';
import { Icon } from '../../Icon';

export interface ModalPanelState {
  size: ModalSize;
  intent: ModalIntent;
  showIcon: boolean;
  showDescription: boolean;
  showFooterDescription: boolean;
  longBody: boolean;
  darkPreview: boolean;
}

export const defaultModalState: ModalPanelState = {
  size: 'md',
  intent: 'primary',
  showIcon: true,
  showDescription: true,
  showFooterDescription: true,
  longBody: false,
  darkPreview: false,
};

const INTENT_LABEL: Record<ModalIntent, string> = {
  primary: 'Confirm',
  constructive: 'Save changes',
  destructive: 'Delete',
};

export function ModalSection({ state }: { state: ModalPanelState }) {
  const [open, setOpen] = useState(false);

  const body = state.longBody ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <p key={i} style={{ margin: 0, color: 'inherit' }}>
          Paragraph {i + 1} — Long content that will scroll inside the modal body while the header and footer stay pinned. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      ))}
    </div>
  ) : (
    <p style={{ margin: 0 }}>
      Body content goes here. Replace with any layout or form. The modal handles scroll, focus trap, Escape, and backdrop click automatically.
    </p>
  );

  return (
    <div>
      <h1 className="dl-section__title">Modal</h1>
      <p className="dl-section__description">
        Composed modal with header (icon, title, description, close), scrollable body, and footer (optional description + cancel/confirm actions). Built-in Escape, backdrop dismiss, body scroll lock, and focus trap.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <Button colorScheme={state.intent} onClick={() => setOpen(true)}>
          Open modal
        </Button>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size={state.size}
          intent={state.intent}
          title="Swap accounts"
          description={state.showDescription ? 'Move your data from one account to another.' : undefined}
          icon={state.showIcon ? <Icon name="arrows-switch-horizontal" category="arrows" size={24} /> : undefined}
          confirmLabel={INTENT_LABEL[state.intent]}
          cancelLabel="Cancel"
          onConfirm={() => setOpen(false)}
          footerDescription={state.showFooterDescription ? 'This action can be reversed within 24 hours.' : undefined}
        >
          {body}
        </Modal>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Primary action</h3>
            <StoryModal size={state.size} intent="primary" />
          </div>
          <div>
            <h3 className="dl-stories__item-title">Constructive action</h3>
            <StoryModal size={state.size} intent="constructive" label="Save" />
          </div>
          <div>
            <h3 className="dl-stories__item-title">Destructive action</h3>
            <StoryModal size={state.size} intent="destructive" label="Delete" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryModal({ size, intent, label = 'Confirm' }: { size: ModalSize; intent: ModalIntent; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dl-stories__item-preview">
      <Button colorScheme={intent} onClick={() => setOpen(true)}>
        Open {intent}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        intent={intent}
        title={`${intent[0].toUpperCase() + intent.slice(1)} modal`}
        description="Short description for context."
        confirmLabel={label}
        onConfirm={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>Body content.</p>
      </Modal>
    </div>
  );
}

export function ModalPanel({
  state,
  onChange,
}: {
  state: ModalPanelState;
  onChange: (state: ModalPanelState) => void;
}) {
  const update = (partial: Partial<ModalPanelState>) => onChange({ ...state, ...partial });

  return (
    <>
      <div className="dl-playground__field">
        <label className="dl-playground__label">Size</label>
        <div className="dl-playground__segmented">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <button
              key={s}
              className={`dl-playground__seg-btn ${state.size === s ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ size: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Intent</label>
        <div className="dl-playground__segmented">
          {(['primary', 'constructive', 'destructive'] as const).map((i) => (
            <button
              key={i}
              className={`dl-playground__seg-btn ${state.intent === i ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ intent: i })}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__divider" />

      <ToggleField label="Icon" value={state.showIcon} onChange={(v) => update({ showIcon: v })} />
      <ToggleField label="Description" value={state.showDescription} onChange={(v) => update({ showDescription: v })} />
      <ToggleField label="Footer description" value={state.showFooterDescription} onChange={(v) => update({ showFooterDescription: v })} />
      <ToggleField label="Long body (scroll)" value={state.longBody} onChange={(v) => update({ longBody: v })} />
      <ToggleField label="Dark Preview" value={state.darkPreview} onChange={(v) => update({ darkPreview: v })} />
    </>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="dl-playground__field dl-playground__field--row">
      <label className="dl-playground__label">{label}</label>
      <button
        className={`dl-playground__toggle ${value ? 'dl-playground__toggle--on' : ''}`}
        onClick={() => onChange(!value)}
      >
        <span className="dl-playground__toggle-thumb" />
      </button>
    </div>
  );
}
