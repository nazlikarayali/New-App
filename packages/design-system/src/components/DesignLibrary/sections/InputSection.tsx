import { SearchInput } from '../../SearchInput';

// ============================================
// Search Input Panel State
// ============================================
export interface SearchInputPanelState {
  size: 'sm' | 'md' | 'lg';
  showFilter: boolean;
  disabled: boolean;
  darkPreview: boolean;
}

export const defaultSearchInputState: SearchInputPanelState = {
  size: 'md',
  showFilter: false,
  disabled: false,
  darkPreview: false,
};

// ============================================
// Main Section
// ============================================
export function InputSection({
  searchState,
}: {
  searchState: SearchInputPanelState;
}) {
  return (
    <div>
      <h1 className="dl-section__title">Search Input</h1>
      <p className="dl-section__description">
        Search input with optional filter button. Available in three sizes with hover, focus, and disabled states.
      </p>

      <div
        className="dl-playground__preview"
        data-theme={searchState.darkPreview ? 'dark' : undefined}
        style={searchState.darkPreview ? { background: 'var(--secondary-background-medium)' } : undefined}
      >
        <div style={{ width: 340 }}>
          <SearchInput
            size={searchState.size}
            showFilter={searchState.showFilter}
            disabled={searchState.disabled}
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Right Sidebar Panel
// ============================================
export function InputPanel({
  searchState,
  onSearchStateChange,
}: {
  searchState: SearchInputPanelState;
  onSearchStateChange: (state: SearchInputPanelState) => void;
}) {
  const update = (partial: Partial<SearchInputPanelState>) =>
    onSearchStateChange({ ...searchState, ...partial });

  return (
    <>
      <div className="dl-playground__field">
        <label className="dl-playground__label">Size</label>
        <div className="dl-playground__segmented">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <button
              key={s}
              className={`dl-playground__seg-btn ${searchState.size === s ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ size: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__divider" />

      <ToggleField label="Filter" value={searchState.showFilter} onChange={(v) => update({ showFilter: v })} />
      <ToggleField label="Disabled" value={searchState.disabled} onChange={(v) => update({ disabled: v })} />
      <ToggleField label="Dark Preview" value={searchState.darkPreview} onChange={(v) => update({ darkPreview: v })} />
    </>
  );
}

// ============================================
// Shared UI
// ============================================
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
