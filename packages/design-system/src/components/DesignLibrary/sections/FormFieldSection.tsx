import { useState } from 'react';
import { FormField } from '../../FormField';
import { Input } from '../../Input';

export interface FormFieldPanelState {
  size: 'md' | 'lg';
  status: 'default' | 'error' | 'success' | 'warning';
  showTitle: boolean;
  showDescription: boolean;
  showHelpText: boolean;
  required: boolean;
  disabled: boolean;
  darkPreview: boolean;
  title: string;
  description: string;
  helpText: string;
}

export const defaultFormFieldState: FormFieldPanelState = {
  size: 'lg',
  status: 'default',
  showTitle: true,
  showDescription: true,
  showHelpText: true,
  required: false,
  disabled: false,
  darkPreview: false,
  title: 'Add title',
  description: 'Add description content',
  helpText: 'Add help content',
};

export function FormFieldSection({ state }: { state: FormFieldPanelState }) {
  const [value, setValue] = useState('');

  return (
    <div>
      <h1 className="dl-section__title">Form Field</h1>
      <p className="dl-section__description">
        Shared wrapper for all input components with title, description, and help text. Wraps any input type.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <div style={{ width: 340 }}>
          <FormField
            size={state.size}
            status={state.status}
            disabled={state.disabled}
            title={state.title}
            description={state.description}
            helpText={state.helpText}
            required={state.required}
            showTitle={state.showTitle}
            showDescription={state.showDescription}
            showHelpText={state.showHelpText}
          >
            <Input
              size={state.size === 'lg' ? 'lg' : 'md'}
              status={state.status}
              disabled={state.disabled}
              placeholder="Placeholder text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

export function FormFieldPanel({
  state,
  onChange,
}: {
  state: FormFieldPanelState;
  onChange: (state: FormFieldPanelState) => void;
}) {
  const update = (partial: Partial<FormFieldPanelState>) => onChange({ ...state, ...partial });

  return (
    <>
      <div className="dl-playground__field">
        <label className="dl-playground__label">Size</label>
        <div className="dl-playground__segmented">
          {(['md', 'lg'] as const).map((s) => (
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
        <label className="dl-playground__label">Status</label>
        <select
          className="dl-playground__select"
          value={state.status}
          onChange={(e) => update({ status: e.target.value as FormFieldPanelState['status'] })}
        >
          {(['default', 'error', 'success', 'warning'] as const).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Title</label>
        <input
          type="text"
          className="dl-playground__input"
          value={state.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Description</label>
        <input
          type="text"
          className="dl-playground__input"
          value={state.description}
          onChange={(e) => update({ description: e.target.value })}
        />
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Help Text</label>
        <input
          type="text"
          className="dl-playground__input"
          value={state.helpText}
          onChange={(e) => update({ helpText: e.target.value })}
        />
      </div>

      <div className="dl-playground__divider" />

      <ToggleField label="Show Title" value={state.showTitle} onChange={(v) => update({ showTitle: v })} />
      <ToggleField label="Show Description" value={state.showDescription} onChange={(v) => update({ showDescription: v })} />
      <ToggleField label="Show Help Text" value={state.showHelpText} onChange={(v) => update({ showHelpText: v })} />
      <ToggleField label="Required" value={state.required} onChange={(v) => update({ required: v })} />
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
