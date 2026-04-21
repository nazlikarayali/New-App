import { useState } from 'react';
import { DropdownSingle, DropdownMulti, DropdownLanguage } from '../../Dropdown';
import type { DropdownSize, DropdownStatus } from '../../Dropdown';

type DropdownKind = 'single' | 'multi' | 'language';
type MenuPlacement = 'auto' | 'top' | 'bottom';
type MobileBehavior = 'auto' | 'inline' | 'sheet';

export interface DropdownPanelState {
  kind: DropdownKind;
  size: DropdownSize;
  status: DropdownStatus;
  disabled: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showHelpText: boolean;
  showLeadingIcon: boolean;
  required: boolean;
  darkPreview: boolean;
  menuPlacement: MenuPlacement;
  mobileBehavior: MobileBehavior;
}

export const defaultDropdownState: DropdownPanelState = {
  kind: 'single',
  size: 'md',
  status: 'default',
  disabled: false,
  showTitle: true,
  showDescription: false,
  showHelpText: false,
  showLeadingIcon: true,
  required: false,
  darkPreview: false,
  menuPlacement: 'auto',
  mobileBehavior: 'auto',
};

const SINGLE_OPTIONS = [
  { value: '1', label: 'Option one' },
  { value: '2', label: 'Option two' },
  { value: '3', label: 'Option three' },
  { value: '4', label: 'Option four' },
];

const LANGUAGES = [
  { value: 'en', label: 'English', countryCode: 'us' },
  { value: 'tr', label: 'Türkçe', countryCode: 'tr' },
  { value: 'de', label: 'Deutsch', countryCode: 'de' },
  { value: 'fr', label: 'Français', countryCode: 'fr' },
  { value: 'es', label: 'Español', countryCode: 'es' },
];

export function DropdownSection({ state }: { state: DropdownPanelState }) {
  const [single, setSingle] = useState<string | undefined>();
  const [multi, setMulti] = useState<string[]>([]);
  const [lang, setLang] = useState<string>('en');

  const common = {
    size: state.size,
    status: state.status,
    disabled: state.disabled,
    showTitle: state.showTitle,
    showDescription: state.showDescription,
    showHelpText: state.showHelpText,
    required: state.required,
    title: 'Add title',
    description: 'Add description content',
    helperText: 'Add help content',
    menuPlacement: state.menuPlacement,
    mobileBehavior: state.mobileBehavior,
  };

  return (
    <div>
      <h1 className="dl-section__title">Dropdown</h1>
      <p className="dl-section__description">
        Single, multi, and language select dropdowns with title, description, helper text, and keyboard navigation. Three sizes, error/readonly/disabled states.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          {state.kind === 'single' && (
            <DropdownSingle
              {...common}
              options={SINGLE_OPTIONS}
              value={single}
              onChange={setSingle}
              placeholder="Placeholder"
              showLeadingIcon={state.showLeadingIcon}
            />
          )}
          {state.kind === 'multi' && (
            <DropdownMulti
              {...common}
              options={SINGLE_OPTIONS}
              value={multi}
              onChange={setMulti}
              placeholder="Placeholder"
            />
          )}
          {state.kind === 'language' && (
            <DropdownLanguage
              {...common}
              options={LANGUAGES}
              value={lang}
              onChange={setLang}
            />
          )}
        </div>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Single Select</h3>
            <div className="dl-stories__item-preview" style={{ width: 320 }}>
              <DropdownSingle size={state.size} options={SINGLE_OPTIONS} placeholder="Placeholder" />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Multi Select</h3>
            <div className="dl-stories__item-preview" style={{ width: 320 }}>
              <DropdownMulti size={state.size} options={SINGLE_OPTIONS} placeholder="Placeholder" value={['1', '3']} />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Language Select</h3>
            <div className="dl-stories__item-preview" style={{ width: 320 }}>
              <DropdownLanguage size={state.size} options={LANGUAGES} value="tr" />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Error</h3>
            <div className="dl-stories__item-preview" style={{ width: 320 }}>
              <DropdownSingle size={state.size} status="error" options={SINGLE_OPTIONS} placeholder="Placeholder" />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Disabled</h3>
            <div className="dl-stories__item-preview" style={{ width: 320 }}>
              <DropdownSingle size={state.size} disabled options={SINGLE_OPTIONS} placeholder="Placeholder" />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Read-only</h3>
            <div className="dl-stories__item-preview" style={{ width: 320 }}>
              <DropdownSingle size={state.size} status="readonly" options={SINGLE_OPTIONS} value="1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DropdownPanel({
  state,
  onChange,
}: {
  state: DropdownPanelState;
  onChange: (state: DropdownPanelState) => void;
}) {
  const update = (partial: Partial<DropdownPanelState>) => onChange({ ...state, ...partial });

  return (
    <>
      <div className="dl-playground__field">
        <label className="dl-playground__label">Kind</label>
        <div className="dl-playground__segmented">
          {(['single', 'multi', 'language'] as const).map((k) => (
            <button
              key={k}
              className={`dl-playground__seg-btn ${state.kind === k ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ kind: k })}
            >
              {k}
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

      <div className="dl-playground__field">
        <label className="dl-playground__label">Status</label>
        <div className="dl-playground__segmented">
          {(['default', 'error', 'readonly'] as const).map((s) => (
            <button
              key={s}
              className={`dl-playground__seg-btn ${state.status === s ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ status: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Menu Placement</label>
        <div className="dl-playground__segmented">
          {(['auto', 'top', 'bottom'] as const).map((p) => (
            <button
              key={p}
              className={`dl-playground__seg-btn ${state.menuPlacement === p ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ menuPlacement: p })}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Mobile Behavior</label>
        <div className="dl-playground__segmented">
          {(['auto', 'inline', 'sheet'] as const).map((m) => (
            <button
              key={m}
              className={`dl-playground__seg-btn ${state.mobileBehavior === m ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ mobileBehavior: m })}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__divider" />

      <ToggleField label="Title" value={state.showTitle} onChange={(v) => update({ showTitle: v })} />
      <ToggleField label="Description" value={state.showDescription} onChange={(v) => update({ showDescription: v })} />
      <ToggleField label="Helper Text" value={state.showHelpText} onChange={(v) => update({ showHelpText: v })} />
      {state.kind === 'single' && (
        <ToggleField label="Leading Icon" value={state.showLeadingIcon} onChange={(v) => update({ showLeadingIcon: v })} />
      )}
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
