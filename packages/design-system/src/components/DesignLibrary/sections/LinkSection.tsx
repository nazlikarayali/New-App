import { Link } from '../../Link';
import type { LinkSize, LinkColorScheme } from '../../Link';
import { Icon } from '../../Icon';

export interface LinkPanelState {
  size: LinkSize;
  colorScheme: LinkColorScheme;
  showLeftIcon: boolean;
  showRightIcon: boolean;
  disabled: boolean;
  darkPreview: boolean;
}

export const defaultLinkState: LinkPanelState = {
  size: 'lg',
  colorScheme: 'primary',
  showLeftIcon: false,
  showRightIcon: true,
  disabled: false,
  darkPreview: false,
};

export function LinkSection({ state }: { state: LinkPanelState }) {
  const leftIcon = state.showLeftIcon ? <Icon name="angle-left" category="arrows" size={16} /> : undefined;
  const rightIcon = state.showRightIcon ? <Icon name="angle-right" category="arrows" size={16} /> : undefined;

  return (
    <div>
      <h1 className="dl-section__title">Link</h1>
      <p className="dl-section__description">
        Inline text link with optional left/right icons. Renders an anchor when href is passed, otherwise a button. Default, hover (underline), focused (background + ring), disabled.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <Link
          size={state.size}
          colorScheme={state.colorScheme}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          disabled={state.disabled}
        >
          Text Link
        </Link>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Primary</h3>
            <div className="dl-stories__item-preview">
              <Link size={state.size}>Read the docs</Link>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Constructive</h3>
            <div className="dl-stories__item-preview">
              <Link size={state.size} colorScheme="constructive">Save changes</Link>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Destructive</h3>
            <div className="dl-stories__item-preview">
              <Link size={state.size} colorScheme="destructive">Delete forever</Link>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">With left icon</h3>
            <div className="dl-stories__item-preview">
              <Link size={state.size} leftIcon={<Icon name="angle-left" category="arrows" size={16} />}>
                Back
              </Link>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">With right icon</h3>
            <div className="dl-stories__item-preview">
              <Link size={state.size} rightIcon={<Icon name="angle-right" category="arrows" size={16} />}>
                Continue
              </Link>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">As anchor</h3>
            <div className="dl-stories__item-preview">
              <Link size={state.size} href="#external">Open external</Link>
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Disabled</h3>
            <div className="dl-stories__item-preview">
              <Link size={state.size} disabled>Cannot click</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LinkPanel({
  state,
  onChange,
}: {
  state: LinkPanelState;
  onChange: (state: LinkPanelState) => void;
}) {
  const update = (partial: Partial<LinkPanelState>) => onChange({ ...state, ...partial });

  return (
    <>
      <div className="dl-playground__field">
        <label className="dl-playground__label">Size</label>
        <div className="dl-playground__segmented">
          {(['sm', 'lg'] as const).map((s) => (
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
        <label className="dl-playground__label">Color</label>
        <div className="dl-playground__segmented">
          {(['primary', 'constructive', 'destructive'] as const).map((c) => (
            <button
              key={c}
              className={`dl-playground__seg-btn ${state.colorScheme === c ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ colorScheme: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__divider" />

      <ToggleField label="Left icon" value={state.showLeftIcon} onChange={(v) => update({ showLeftIcon: v })} />
      <ToggleField label="Right icon" value={state.showRightIcon} onChange={(v) => update({ showRightIcon: v })} />
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
