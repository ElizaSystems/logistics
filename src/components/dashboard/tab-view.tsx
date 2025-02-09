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
      <div className="overflow-x-auto no-scrollbar">
        <div className="tabs tabs-bordered inline-flex min-w-max px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab h-10 min-h-[2.5rem] px-4 whitespace-nowrap ${
                activeTab === tab.id ? 'tab-active' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-2">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  )
} 