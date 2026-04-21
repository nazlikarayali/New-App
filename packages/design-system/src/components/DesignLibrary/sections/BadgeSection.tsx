import { Badge } from '../../Badge';
import type {
  BadgeSize,
  BadgeShape,
  BadgeEmphasis,
  BadgeStatus,
} from '../../Badge';
import { Icon } from '../../Icon';
import { DropdownSingle } from '../../Dropdown';

export interface BadgePanelState {
  size: BadgeSize;
  shape: BadgeShape;
  emphasis: BadgeEmphasis;
  status: BadgeStatus;
  showIcon: boolean;
  darkPreview: boolean;
}

export const defaultBadgeState: BadgePanelState = {
  size: 'md',
  shape: 'rounded',
  emphasis: 'subtle',
  status: 'success',
  showIcon: true,
  darkPreview: false,
};

const STATUS_ICON: Record<BadgeStatus, { name: string; category: string }> = {
  success: { name: 'check', category: 'general' },
  error: { name: 'xmark', category: 'general' },
  warning: { name: 'exclamation', category: 'general' },
  information: { name: 'info', category: 'general' },
  neutral: { name: 'circle-sm-filled', category: 'general' },
};

export function BadgeSection({ state }: { state: BadgePanelState }) {
  const iconDef = STATUS_ICON[state.status];
  const icon = state.showIcon ? <Icon name={iconDef.name} category={iconDef.category} size={14} /> : undefined;

  return (
    <div>
      <h1 className="dl-section__title">Badge</h1>
      <p className="dl-section__description">
        Status badge with sm/md/lg sizes, rounded or rectangle shape, subtle or bold emphasis, and 5 statuses (success, error, warning, information, neutral). Optional leading icon.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <Badge size={state.size} shape={state.shape} emphasis={state.emphasis} status={state.status} icon={icon}>
          Label
        </Badge>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">All statuses (Subtle / Rounded)</h3>
            <div className="dl-stories__item-preview" style={{ gap: 8, flexWrap: 'wrap' }}>
              {(['success', 'error', 'warning', 'information', 'neutral'] as const).map((s) => (
                <Badge key={s} status={s} size={state.size}>
                  {s[0].toUpperCase() + s.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">All statuses (Bold / Rounded)</h3>
            <div className="dl-stories__item-preview" style={{ gap: 8, flexWrap: 'wrap' }}>
              {(['success', 'error', 'warning', 'information', 'neutral'] as const).map((s) => (
                <Badge key={s} status={s} emphasis="bold" size={state.size}>
                  {s[0].toUpperCase() + s.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Rectangle shape</h3>
            <div className="dl-stories__item-preview" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Badge shape="rectangle" status="success" size={state.size}>Success</Badge>
              <Badge shape="rectangle" status="error" emphasis="bold" size={state.size}>Error</Badge>
              <Badge shape="rectangle" status="warning" size={state.size}>Warning</Badge>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">With icons</h3>
            <div className="dl-stories__item-preview" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Badge status="success" icon={<Icon name="check" category="general" size={14} />} size={state.size}>Active</Badge>
              <Badge status="error" emphasis="bold" icon={<Icon name="xmark" category="general" size={14} />} size={state.size}>Failed</Badge>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">All sizes</h3>
            <div className="dl-stories__item-preview" style={{ gap: 8, alignItems: 'center' }}>
              <Badge size="sm" status="success">Small</Badge>
              <Badge size="md" status="success">Default</Badge>
              <Badge size="lg" status="success">Large</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BadgePanel({
  state,
  onChange,
}: {
  state: BadgePanelState;
  onChange: (state: BadgePanelState) => void;
}) {
  const update = (partial: Partial<BadgePanelState>) => onChange({ ...state, ...partial });

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
        <label className="dl-playground__label">Shape</label>
        <div className="dl-playground__segmented">
          {(['rounded', 'rectangle'] as const).map((s) => (
            <button
              key={s}
              className={`dl-playground__seg-btn ${state.shape === s ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ shape: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Emphasis</label>
        <div className="dl-playground__segmented">
          {(['subtle', 'bold'] as const).map((e) => (
            <button
              key={e}
              className={`dl-playground__seg-btn ${state.emphasis === e ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ emphasis: e })}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Status</label>
        <DropdownSingle
          size="sm"
          showLeadingIcon={false}
          value={state.status}
          onChange={(v) => update({ status: v as BadgeStatus })}
          options={[
            { value: 'success', label: 'Success' },
            { value: 'error', label: 'Error' },
            { value: 'warning', label: 'Warning' },
            { value: 'information', label: 'Information' },
            { value: 'neutral', label: 'Neutral' },
          ]}
        />
      </div>

      <div className="dl-playground__divider" />

      <ToggleField label="Icon" value={state.showIcon} onChange={(v) => update({ showIcon: v })} />
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
