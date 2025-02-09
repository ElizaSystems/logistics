'use client'

import { ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabViewProps {
  tabs: Tab[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function TabView({ tabs, activeTab, setActiveTab }: TabViewProps) {
  return (
    <div className="space-y-6">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab tab-bordered ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  )
} 