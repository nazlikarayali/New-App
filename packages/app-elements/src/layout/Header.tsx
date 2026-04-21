import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  mode: 'components' | 'themes' | 'app-preview';
  onModeChange: (mode: 'components' | 'themes' | 'app-preview') => void;
  previewDevice?: 'desktop' | 'mobile';
  onDeviceChange?: (device: 'desktop' | 'mobile') => void;
  onDownloadScreenshot?: () => void;
}

export function Header({ mode, onModeChange, previewDevice = 'desktop', onDeviceChange, onDownloadScreenshot }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header__logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5ZM13 6C13 5.44772 13.4477 5 14 5H18C18.5523 5 19 5.44772 19 6V10C19 10.5523 18.5523 11 18 11H14C13.4477 11 13 10.5523 13 10V6ZM16.75 13.75C16.75 13.3358 16.4142 13 16 13C15.5858 13 15.25 13.3358 15.25 13.75V15.25H13.75C13.3358 15.25 13 15.5858 13 16C13 16.4142 13.3358 16.75 13.75 16.75H15.25V18.25C15.25 18.6642 15.5858 19 16 19C16.4142 19 16.75 18.6642 16.75 18.25V16.75H18.25C18.6642 16.75 19 16.4142 19 16C19 15.5858 18.6642 15.25 18.25 15.25H16.75V13.75ZM6 13C5.44772 13 5 13.4477 5 14V18C5 18.5523 5.44772 19 6 19H10C10.5523 19 11 18.5523 11 18V14C11 13.4477 10.5523 13 10 13H6ZM5 6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V10C11 10.5523 10.5523 11 10 11H6C5.44772 11 5 10.5523 5 10V6Z" fill="var(--fg-brand)"/>
        </svg>
        <span>Jotform Apps</span>
        <span className="app-header__divider">|</span>
        <span className="app-header__subtitle">Component Library</span>
      </div>
      <div className="app-header__actions">
        <div className="app-header__nav">
          <button
            className={`app-header__nav-btn${mode === 'components' ? ' active' : ''}`}
            onClick={() => onModeChange('components')}
          >
            Components
          </button>
          <button
            className={`app-header__nav-btn${mode === 'themes' ? ' active' : ''}`}
            onClick={() => onModeChange('themes')}
          >
            Themes
          </button>
        </div>
        {mode === 'themes' && onDeviceChange && (
          <div className="app-header__device-switcher">
            <button
              className={`app-header__device-btn${previewDevice === 'desktop' ? ' active' : ''}`}
              onClick={() => onDeviceChange('desktop')}
              title="Desktop"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </button>
            <button
              className={`app-header__device-btn${previewDevice === 'mobile' ? ' active' : ''}`}
              onClick={() => onDeviceChange('mobile')}
              title="Mobile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </button>
          </div>
        )}
        {mode === 'themes' && onDownloadScreenshot && (
          <button className="theme-toggle" onClick={onDownloadScreenshot} data-tooltip="Download">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        )}
        <button className="theme-toggle" onClick={toggleTheme} data-tooltip={theme === 'light' ? 'Dark mode' : 'Light mode'}>
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
