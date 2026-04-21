import { useState } from 'react';
import { RadioButton } from '../../RadioButton';

export interface RadioButtonPanelState {
  size: 'sm' | 'md' | 'lg';
  error: boolean;
  showIcon: boolean;
  showDescription: boolean;
  disabled: boolean;
  darkPreview: boolean;
}

export const defaultRadioButtonState: RadioButtonPanelState = {
  size: 'md',
  error: false,
  showIcon: false,
  showDescription: false,
  disabled: false,
  darkPreview: false,
};

export function RadioButtonSection({ state }: { state: RadioButtonPanelState }) {
  const [selected, setSelected] = useState<string>('option1');

  return (
    <div>
      <h1 className="dl-section__title">Radio Button</h1>
      <p className="dl-section__description">
        Radio button with label and optional info icon. Supports three sizes, error state, and disabled state.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          <RadioButton
            size={state.size}
            error={state.error}
            showIcon={state.showIcon}
            showDescription={state.showDescription}
            disabled={state.disabled}
            label="First option"
            name="demo-radio"
            value="option1"
            checked={selected === 'option1'}
            onChange={() => setSelected('option1')}
          />
          <RadioButton
            size={state.size}
            error={state.error}
            showIcon={state.showIcon}
            showDescription={state.showDescription}
            disabled={state.disabled}
            label="Second option"
            name="demo-radio"
            value="option2"
            checked={selected === 'option2'}
            onChange={() => setSelected('option2')}
          />
          <RadioButton
            size={state.size}
            error={state.error}
            showIcon={state.showIcon}
            showDescription={state.showDescription}
            disabled={state.disabled}
            label="Third option"
            name="demo-radio"
            value="option3"
            checked={selected === 'option3'}
            onChange={() => setSelected('option3')}
          />
        </div>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Basic Radio Button</h3>
            <div className="dl-stories__item-preview">
              <RadioButton size={state.size} label="Radio label" checked name="story-basic" />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Disabled Radio Button</h3>
            <div className="dl-stories__item-preview">
              <RadioButton size={state.size} label="Radio label" disabled name="story-disabled" />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Error Radio Button</h3>
            <div className="dl-stories__item-preview">
              <RadioButton size={state.size} label="Radio label" error name="story-error" />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Label &amp; Description Radio Button</h3>
            <div className="dl-stories__item-preview">
              <RadioButton size={state.size} label="Radio label" description="Optional radio description" showDescription name="story-desc" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RadioButtonPanel({
  state,
  onChange,
}: {
  state: RadioButtonPanelState;
  onChange: (state: RadioButtonPanelState) => void;
}) {
  const update = (partial: Partial<RadioButtonPanelState>) => onChange({ ...state, ...partial });

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
