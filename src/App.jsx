import { useEffect, useState } from 'react'
import './App.css'
import AdminPanel from './component/admin/admin.jsx'
import HomeGallery from './component/home/home.jsx'

const storageKey = 'videoLibraryItems'
const createItemId = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)

function App() {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return []
    try {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'home'
    const hash = window.location.hash.slice(1) // Remove # from start
    return hash === 'admin' ? 'admin' : 'home'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    window.location.hash = tab === 'home' ? '' : `#${tab}`
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setActiveTab(hash === 'admin' ? 'admin' : 'home')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleAddItem = (item) => {
    setItems((prev) => [...prev, { id: createItemId(), ...item }])
  }

  const handleUpdateItem = (id, updated) => {
    setItems((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updated } : entry)))
  }

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">InspireStream</h1>
        <nav className="tab-group">
          <button
            type="button"
            className={`tab-button ${activeTab === 'home' ? 'is-active' : ''}`}
            onClick={() => handleTabChange('home')}
          >
            Home
          </button>
          {activeTab === 'admin' && (
            <button
              type="button"
              className={`tab-button ${activeTab === 'admin' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('admin')}
            >
              Admin
            </button>
          )}
        </nav>
      </header>
      <main className="app-content">
        {activeTab === 'home' ? (
          <HomeGallery items={items} />
        ) : (
          <AdminPanel items={items} onAdd={handleAddItem} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} />
        )}
      </main>
    </div>
  )
}

export default App
