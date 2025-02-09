'use client'

import { useState } from 'react'
import { AppHero, AppModal } from '../ui/ui-layout'

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

interface MarketplaceAgent extends Agent {
  cost: number
  description: string
  specialization: string
  trainingData: string
  deploymentTime: string
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

function DeployAgentModal({ show, hide, onDeploy }: { 
  show: boolean; 
  hide: () => void;
  onDeploy: (agent: Partial<Agent>) => void;
}) {
  const [activeTab, setActiveTab] = useState('custom')
  const [agentType, setAgentType] = useState<Agent['type']>('inventory')
  const [name, setName] = useState('')
  const [assignedArea, setAssignedArea] = useState('')

  const marketplaceAgents: MarketplaceAgent[] = [
    {
      id: 'market-1',
      name: 'AdvancedInventoryAI',
      type: 'inventory',
      status: 'active',
      performance: 98,
      lastAction: 'Optimized stock levels',
      nextAction: 'Analyzing demand patterns',
      assignedArea: 'Warehouse A',
      decisions: 1500,
      successRate: 97,
      learningProgress: 95,
      cost: 0.5,
      description: 'Specialized in predictive inventory management',
      specialization: 'High-volume warehouses',
      trainingData: '10M+ inventory transactions',
      deploymentTime: '< 5 minutes'
    },
    {
      id: 'market-2',
      name: 'SmartRouter-Pro',
      type: 'routing',
      status: 'active',
      performance: 97,
      lastAction: 'Route optimization',
      nextAction: 'Traffic analysis',
      assignedArea: 'Fleet Operations',
      decisions: 2000,
      successRate: 96,
      learningProgress: 92,
      cost: 0.75,
      description: 'Advanced route optimization with real-time traffic',
      specialization: 'Urban delivery fleets',
      trainingData: '5M+ delivery routes',
      deploymentTime: '< 10 minutes'
    }
  ]

  const handleSubmit = () => {
    if (activeTab === 'custom') {
      // Validate required fields
      if (!name || !agentType || !assignedArea) {
        alert('Please fill in all required fields')
        return
      }

      // Create new agent from custom deployment
      const newAgent: Partial<Agent> = {
        name,
        type: agentType,
        status: 'learning',
        assignedArea,
        performance: 0,
        decisions: 0,
        successRate: 0,
        learningProgress: 0,
        lastAction: 'Initializing...',
        nextAction: 'Starting training...'
      }

      onDeploy(newAgent)
    }
    hide()
  }

  const handleQuickDeploy = (agent: MarketplaceAgent) => {
    // Convert marketplace agent to regular agent
    const newAgent: Partial<Agent> = {
      name: agent.name,
      type: agent.type,
      status: 'learning',
      assignedArea: agent.assignedArea,
      performance: 0,
      decisions: 0,
      successRate: 0,
      learningProgress: 0,
      lastAction: 'Initializing from marketplace template...',
      nextAction: 'Starting training...'
    }

    onDeploy(newAgent)
    hide()
  }

  return (
    <AppModal
      title="Deploy Logistics Agent"
      show={show}
      hide={hide}
      submit={handleSubmit}
      submitLabel="Deploy Agent"
    >
      <div className="space-y-4">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'custom' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom Deployment
          </button>
          <button
            className={`tab ${activeTab === 'marketplace' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            Agent Marketplace
          </button>
        </div>

        {activeTab === 'custom' ? (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Agent Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter agent name"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Agent Type</span>
              </label>
              <select
                className="select select-bordered"
                value={agentType}
                onChange={(e) => setAgentType(e.target.value as Agent['type'])}
              >
                <option value="inventory">Inventory Management</option>
                <option value="routing">Route Optimization</option>
                <option value="forecasting">Demand Forecasting</option>
                <option value="maintenance">Predictive Maintenance</option>
                <option value="picking">Smart Picking</option>
                <option value="optimization">Warehouse Optimization</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Assigned Area</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={assignedArea}
                onChange={(e) => setAssignedArea(e.target.value)}
                placeholder="Enter assigned area"
              />
            </div>

            <div className="alert alert-info">
              <span>Estimated deployment cost: 1.2 SOL per month</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {marketplaceAgents.map((agent) => (
              <div key={agent.id} className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">
                    {agent.name}
                    <div className="badge badge-primary">{agent.type}</div>
                  </h3>
                  <p>{agent.description}</p>
                  <div className="space-y-2 text-sm">
                    <div>Specialization: {agent.specialization}</div>
                    <div>Training Data: {agent.trainingData}</div>
                    <div>Deployment Time: {agent.deploymentTime}</div>
                  </div>
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="text-primary font-bold">
                      {agent.cost} SOL/month
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleQuickDeploy(agent)}
                    >
                      Quick Deploy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppModal>
  )
}

export default function AgentsFeature() {
  const [showDeployModal, setShowDeployModal] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([
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
    }
  ])

  const handleDeploy = (newAgent: Partial<Agent>) => {
    const agentWithId = {
      ...newAgent,
      id: `agent-${Date.now()}`,
    } as Agent

    setAgents(prev => [...prev, agentWithId])
    console.log('Deployed new agent:', agentWithId)
  }

  return (
    <>
      <div className="space-y-6">
        <AppHero 
          title="AI Agents Control" 
          subtitle="Monitor and manage autonomous logistics agents"
        />
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Active Agents</h2>
          <div className="space-x-2">
            <button 
              className="btn btn-primary"
              onClick={() => setShowDeployModal(true)}
            >
              Deploy Agent
            </button>
            <button className="btn btn-outline">Training Center</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Agents</div>
              <div className="stat-value">
                {agents.length}
              </div>
              <div className="stat-desc">
                {agents.filter(a => a.status === 'active').length} active
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      <DeployAgentModal 
        show={showDeployModal}
        hide={() => setShowDeployModal(false)}
        onDeploy={handleDeploy}
      />
    </>
  )
} 