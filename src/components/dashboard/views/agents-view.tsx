'use client'

import { useState } from 'react'

interface Agent {
  id: string
  name: string
  type: 'inventory' | 'routing' | 'forecasting' | 'maintenance' | 'picking' | 'optimization'
  status: 'active' | 'learning' | 'idle' | 'error'
  performance: number
  lastAction: string
  nextAction: string
  assignedArea: string
  decisions: number
  successRate: number
  learningProgress: number
}

export function AgentsView() {
  const [agents] = useState<Agent[]>([
    {
      id: '1',
      name: 'InventoryBot-Alpha',
      type: 'inventory',
      status: 'active',
      performance: 95,
      lastAction: 'Optimized stock levels for high-demand items',
      nextAction: 'Analyzing seasonal demand patterns',
      assignedArea: 'Warehouse A',
      decisions: 1234,
      successRate: 98,
      learningProgress: 85
    },
    {
      id: '2',
      name: 'RouteOptimizer-1',
      type: 'routing',
      status: 'active',
      performance: 92,
      lastAction: 'Recalculated delivery routes for efficiency',
      nextAction: 'Adjusting for weather conditions',
      assignedArea: 'Fleet Management',
      decisions: 567,
      successRate: 94,
      learningProgress: 78
    },
    {
      id: '3',
      name: 'MaintenanceAI',
      type: 'maintenance',
      status: 'learning',
      performance: 88,
      lastAction: 'Scheduled preventive maintenance for Truck-7',
      nextAction: 'Learning from maintenance history',
      assignedArea: 'Vehicle Fleet',
      decisions: 345,
      successRate: 91,
      learningProgress: 65
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Agents Management</h2>
        <div className="space-x-2">
          <button className="btn btn-primary">Deploy Agent</button>
          <button className="btn btn-outline">Training Center</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Active Agents</div>
            <div className="stat-value">
              {agents.filter(a => a.status === 'active').length}
            </div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Decisions</div>
            <div className="stat-value">
              {agents.reduce((acc, a) => acc + a.decisions, 0)}
            </div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Avg Success Rate</div>
            <div className="stat-value">
              {Math.round(agents.reduce((acc, a) => acc + a.successRate, 0) / agents.length)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="card-title">{agent.name}</h3>
                  <p className="text-sm opacity-70 capitalize">{agent.type}</p>
                </div>
                <div className={`badge ${
                  agent.status === 'active' ? 'badge-success' :
                  agent.status === 'learning' ? 'badge-info' :
                  agent.status === 'error' ? 'badge-error' :
                  'badge-ghost'
                }`}>
                  {agent.status}
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <div className="text-sm opacity-70">Performance</div>
                  <div className="flex items-center gap-2">
                    <progress 
                      className="progress progress-success w-full" 
                      value={agent.performance} 
                      max="100"
                    ></progress>
                    <span className="text-sm">{agent.performance}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm opacity-70">Learning Progress</div>
                  <div className="flex items-center gap-2">
                    <progress 
                      className="progress progress-info w-full" 
                      value={agent.learningProgress} 
                      max="100"
                    ></progress>
                    <span className="text-sm">{agent.learningProgress}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm opacity-70">Last Action</div>
                  <p className="text-sm">{agent.lastAction}</p>
                </div>

                <div>
                  <div className="text-sm opacity-70">Next Action</div>
                  <p className="text-sm">{agent.nextAction}</p>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm">View Logs</button>
                <button className="btn btn-sm btn-outline">Configure</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 