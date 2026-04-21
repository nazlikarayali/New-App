import { ChevronDown, HelpCircle } from 'lucide-react';
import jotformLogo from '../../assets/jotform-logo.svg';
import jotformIcon from '../../assets/jotform-icon.svg';
import './Header.scss';

interface HeaderProps {
  appName?: string;
  lastEdited?: string;
  activeTab?: 'build' | 'settings' | 'publish';
  onTabChange?: (tab: 'build' | 'settings' | 'publish') => void;
}

const tabs = [
  { key: 'build' as const, label: 'BUILD' },
  { key: 'settings' as const, label: 'SETTINGS' },
  { key: 'publish' as const, label: 'PUBLISH' },
];

function Header({
  appName = 'New App',
  lastEdited = 'Last edited at 12:21 pm.',
  activeTab = 'build',
  onTabChange,
}: HeaderProps) {
  return (
    <header className="jf-header">
      {/* Top Bar */}
      <div className="jf-header__topbar">
        <div className="jf-header__left">
          <div className="jf-header__logo">
            <img src={jotformLogo} alt="JotForm" className="jf-header__logo-desktop" />
            <img src={jotformIcon} alt="JotForm" className="jf-header__logo-mobile" />
          </div>
          <div className="jf-header__divider" />
          <button className="jf-header__product">
            <span className="jf-header__product-text">App Builder</span>
            <ChevronDown size={16} />
          </button>
          {/* Mobile: app title shown in left section */}
          <div className="jf-header__mobile-title">
            <span className="jf-header__mobile-app-name">{appName}</span>
            <span className="jf-header__mobile-last-edited">{lastEdited}</span>
          </div>
        </div>

        {/* Center (desktop only) */}
        <div className="jf-header__center">
          <button className="jf-header__app-title">
            <span>{appName}</span>
            <ChevronDown size={14} />
          </button>
          <span className="jf-header__last-edited">{lastEdited}</span>
        </div>

        <div className="jf-header__right">
          <button className="jf-header__help">
            <HelpCircle size={16} />
            <span>Help</span>
          </button>
          <div className="jf-header__avatar" />
        </div>
      </div>

      {/* Tab Bar */}
      <div className="jf-header__tabbar">
        <div className="jf-header__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`jf-header__tab${activeTab === tab.key ? ' jf-header__tab--active' : ''}`}
              onClick={() => onTabChange?.(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="jf-header__preview">
          <span className="jf-header__preview-label">Preview</span>
          <div className="jf-header__toggle">
            <div className="jf-header__toggle-thumb" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
