import { useState } from 'react'

interface MobileHeaderProps {
  activeTab: string
  setActiveTab: (tabId: string) => void
  tabs: Array<{ id: string; label: string }>
}

export function MobileHeader({ activeTab, setActiveTab, tabs }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setIsMenuOpen(false)
  }

  return (
    <div className="navbar bg-base-200 lg:hidden sticky top-0 z-50 shadow-md">
      <div className="flex-1">
        <h1 className="text-xl font-bold px-2">Logistics</h1>
        <span className="text-sm opacity-60 ml-2">{tabs.find(t => t.id === activeTab)?.label}</span>
      </div>
      <div className="flex-none">
        <button 
          className="btn btn-square btn-ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-base-100 z-40">
          <div className="flex flex-col p-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`btn btn-ghost justify-start ${activeTab === tab.id ? 'btn-active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 