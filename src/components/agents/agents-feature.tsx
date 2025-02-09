'use client'

import { useState } from 'react'
import { AppHero } from '../ui/ui-layout'

interface Agent {
  id: string
  name: string
  type: 'inventory' | 'routing' | 'forecasting' | 'maintenance'
  status: 'active' | 'idle' | 'learning'
  performance: number
  lastAction: string
  nextAction: string
}

export default function AgentsFeature() {
  const [agents] = useState<Agent[]>([
    {
      id: '1',
      name: 'InventoryBot-Alpha',
      type: 'inventory',
      status: 'active',
      performance: 95,
      lastAction: 'Reordered SKU-456 based on demand forecast',
      nextAction: 'Analyzing stock levels for optimization',
    },
    {
      id: '2',
      name: 'RouteOptimizer-1',
      type: 'routing',
      status: 'active',
      performance: 98,
      lastAction: 'Optimized delivery routes for 52 orders',
      nextAction: 'Calculating fleet distribution for tomorrow',
    },
  ])

  return (
    <div className="space-y-6">
      <AppHero 
        title="AI Agents Control" 
        subtitle="Monitor and manage autonomous logistics agents"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Agent Performance Analytics</h2>
          <AgentPerformanceChart agents={agents} />
        </div>
      </div>
    </div>
  )
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">{agent.name}</h2>
          <div className={`badge ${getStatusBadgeColor(agent.status)}`}>
            {agent.status}
          </div>
        </div>
        <p className="text-sm">Type: {agent.type}</p>
        <p className="text-sm">Performance: {agent.performance}%</p>
        <div className="divider"></div>
        <div>
          <p className="text-sm font-semibold">Last Action:</p>
          <p className="text-sm">{agent.lastAction}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Next Action:</p>
          <p className="text-sm">{agent.nextAction}</p>
        </div>
      </div>
    </div>
  )
} 