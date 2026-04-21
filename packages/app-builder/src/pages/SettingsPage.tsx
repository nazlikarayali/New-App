import { useState } from 'react'
import { SideNav, type SideNavItem } from '../components/SideNav'

const NAV_ITEMS: SideNavItem[] = [
  {
    id: 'app-settings',
    icon: 'mobile-gear',
    iconCategory: 'technology',
    title: 'APP SETTINGS',
    description: 'App status and properties',
  },
  {
    id: 'app-name-icon',
    icon: 'mobile-title',
    iconCategory: 'technology',
    title: 'APP NAME & ICON',
    description: 'Customize app name and icon',
  },
  {
    id: 'splash-screen',
    icon: 'mobile-pencil',
    iconCategory: 'technology',
    title: 'SPLASH SCREEN',
    description: 'Customize splash screen',
  },
  {
    id: 'push-notifications',
    icon: 'mobile-bell',
    iconCategory: 'technology',
    title: 'PUSH NOTIFICATIONS',
    description: 'Send push notifications',
  },
  {
    id: 'ai-chatbot',
    icon: 'ai-message-filled',
    iconCategory: 'ai',
    title: 'AI CHATBOT',
    description: 'Support your users with AI',
  },
]

export function SettingsPage() {
  const [activeId, setActiveId] = useState('app-settings')
  const active = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0]

  return (
    <div className="settings-page">
      <SideNav items={NAV_ITEMS} activeId={activeId} onChange={setActiveId} />
      <main className="settings-page__content">
        <h1>{active.title}</h1>
        <p>{active.description}</p>
      </main>
    </div>
  )
}
