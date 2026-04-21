import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Input } from '../../Input';
import { FormField } from '../../FormField';
import type { ButtonProps } from '../../Button';

export interface ButtonPanelState {
  variant: ButtonProps['variant'];
  colorScheme: ButtonProps['colorScheme'];
  shape: ButtonProps['shape'];
  size: ButtonProps['size'];
  showLeftIcon: boolean;
  showRightIcon: boolean;
  iconOnly: boolean;
  loading: boolean;
  disabled: boolean;
  label: string;
}

export const defaultButtonState: ButtonPanelState = {
  variant: 'filled',
  colorScheme: 'primary',
  shape: 'rectangle',
  size: 'md',
  showLeftIcon: true,
  showRightIcon: true,
  iconOnly: false,
  loading: false,
  disabled: false,
  label: 'Button',
};

export function ButtonSection({ panelState }: { panelState: ButtonPanelState }) {
  const { variant, colorScheme, shape, size, showLeftIcon, showRightIcon, iconOnly, loading, disabled, label } = panelState;

  return (
    <div>
      <h1 className="dl-section__title">Button</h1>
      <p className="dl-section__description">
        Buttons trigger actions. Available in filled, ghost, and transparent variants with primary, secondary, constructive, and destructive color schemes.
      </p>

      <div className="dl-playground__preview">
        <Button
          variant={variant}
          colorScheme={colorScheme}
          shape={shape}
          size={size}
          iconOnly={iconOnly}
          loading={loading}
          disabled={disabled}
          leftIcon={showLeftIcon && !iconOnly ? <Icon name="chevron-left" category="arrows" /> : undefined}
          rightIcon={showRightIcon || iconOnly ? <Icon name="chevron-right" category="arrows" /> : undefined}
        >
          {label}
        </Button>
      </div>
    </div>
  );
}

export function ButtonPanel({
  state,
  onChange,
}: {
  state: ButtonPanelState;
  onChange: (state: ButtonPanelState) => void;
}) {
  const update = (partial: Partial<ButtonPanelState>) => onChange({ ...state, ...partial });

  return (
    <>
      <SegmentedField
        label="Type"
        options={['basic', 'icon only']}
        value={state.iconOnly ? 'icon only' : 'basic'}
        onChange={(v) => update({ iconOnly: v === 'icon only' })}
      />

      <div className="dl-playground__divider" />

      <SegmentedField
        label="Variant"
        options={['filled', 'ghost', 'transparent']}
        value={state.variant!}
        onChange={(v) => update({ variant: v as ButtonPanelState['variant'] })}
      />
      <SelectField
        label="Style"
        options={['primary', 'secondary', 'constructive', 'destructive']}
        value={state.colorScheme!}
        onChange={(v) => update({ colorScheme: v as ButtonPanelState['colorScheme'] })}
      />
      <SegmentedField
        label="Shape"
        options={['rectangle', 'rounded']}
        value={state.shape!}
        onChange={(v) => update({ shape: v as ButtonPanelState['shape'] })}
      />
      <SegmentedField
        label="Size"
        options={['sm', 'md', 'lg']}
        value={state.size!}
        onChange={(v) => update({ size: v as ButtonPanelState['size'] })}
      />

      {!state.iconOnly && (
        <>
          <div className="dl-playground__divider" />

          <FormField size="md" title="Label" showTitle showDescription={false} showHelpText={false}>
            <Input size="sm" value={state.label} onChange={(e) => update({ label: e.target.value })} />
          </FormField>

          <ToggleField label="Left Icon" value={state.showLeftIcon} onChange={(v) => update({ showLeftIcon: v })} />
          <ToggleField label="Right Icon" value={state.showRightIcon} onChange={(v) => update({ showRightIcon: v })} />
        </>
      )}

      <div className="dl-playground__divider" />

      <ToggleField label="Loading" value={state.loading} onChange={(v) => update({ loading: v })} />
      <ToggleField label="Disabled" value={state.disabled} onChange={(v) => update({ disabled: v })} />
    </>
  );
}

function SegmentedField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="dl-playground__field">
      <label className="dl-playground__label">{label}</label>
      <div className="dl-playground__segmented">
        {options.map((opt) => (
          <button
            key={opt}
            className={`dl-playground__seg-btn ${value === opt ? 'dl-playground__seg-btn--active' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="dl-playground__field">
      <label className="dl-playground__label">{label}</label>
      <select
        className="dl-playground__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
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
