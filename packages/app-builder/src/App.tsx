import { useState } from 'react'
import { IconLibraryProvider } from '@jf/app-elements'
import { TopBar } from './shell/TopBar.tsx'
import { BuildPage } from './pages/BuildPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'
import { PublishPage } from './pages/PublishPage.tsx'

type Page = 'build' | 'settings' | 'publish'

export function App() {
  const [activePage, setActivePage] = useState<Page>('build')
  const [previewMode, setPreviewMode] = useState(true)
  const [appTitle, setAppTitle] = useState('App Title')

  return (
    <IconLibraryProvider>
    <div className="builder">
      <TopBar
        activePage={activePage}
        onPageChange={setActivePage}
        previewMode={previewMode}
        onPreviewToggle={() => setPreviewMode(!previewMode)}
        appName={appTitle}
      />
      <div className="builder__content">
        {activePage === 'build' && <BuildPage previewMode={previewMode} appTitle={appTitle} onAppTitleChange={setAppTitle} />}
        {activePage === 'settings' && <SettingsPage />}
        {activePage === 'publish' && <PublishPage />}
      </div>
    </div>
    </IconLibraryProvider>
  )
}
