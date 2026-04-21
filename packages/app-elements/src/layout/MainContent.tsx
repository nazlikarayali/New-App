import { useState, useRef, type ReactNode } from 'react';
import type { RegisteredComponent } from '../types/registry';
import type { VariantValues, PropertyValues, StateValues } from '../types/component';
import { CodeBlock } from './components/CodeBlock';
import { PropTable } from './components/PropTable';
import { ColorInspectTooltip } from './components/ColorInspectTooltip';
import { SpacingInspectTooltip } from './components/SpacingInspectTooltip';

type ViewType = 'preview' | 'usage' | 'scss';

interface MainContentProps {
  component: RegisteredComponent | null;
  variants: VariantValues;
  properties: PropertyValues;
  states: StateValues;
  colorInspectMode?: boolean;
  spacingInspectMode?: boolean;
  onPropertyChange?: (name: string, value: string | boolean | number) => void;
}

export function MainContent({ component, variants, properties, states, colorInspectMode, spacingInspectMode, onPropertyChange }: MainContentProps) {
  const [view, setView] = useState<ViewType>('preview');
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!component) {
    return (
      <main className="main-content">
        <div className="welcome-screen">
          <div className="welcome-screen__icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="4" y="4" width="56" height="56" rx="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M24 28h16M24 36h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2>JotForm Apps Component Library</h2>
          <p>Select a component from the sidebar to preview it, or share a Figma design to add new components.</p>
        </div>
      </main>
    );
  }

  let preview: ReactNode = null;
  if (view === 'preview') {
    preview = component.render(variants, properties, states);
  }

  return (
    <main className="main-content">
      <div className="component-view">
        {/* Toolbar */}
        <div className="component-view__toolbar">
          <div className="component-view__name">
            <h2>{component.name}</h2>
            <span className="component-view__tag">{component.category}</span>
          </div>
          <div className="view-tabs">
            <button
              className={`view-tab${view === 'preview' ? ' active' : ''}`}
              onClick={() => setView('preview')}
            >
              Preview
            </button>
            <button
              className={`view-tab${view === 'usage' ? ' active' : ''}`}
              onClick={() => setView('usage')}
            >
              Usage
            </button>
            <button
              className={`view-tab${view === 'scss' ? ' active' : ''}`}
              onClick={() => setView('scss')}
            >
              SCSS
            </button>
          </div>
        </div>

        {/* Preview */}
        {view === 'preview' && (
          <div className="preview-panel">
            <div
              ref={canvasRef}
              className={`preview-panel__canvas${colorInspectMode ? ' preview-panel__canvas--inspect' : ''}`}
              onClick={() => {
                if (!colorInspectMode && onPropertyChange && component?.id !== 'color-picker') {
                  const hasProp = component?.properties.some(p => p.name === 'Selected');
                  if (hasProp) {
                    onPropertyChange('Selected', !properties['Selected']);
                  }
                }
              }}
            >
              {preview}
              {colorInspectMode && !spacingInspectMode && <ColorInspectTooltip canvasRef={canvasRef} />}
              {spacingInspectMode && <SpacingInspectTooltip canvasRef={canvasRef} />}
            </div>
          </div>
        )}

        {/* Usage: Code examples + Prop documentation */}
        {view === 'usage' && (
          <div className="usage-panel">
            <CodeBlock code={component.usage} language="tsx" />
            <PropTable propDocs={component.propDocs} />
          </div>
        )}

        {/* SCSS Source */}
        {view === 'scss' && (
          <div className="usage-panel">
            <CodeBlock code={component.scss} language="scss" />
          </div>
        )}
      </div>
    </main>
  );
}
