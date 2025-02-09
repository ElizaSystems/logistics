'use client'

import { useState } from 'react'
import { AppHero } from '../ui/ui-layout'

interface Agent {
  id: string
  name: string
  type: string
  status: string
  performance: number
  lastAction: string
  nextAction: string
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">{agent.name}</h3>
        <div className="badge badge-primary">{agent.type}</div>
        <div className={`badge ${
          agent.status === 'active' ? 'badge-success' : 'badge-warning'
        }`}>
          {agent.status}
        </div>
        <div className="mt-4">
          <div className="text-sm opacity-70">Performance</div>
          <div className="flex items-center gap-2">
            <progress 
              className="progress progress-success w-full" 
              value={agent.performance} 
              max="100"
            ></progress>
            <span>{agent.performance}%</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm opacity-70">Last Action</div>
          <div>{agent.lastAction}</div>
        </div>
        <div className="mt-2">
          <div className="text-sm opacity-70">Next Action</div>
          <div>{agent.nextAction}</div>
        </div>
      </div>
    </div>
  )
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
          <div className="flex flex-col gap-4">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Average Performance</div>
                <div className="stat-value">
                  {Math.round(agents.reduce((acc, agent) => acc + agent.performance, 0) / agents.length)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 