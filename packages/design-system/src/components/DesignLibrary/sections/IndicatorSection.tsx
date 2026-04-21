import { Indicator } from '../../Indicator';
import type { IndicatorSize, IndicatorStyle, IndicatorStatus } from '../../Indicator';

export interface IndicatorPanelState {
  size: IndicatorSize;
  style: IndicatorStyle;
  status: IndicatorStatus;
  count: string;
  darkPreview: boolean;
}

export const defaultIndicatorState: IndicatorPanelState = {
  size: 'md',
  style: 'color',
  status: 'information',
  count: '3',
  darkPreview: false,
};

export function IndicatorSection({ state }: { state: IndicatorPanelState }) {
  return (
    <div>
      <h1 className="dl-section__title">Indicator</h1>
      <p className="dl-section__description">
        Notification indicator in Color (solid + white text), Light (white bg + status text), or Dot (small colored circle) styles. Three sizes and four statuses.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={state.darkPreview ? 'dark' : undefined}
        style={state.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <Indicator size={state.size} style={state.style} status={state.status}>
          {state.style === 'dot' ? null : state.count}
        </Indicator>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Color</h3>
            <div className="dl-stories__item-preview" style={{ gap: 12, alignItems: 'center' }}>
              {(['information', 'success', 'error', 'neutral'] as const).map((s) => (
                <Indicator key={s} status={s} size={state.size}>3</Indicator>
              ))}
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Light</h3>
            <div className="dl-stories__item-preview" style={{ gap: 12, alignItems: 'center' }}>
              {(['information', 'success', 'error', 'neutral'] as const).map((s) => (
                <Indicator key={s} style="light" status={s} size={state.size}>9</Indicator>
              ))}
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Dot</h3>
            <div className="dl-stories__item-preview" style={{ gap: 12, alignItems: 'center' }}>
              {(['information', 'success', 'error', 'neutral'] as const).map((s) => (
                <Indicator key={s} style="dot" status={s} size={state.size} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">All sizes</h3>
            <div className="dl-stories__item-preview" style={{ gap: 12, alignItems: 'center' }}>
              <Indicator size="sm" status="error">9</Indicator>
              <Indicator size="md" status="error">12</Indicator>
              <Indicator size="lg" status="error">99+</Indicator>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IndicatorPanel({
  state,
  onChange,
}: {
  state: IndicatorPanelState;
  onChange: (state: IndicatorPanelState) => void;
}) {
  const update = (partial: Partial<IndicatorPanelState>) => onChange({ ...state, ...partial });

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
        <label className="dl-playground__label">Style</label>
        <div className="dl-playground__segmented">
          {(['color', 'light', 'dot'] as const).map((st) => (
            <button
              key={st}
              className={`dl-playground__seg-btn ${state.style === st ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ style: st })}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Status</label>
        <div className="dl-playground__segmented">
          {(['information', 'success', 'error', 'neutral'] as const).map((s) => (
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

      {state.style !== 'dot' && (
        <div className="dl-playground__field">
          <label className="dl-playground__label">Count</label>
          <input
            className="dl-playground__input"
            type="text"
            value={state.count}
            onChange={(e) => update({ count: e.target.value })}
          />
        </div>
      )}

      <div className="dl-playground__divider" />

      <div className="dl-playground__field dl-playground__field--row">
        <label className="dl-playground__label">Dark Preview</label>
        <button
          className={`dl-playground__toggle ${state.darkPreview ? 'dl-playground__toggle--on' : ''}`}
          onClick={() => update({ darkPreview: !state.darkPreview })}
        >
          <span className="dl-playground__toggle-thumb" />
        </button>
      </div>
    </>
  );
}
