import { useState } from 'react';
import { Checkbox } from '../../Checkbox';

export interface CheckboxPanelState {
  size: 'sm' | 'md' | 'lg';
  error: boolean;
  showIcon: boolean;
  showDescription: boolean;
  indeterminate: boolean;
  disabled: boolean;
  darkPreview: boolean;
}

export const defaultCheckboxState: CheckboxPanelState = {
  size: 'md',
  error: false,
  showIcon: false,
  showDescription: false,
  indeterminate: false,
  disabled: false,
  darkPreview: false,
};

export function CheckboxSection({ state }: { state: CheckboxPanelState }) {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  return (
    <div>
      <h1 className="dl-section__title">Checkbox</h1>
      <p className="dl-section__description">
        Checkbox with label, optional description, info icon, and indeterminate state. Supports three sizes and error state.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          <Checkbox
            size={state.size}
            error={state.error}
            showIcon={state.showIcon}
            showDescription={state.showDescription}
            indeterminate={state.indeterminate}
            disabled={state.disabled}
            label="First option"
            checked={checked1}
            onChange={(e) => setChecked1(e.target.checked)}
          />
          <Checkbox
            size={state.size}
            error={state.error}
            showIcon={state.showIcon}
            showDescription={state.showDescription}
            disabled={state.disabled}
            label="Second option"
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
          />
          <Checkbox
            size={state.size}
            error={state.error}
            showIcon={state.showIcon}
            showDescription={state.showDescription}
            disabled={state.disabled}
            label="Third option"
            checked={checked3}
            onChange={(e) => setChecked3(e.target.checked)}
          />
        </div>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Basic Checkbox</h3>
            <div className="dl-stories__item-preview">
              <Checkbox size={state.size} label="Checkbox label" checked />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Disabled Checkbox</h3>
            <div className="dl-stories__item-preview">
              <Checkbox size={state.size} label="Checkbox label" disabled />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Indeterminate Checkbox</h3>
            <div className="dl-stories__item-preview">
              <Checkbox size={state.size} label="Checkbox label" indeterminate checked={false} />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Error Checkbox</h3>
            <div className="dl-stories__item-preview">
              <Checkbox size={state.size} label="Checkbox label" error />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Label &amp; Description Checkbox</h3>
            <div className="dl-stories__item-preview">
              <Checkbox size={state.size} label="Checkbox label" description="Optional checkbox description" showDescription />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckboxPanel({
  state,
  onChange,
}: {
  state: CheckboxPanelState;
  onChange: (state: CheckboxPanelState) => void;
}) {
  const update = (partial: Partial<CheckboxPanelState>) => onChange({ ...state, ...partial });

  return (
    <>
      <div className="dl-playground__field">
        <label className="dl-playground__label">Variant</label>
        <div className="dl-playground__segmented">
          {([false, true] as const).map((v) => (
            <button
              key={String(v)}
              className={`dl-playground__seg-btn ${state.showDescription === v ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ showDescription: v })}
            >
              {v ? 'With Description' : 'Default'}
            </button>
          ))}
        </div>
      </div>

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

      <div className="dl-playground__divider" />

      <ToggleField label="Indeterminate" value={state.indeterminate} onChange={(v) => update({ indeterminate: v })} />
      <ToggleField label="Error" value={state.error} onChange={(v) => update({ error: v })} />
      <ToggleField label="Show Icon" value={state.showIcon} onChange={(v) => update({ showIcon: v })} />
      <ToggleField label="Disabled" value={state.disabled} onChange={(v) => update({ disabled: v })} />
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
