import { useState } from 'react'
import { SideNav, type SideNavItem } from '../components/SideNav'

const NAV_ITEMS: SideNavItem[] = [
  {
    id: 'quick-share',
    icon: 'link-diagonal',
    iconCategory: 'general',
    title: 'QUICK SHARE',
    description: 'Direct app link',
  },
  {
    id: 'embed',
    icon: 'angles-selector-slash-horizontal',
    iconCategory: 'arrows',
    title: 'EMBED',
    description: 'Get embed code',
  },
  {
    id: 'app-users',
    icon: 'users-more-filled',
    iconCategory: 'users',
    title: 'APP USERS',
    description: 'Manage app users',
  },
]

export function PublishPage() {
  const [activeId, setActiveId] = useState('quick-share')
  const active = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0]

  return (
    <div className="publish-page">
      <SideNav items={NAV_ITEMS} activeId={activeId} onChange={setActiveId} />
      <main className="publish-page__content">
        <h1>{active.title}</h1>
        <p>{active.description}</p>
      </main>
    </div>
  )
}
