import { useState } from 'react';
import { TextArea } from '../../TextArea';
import { Input } from '../../Input';
import { NumberInput } from '../../NumberInput';
import { FormField } from '../../FormField';

export interface TextAreaPanelState {
  size: 'md' | 'lg';
  status: 'default' | 'error' | 'readonly';
  showCount: boolean;
  showDrag: boolean;
  disabled: boolean;
  darkPreview: boolean;
  placeholder: string;
  maxLength: number;
  showTitle: boolean;
  showDescription: boolean;
  showHelpText: boolean;
  showHelpIcon: boolean;
  required: boolean;
}

export const defaultTextAreaState: TextAreaPanelState = {
  size: 'lg',
  status: 'default',
  showCount: true,
  showDrag: true,
  disabled: false,
  darkPreview: false,
  placeholder: 'Placeholder text',
  maxLength: 300,
  showTitle: false,
  showDescription: false,
  showHelpText: false,
  showHelpIcon: true,
  required: false,
};

export function TextAreaSection({ state }: { state: TextAreaPanelState }) {
  const [value, setValue] = useState('');
  const hasFormField = state.showTitle || state.showDescription || state.showHelpText;
  const formFieldStatus = state.status === 'readonly' ? 'default' : state.status === 'error' ? 'error' : 'default';

  const input = (
    <TextArea
      size={state.size}
      status={state.status}
      showCount={state.showCount}
      showDrag={state.showDrag}
      disabled={state.disabled}
      placeholder={state.placeholder}
      maxLength={state.maxLength}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );

  return (
    <div>
      <h1 className="dl-section__title">Text Area</h1>
      <p className="dl-section__description">
        Multi-line text input with optional character count and resize support.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <div style={{ width: 340 }}>
          {hasFormField ? (
            <FormField
              size={state.size}
              status={formFieldStatus}
              disabled={state.disabled}
              showTitle={state.showTitle}
              showDescription={state.showDescription}
              showHelpText={state.showHelpText}
              showHelpIcon={state.showHelpIcon}
              required={state.required}
            >
              {input}
            </FormField>
          ) : input}
        </div>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Default Text Area</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><TextArea size={state.size} placeholder="Placeholder text" /></div>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Error Text Area</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><TextArea size={state.size} status="error" placeholder="Placeholder text" /></div>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Read Only Text Area</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><TextArea size={state.size} status="readonly" placeholder="Placeholder text" /></div>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Disabled Text Area</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><TextArea size={state.size} disabled placeholder="Placeholder text" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TextAreaPanel({
  state,
  onChange,
}: {
  state: TextAreaPanelState;
  onChange: (state: TextAreaPanelState) => void;
}) {
  const update = (partial: Partial<TextAreaPanelState>) => onChange({ ...state, ...partial });

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
          onChange={(e) => update({ status: e.target.value as TextAreaPanelState['status'] })}
        >
          {(['default', 'error', 'readonly'] as const).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1).replace('only', ' Only')}
            </option>
          ))}
        </select>
      </div>

      <FormField size="md" title="Placeholder" showTitle showDescription={false} showHelpText={false}>
        <Input size="sm" value={state.placeholder} onChange={(e) => update({ placeholder: e.target.value })} />
      </FormField>

      <FormField size="md" title="Max Length" showTitle showDescription={false} showHelpText={false}>
        <NumberInput size="sm" value={state.maxLength} onChange={(v) => update({ maxLength: v ?? 300 })} showUnit={false} />
      </FormField>

      <div className="dl-playground__divider" />

      <ToggleField label="Show Count" value={state.showCount} onChange={(v) => update({ showCount: v })} />
      <ToggleField label="Show Drag" value={state.showDrag} onChange={(v) => update({ showDrag: v })} />
      <ToggleField label="Disabled" value={state.disabled} onChange={(v) => update({ disabled: v })} />
      <ToggleField label="Dark Preview" value={state.darkPreview} onChange={(v) => update({ darkPreview: v })} />

      <div className="dl-playground__divider" />

      <ToggleField label="Show Title" value={state.showTitle} onChange={(v) => update({ showTitle: v })} />
      <ToggleField label="Show Description" value={state.showDescription} onChange={(v) => update({ showDescription: v })} />
      <ToggleField label="Show Help Text" value={state.showHelpText} onChange={(v) => update({ showHelpText: v })} />
      {state.showHelpText && <ToggleField label="Show Help Icon" value={state.showHelpIcon} onChange={(v) => update({ showHelpIcon: v })} />}
      {state.showTitle && <ToggleField label="Required" value={state.required} onChange={(v) => update({ required: v })} />}
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
