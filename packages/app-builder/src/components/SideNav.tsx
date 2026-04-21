import { Icon } from '@jf/design-system'

export interface SideNavItem {
  id: string
  icon: string
  iconCategory: string
  title: string
  description: string
}

interface SideNavProps {
  items: SideNavItem[]
  activeId: string
  onChange: (id: string) => void
}

export function SideNav({ items, activeId, onChange }: SideNavProps) {
  return (
    <aside className="side-nav">
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            className={`side-nav__item${isActive ? ' side-nav__item--active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <span className="side-nav__icon">
              <Icon name={item.icon} category={item.iconCategory} size={24} />
            </span>
            <span className="side-nav__text">
              <span className="side-nav__title">{item.title}</span>
              <span className="side-nav__desc">{item.description}</span>
            </span>
          </button>
        )
      })}
    </aside>
  )
}
