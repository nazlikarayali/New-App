import { UrlInput } from '../../UrlInput';
import { Input } from '../../Input';
import { FormField } from '../../FormField';

export interface UrlInputPanelState {
  size: 'sm' | 'md' | 'lg';
  status: 'default' | 'error' | 'success' | 'warning' | 'readonly';
  showCopyButton: boolean;
  disabled: boolean;
  darkPreview: boolean;
  urlPrefix: string;
  placeholder: string;
  showTitle: boolean;
  showDescription: boolean;
  showHelpText: boolean;
  showHelpIcon: boolean;
  required: boolean;
}

export const defaultUrlInputState: UrlInputPanelState = {
  size: 'md',
  status: 'default',
  showCopyButton: true,
  disabled: false,
  darkPreview: false,
  urlPrefix: 'https://',
  placeholder: 'example.com',
  showTitle: false,
  showDescription: false,
  showHelpText: false,
  showHelpIcon: true,
  required: false,
};

export function UrlInputSection({ state }: { state: UrlInputPanelState }) {
  const hasFormField = state.showTitle || state.showDescription || state.showHelpText;
  const formFieldStatus = state.status === 'readonly' ? 'default' : state.status;
  const formFieldSize = state.size === 'sm' ? 'md' : state.size;

  const input = (
    <UrlInput
      size={state.size}
      status={state.status}
      showCopyButton={state.showCopyButton}
      disabled={state.disabled}
      urlPrefix={state.urlPrefix}
      placeholder={state.placeholder}
    />
  );

  return (
    <div>
      <h1 className="dl-section__title">URL Input</h1>
      <p className="dl-section__description">
        URL input with protocol prefix addon and optional copy button.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <div style={{ width: 340 }}>
          {hasFormField ? (
            <FormField
              size={formFieldSize}
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
            <h3 className="dl-stories__item-title">Default URL Input</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><UrlInput size={state.size} placeholder="example.com" /></div>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Error URL Input</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><UrlInput size={state.size} status="error" placeholder="example.com" /></div>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Success URL Input</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><UrlInput size={state.size} status="success" placeholder="example.com" /></div>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Read Only URL Input</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><UrlInput size={state.size} status="readonly" placeholder="example.com" /></div>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Disabled URL Input</h3>
            <div className="dl-stories__item-preview">
              <div style={{ width: 340 }}><UrlInput size={state.size} disabled placeholder="example.com" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UrlInputPanel({
  state,
  onChange,
}: {
  state: UrlInputPanelState;
  onChange: (state: UrlInputPanelState) => void;
}) {
  const update = (partial: Partial<UrlInputPanelState>) => onChange({ ...state, ...partial });

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
        <label className="dl-playground__label">Status</label>
        <select
          className="dl-playground__select"
          value={state.status}
          onChange={(e) => update({ status: e.target.value as UrlInputPanelState['status'] })}
        >
          {(['default', 'error', 'success', 'warning', 'readonly'] as const).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1).replace('only', ' Only')}
            </option>
          ))}
        </select>
      </div>

      <FormField size="md" title="URL Prefix" showTitle showDescription={false} showHelpText={false}>
        <Input size="sm" value={state.urlPrefix} onChange={(e) => update({ urlPrefix: e.target.value })} />
      </FormField>

      <FormField size="md" title="Placeholder" showTitle showDescription={false} showHelpText={false}>
        <Input size="sm" value={state.placeholder} onChange={(e) => update({ placeholder: e.target.value })} />
      </FormField>

      <div className="dl-playground__divider" />

      <ToggleField label="Copy Button" value={state.showCopyButton} onChange={(v) => update({ showCopyButton: v })} />
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
