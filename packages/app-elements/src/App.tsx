import { useState, useEffect, useCallback, useRef } from 'react';
import { Agentation } from 'agentation';
import { IconLibraryProvider } from './context/IconLibraryContext';
import { Header } from './layout/Header';
import { SidebarLeft } from './layout/SidebarLeft';
import { SidebarRight } from './layout/SidebarRight';
import { MainContent } from './layout/MainContent';
import { FoundationColors } from './layout/FoundationColors';
import { FoundationSpacing } from './layout/FoundationSpacing';
import { FoundationRadius } from './layout/FoundationRadius';
import { FoundationTypography } from './layout/FoundationTypography';
import { ThemesView } from './layout/ThemesView';
import { AppPreview } from './layout/AppPreview';
import { BottomSheet } from './layout/components/BottomSheet';
import { ComponentRegistry, type RegisteredComponent } from './types/registry';
import type { VariantValues, PropertyValues, StateValues } from './types/component';
import './styles/app.scss';

// Register components
import './components/Card/register';
import './components/Button/register';
import './components/DonationBox/register';
import './components/ProductList/register';
import './components/Heading/register';
import './components/List/register';
import './components/Document/register';
import './components/SignDocument/register';
import './components/ImageGallery/register';
import './components/SocialFollow/register';
import './components/Form/register';
import './components/Table/register';
import './components/Testimonial/register';
import './components/DailyTaskManager/register';
import './components/ColorPicker/register';
import './components/EmptyState/register';
import './components/Chart/register';
import './components/AppHeader/register';
import './components/LoginSignup/register';
import './components/BottomNavigation/register';
import './components/Paragraph/register';

type AppMode = 'components' | 'themes' | 'app-preview';
type MobileSheet = 'none' | 'components' | 'properties';

function App() {
  const [mode, setMode] = useState<AppMode>('components');
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>('none');
  const [components, setComponents] = useState<RegisteredComponent[]>(ComponentRegistry.getAll());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [variants, setVariants] = useState<VariantValues>({});
  const [properties, setProperties] = useState<PropertyValues>({});
  const [states, setStates] = useState<StateValues>({});
  const [sidebarTab, setSidebarTab] = useState<'variants' | 'colors'>('variants');
  const [showSpacing, setShowSpacing] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const downloadScreenshotRef = useRef<(() => void) | null>(null);
  const [foundationPage, setFoundationPage] = useState<string | null>(null);

  useEffect(() => {
    return ComponentRegistry.subscribe(() => {
      setComponents(ComponentRegistry.getAll());
    });
  }, []);

  const selectedComponent = selectedId ? ComponentRegistry.get(selectedId) || null : null;

  const handleFoundationSelect = useCallback((page: string) => {
    setFoundationPage(page);
    setSelectedId(null);
  }, []);

  const handleSelect = useCallback((id: string) => {
    const comp = ComponentRegistry.get(id);
    if (!comp) return;

    setSelectedId(id);
    setFoundationPage(null);
    setMode('components');
    setMobileSheet('none');

    const newVariants: VariantValues = {};
    for (const [group, config] of Object.entries(comp.variants)) {
      newVariants[group] = config.default || config.options[0];
    }
    setVariants(newVariants);

    const newProps: PropertyValues = {};
    for (const prop of comp.properties) {
      newProps[prop.name] = prop.default;
    }
    setProperties(newProps);

    const newStates: StateValues = {};
    for (const state of comp.states) {
      newStates[state.name] = state.default || false;
    }
    setStates(newStates);
  }, []);

  const handleVariantChange = useCallback((group: string, value: string) => {
    setVariants((prev) => ({ ...prev, [group]: value }));
  }, []);

  const handlePropertyChange = useCallback((name: string, value: string | boolean | number) => {
    setProperties((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleStateChange = useCallback((name: string, value: boolean) => {
    setStates((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <IconLibraryProvider>
    <div className={`app${mode === 'themes' ? ' app--themes' : ''}`}>
      <Header mode={mode} onModeChange={setMode} previewDevice={previewDevice} onDeviceChange={setPreviewDevice} onDownloadScreenshot={() => downloadScreenshotRef.current?.()} />
      <div className="app-body">
        {mode === 'components' ? (
          <>
            <SidebarLeft
              selectedId={selectedId}
              onSelect={handleSelect}
              components={components}
              foundationPage={foundationPage}
              onFoundationSelect={handleFoundationSelect}
            />
            {foundationPage === 'colors' ? (
              <FoundationColors />
            ) : foundationPage === 'spacing' ? (
              <FoundationSpacing />
            ) : foundationPage === 'radius' ? (
              <FoundationRadius />
            ) : foundationPage === 'typography' ? (
              <FoundationTypography />
            ) : (
              <>
                <MainContent
                  component={selectedComponent}
                  variants={variants}
                  properties={properties}
                  states={states}
                  colorInspectMode={sidebarTab === 'colors'}
                  spacingInspectMode={sidebarTab === 'colors' && showSpacing}
                  onPropertyChange={handlePropertyChange}
                />
                <SidebarRight
                  component={selectedComponent}
                  variants={variants}
                  properties={properties}
                  states={states}
                  onVariantChange={handleVariantChange}
                  onPropertyChange={handlePropertyChange}
                  onStateChange={handleStateChange}
                  tab={sidebarTab}
                  onTabChange={setSidebarTab}
                  showSpacing={showSpacing}
                  onShowSpacingChange={setShowSpacing}
                />
              </>
            )}

            {/* Mobile floating buttons */}
            <div className="mobile-fab mobile-fab--left">
              <button className="mobile-fab__btn" onClick={() => setMobileSheet('components')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
              </button>
            </div>
            {selectedComponent && (
              <div className="mobile-fab mobile-fab--right">
                <button className="mobile-fab__btn" onClick={() => setMobileSheet('properties')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                </button>
              </div>
            )}

            {/* Mobile bottom sheets */}
            <BottomSheet
              open={mobileSheet === 'components'}
              onClose={() => setMobileSheet('none')}
              title="Components"
            >
              <SidebarLeft
                selectedId={selectedId}
                onSelect={handleSelect}
                components={components}
                foundationPage={foundationPage}
                onFoundationSelect={handleFoundationSelect}
              />
            </BottomSheet>

            <BottomSheet
              open={mobileSheet === 'properties'}
              onClose={() => setMobileSheet('none')}
              title={selectedComponent?.name || 'Properties'}
            >
              <SidebarRight
                component={selectedComponent}
                variants={variants}
                properties={properties}
                states={states}
                onVariantChange={handleVariantChange}
                onPropertyChange={handlePropertyChange}
                onStateChange={handleStateChange}
              />
            </BottomSheet>
          </>
        ) : mode === 'themes' ? (
          <ThemesView onDone={() => setMode('components')} previewDevice={previewDevice} onDownloadRef={downloadScreenshotRef} />
        ) : (
          <AppPreview />
        )}
      </div>
      {import.meta.env.DEV && <Agentation />}
    </div>
    </IconLibraryProvider>
  );
}

export default App;
