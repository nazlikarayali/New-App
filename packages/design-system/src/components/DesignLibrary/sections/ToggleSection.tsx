import { useState } from 'react';
import { Toggle } from '../../Toggle';
import type { ToggleSize } from '../../Toggle';

export interface TogglePanelState {
  size: ToggleSize;
  checked: boolean;
  error: boolean;
  loading: boolean;
  disabled: boolean;
  showLabel: boolean;
  showDescription: boolean;
  darkPreview: boolean;
}

export const defaultToggleState: TogglePanelState = {
  size: 'md',
  checked: false,
  error: false,
  loading: false,
  disabled: false,
  showLabel: false,
  showDescription: false,
  darkPreview: false,
};

export function ToggleSection({ state }: { state: TogglePanelState }) {
  const [checked, setChecked] = useState(state.checked);

  return (
    <div>
      <h1 className="dl-section__title">Toggle</h1>
      <p className="dl-section__description">
        Switch control with three sizes, error and loading states, and optional label + description. Based on native checkbox for form integration.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <Toggle
          size={state.size}
          error={state.error}
          loading={state.loading}
          disabled={state.disabled}
          checked={state.checked !== undefined ? checked : undefined}
          onChange={(e) => setChecked(e.target.checked)}
          label={state.showLabel ? 'Enable feature' : undefined}
          description={state.showDescription ? 'Turns on the feature for this workspace' : undefined}
        />
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Off</h3>
            <div className="dl-stories__item-preview">
              <Toggle size={state.size} />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">On</h3>
            <div className="dl-stories__item-preview">
              <Toggle size={state.size} defaultChecked />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Error</h3>
            <div className="dl-stories__item-preview">
              <Toggle size={state.size} error />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Loading</h3>
            <div className="dl-stories__item-preview">
              <Toggle size={state.size} loading />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Disabled</h3>
            <div className="dl-stories__item-preview">
              <Toggle size={state.size} disabled />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">With label</h3>
            <div className="dl-stories__item-preview">
              <Toggle size={state.size} label="Enable feature" description="Turns on the feature" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TogglePanel({
  state,
  onChange,
}: {
  state: TogglePanelState;
  onChange: (state: TogglePanelState) => void;
}) {
  const update = (partial: Partial<TogglePanelState>) => onChange({ ...state, ...partial });

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

      <div className="dl-playground__divider" />

      <ToggleField label="Error" value={state.error} onChange={(v) => update({ error: v })} />
      <ToggleField label="Loading" value={state.loading} onChange={(v) => update({ loading: v })} />
      <ToggleField label="Disabled" value={state.disabled} onChange={(v) => update({ disabled: v })} />
      <ToggleField label="Label" value={state.showLabel} onChange={(v) => update({ showLabel: v })} />
      <ToggleField label="Description" value={state.showDescription} onChange={(v) => update({ showDescription: v })} />
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
