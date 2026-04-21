import { Icon } from '@jf/design-system'
import podoAvatar from '../assets/podo-chat-avatar.png'

interface MobileBottomBarProps {
  onElementsClick: () => void
  onDesignClick: () => void
  onPagesClick: () => void
  onPreviewClick: () => void
}

function PodoAvatar() {
  return (
    <img
      className="mobile-bottom-bar__avatar"
      src={podoAvatar}
      alt=""
      aria-hidden
    />
  )
}

export function MobileBottomBar({
  onElementsClick,
  onDesignClick,
  onPagesClick,
  onPreviewClick,
}: MobileBottomBarProps) {
  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bottom-bar__input-wrapper">
        <div className="mobile-bottom-bar__input">
          <PodoAvatar />
          <span className="mobile-bottom-bar__input-placeholder">
            Build with Podo...
          </span>
          <button
            type="button"
            className="mobile-bottom-bar__voice-btn"
            aria-label="Voice input"
            disabled
          >
            <Icon name="microphone-filled" category="technology" size={16} />
          </button>
        </div>
      </div>
      <div className="mobile-bottom-bar__menu">
        <button
          type="button"
          className="mobile-bottom-bar__menu-item"
          onClick={onElementsClick}
        >
          <Icon name="plus-circle-filled" category="general" size={24} />
          <span>Elements</span>
        </button>
        <button
          type="button"
          className="mobile-bottom-bar__menu-item"
          onClick={onDesignClick}
        >
          <Icon name="paint-roller-diagonal-filled" category="editor" size={24} />
          <span>Design</span>
        </button>
        <button
          type="button"
          className="mobile-bottom-bar__menu-item"
          onClick={onPagesClick}
        >
          <Icon name="pages-filled" category="forms-files" size={24} />
          <span>Pages</span>
        </button>
        <button
          type="button"
          className="mobile-bottom-bar__menu-item"
          onClick={onPreviewClick}
        >
          <Icon name="eye-filled" category="general" size={24} />
          <span>Preview</span>
        </button>
      </div>
    </div>
  )
}
