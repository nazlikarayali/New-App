import { Icon } from '@jf/design-system'
import jotformLogo from '@jf/design-system/src/assets/jotform-logo.svg'
import jotformLogomark from '@jf/design-system/src/assets/jotform-logomark.svg'

type Page = 'build' | 'settings' | 'publish'

interface TopBarProps {
  activePage: Page
  onPageChange: (page: Page) => void
  appName?: string
  previewMode: boolean
  onPreviewToggle: () => void
}

const PAGES: { id: Page; label: string }[] = [
  { id: 'build', label: 'BUILD' },
  { id: 'settings', label: 'SETTINGS' },
  { id: 'publish', label: 'PUBLISH' },
]

export function TopBar({ activePage, onPageChange, appName = 'App', previewMode, onPreviewToggle }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__main">
        <div className="topbar__left">
          <img src={jotformLogo} alt="Jotform" className="topbar__logo topbar__logo--full" />
          <img src={jotformLogomark} alt="Jotform" className="topbar__logo topbar__logo--mark" />
          <div className="topbar__divider" />
          <div className="topbar__product-label">
            <span className="topbar__product-label-text">App Builder</span>
            <button className="topbar__chevron-btn">
              <Icon name="chevron-down" category="arrows" size={12} />
            </button>
          </div>
        </div>

        <div className="topbar__middle">
          <div className="topbar__app-title">
            <span>{appName}</span>
            <button className="topbar__chevron-btn">
              <Icon name="chevron-down" category="arrows" size={12} />
            </button>
          </div>
          <span className="topbar__timestamp">Last edited at 12:21 pm.</span>
        </div>

        <div className="topbar__right">
          <button className="topbar__help-btn">
            <Icon name="question-circle-filled" size={16} />
            <span className="topbar__help-text">Help</span>
          </button>
          <div className="topbar__avatar-wrapper">
            <div className="topbar__avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop&crop=face" alt="User avatar" width="44" height="44" />
            </div>
          </div>
        </div>
      </div>

      <nav className="topbar__nav">
        <div className="topbar__nav-tabs">
          {PAGES.map((page) => (
            <button
              key={page.id}
              className={`topbar__nav-item ${activePage === page.id ? 'topbar__nav-item--active' : ''}`}
              onClick={() => onPageChange(page.id)}
            >
              {page.label}
            </button>
          ))}
        </div>
        <div className="topbar__nav-right">
          <span className="topbar__preview-label">Preview App</span>
          <button
            className={`topbar__toggle ${previewMode ? 'topbar__toggle--active' : ''}`}
            onClick={onPreviewToggle}
          >
            <span className="topbar__toggle-track" />
            <span className="topbar__toggle-thumb" />
          </button>
        </div>
      </nav>
    </header>
  )
}
