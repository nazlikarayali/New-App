import type { RegisteredComponent } from '../types/registry';
import type { VariantValues, PropertyValues, StateValues } from '../types/component';
import { IconPicker } from './components/IconPicker';
import { resolveSemanticLabel } from '../utils/semanticToPrimitive';

type SidebarTab = 'variants' | 'colors';

interface SidebarRightProps {
  component: RegisteredComponent | null;
  variants: VariantValues;
  properties: PropertyValues;
  states: StateValues;
  onVariantChange: (group: string, value: string) => void;
  onPropertyChange: (name: string, value: string | boolean | number) => void;
  onStateChange: (name: string, value: boolean) => void;
  tab?: SidebarTab;
  onTabChange?: (tab: SidebarTab) => void;
  showSpacing?: boolean;
  onShowSpacingChange?: (value: boolean) => void;
}

export function SidebarRight({
  component,
  variants,
  properties,
  states,
  onVariantChange,
  onPropertyChange,
  onStateChange,
  tab = 'variants',
  onTabChange,
  showSpacing = false,
  onShowSpacingChange,
}: SidebarRightProps) {
  const setTab = (newTab: SidebarTab) => {
    onTabChange?.(newTab);
  };

  if (!component) {
    return (
      <aside className="sidebar-right">
        <div className="sidebar-right__empty">
          <p>Select a component to see its properties and variants.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar-right">
      {/* Tab Menu */}
      <div className="sidebar-right__tabs">
        <button
          className={`sidebar-right__tab${tab === 'variants' ? ' active' : ''}`}
          onClick={() => setTab('variants')}
        >
          Variants
        </button>
        <button
          className={`sidebar-right__tab${tab === 'colors' ? ' active' : ''}`}
          onClick={() => setTab('colors')}
        >
          Mapping
        </button>
      </div>

      {/* Variants Tab */}
      {tab === 'variants' && (
        <div className="sidebar-right__content">
          {/* Variants */}
          <div className="props-section">
            <h4 className="props-section__title">Variants</h4>
            {Object.keys(component.variants).length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>No variants</p>
            ) : (
              Object.entries(component.variants)
                .filter(([, config]) => {
                  if (!config.showWhen) return true;
                  return Object.entries(config.showWhen).every(
                    ([key, val]) => (variants[key] === val) || (properties[key] === val)
                  );
                })
                .map(([group, config]) => (
                  <div className="variant-group" key={group}>
                    <div className="variant-group__label">{group}</div>
                    <div className="variant-group__options">
                      {config.options.map((option) => (
                        <button
                          key={option}
                          className={`variant-btn${variants[group] === option ? ' active' : ''}`}
                          onClick={() => onVariantChange(group, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Properties */}
          <div className="props-section">
            <h4 className="props-section__title">Properties</h4>
            {component.properties.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>No properties</p>
            ) : (
              <div className="property-list">
                {component.properties.filter((prop) => {
                  if (!prop.showWhen) return true;
                  return Object.entries(prop.showWhen).every(
                    ([key, val]) => (variants[key] === val) || (properties[key] === val)
                  );
                }).map((prop) => (
                  <div className="property-item" key={prop.name}>
                    <label className="property-item__label">{prop.name}</label>
                    <div className="property-item__control">
                      {prop.type === 'text' && (
                        <input
                          type="text"
                          value={(properties[prop.name] as string) || ''}
                          onChange={(e) => onPropertyChange(prop.name, e.target.value)}
                        />
                      )}
                      {prop.type === 'number' && (
                        <input
                          type="number"
                          value={(properties[prop.name] as number) || 0}
                          onChange={(e) => onPropertyChange(prop.name, Number(e.target.value))}
                        />
                      )}
                      {prop.type === 'select' && (
                        <select
                          value={(properties[prop.name] as string) || ''}
                          onChange={(e) => onPropertyChange(prop.name, e.target.value)}
                        >
                          {prop.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                      {prop.type === 'boolean' && (
                        <div className="toggle-switch">
                          <span className="toggle-switch__label">
                            {properties[prop.name] ? 'On' : 'Off'}
                          </span>
                          <input
                            type="checkbox"
                            className="toggle-switch__input"
                            checked={!!properties[prop.name]}
                            onChange={(e) => onPropertyChange(prop.name, e.target.checked)}
                          />
                        </div>
                      )}
                      {prop.type === 'color' && (
                        <input
                          type="color"
                          value={(properties[prop.name] as string) || '#000000'}
                          onChange={(e) => onPropertyChange(prop.name, e.target.value)}
                        />
                      )}
                      {prop.type === 'icon' && (
                        <IconPicker
                          label=""
                          value={(properties[prop.name] as string) || 'none'}
                          onChange={(val) => onPropertyChange(prop.name, val)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* States */}
          {component.states.length > 0 && (
            <div className="props-section">
              <h4 className="props-section__title">States</h4>
              <div className="state-list">
                {component.states.map((state) => (
                  <div className="toggle-switch" key={state.name}>
                    <span className="toggle-switch__label">{state.name}</span>
                    <input
                      type="checkbox"
                      className="toggle-switch__input"
                      checked={!!states[state.name]}
                      onChange={(e) => onStateChange(state.name, e.target.checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mapping Tab */}
      {tab === 'colors' && (
        <div className="sidebar-right__content">
          <div className="props-section">
            <h4 className="props-section__title">Spacing</h4>
            <div className="toggle-switch">
              <span className="toggle-switch__label">Show Spacing</span>
              <input
                type="checkbox"
                className="toggle-switch__input"
                checked={showSpacing}
                onChange={(e) => onShowSpacingChange?.(e.target.checked)}
              />
            </div>
          </div>
          <div className="props-section">
            <h4 className="props-section__title">Colors</h4>
          </div>
          {component.colorTokens && component.colorTokens.length > 0 ? (
            <div className="color-tokens">
              {component.colorTokens
                .filter((token) => {
                  if (!token.variants) return true;
                  return Object.entries(token.variants).every(
                    ([key, val]) => variants[key] === val
                  );
                })
                .map((token) => (
                  <div className="color-token" key={token.token}>
                    <div className="color-token__swatch" style={{ background: `var(${token.variable}, ${token.value})` }} />
                    <div className="color-token__info">
                      <div className="color-token__name">{token.token}</div>
                      <div className="color-token__variable">{resolveSemanticLabel(token.variable)}</div>
                      <div className="color-token__desc">{token.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center', padding: '20px 0' }}>
              No color tokens defined for this component.
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
