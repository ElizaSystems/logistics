'use client'

import { AppHero } from '../ui/ui-layout'
import { useState, useEffect } from 'react'
import { TabView } from './tab-view'
import { InventoryView } from './views/inventory-view'
import { OrdersView } from './views/orders-view'
import { WarehousesView } from './views/warehouses-view'
import { FleetView } from './views/fleet-view'
import { AgentsView } from './views/agents-view'
import { AnalyticsView } from './views/analytics-view'
import { AgentInterface } from '../agent/AgentInterface'
import { CommandHelp } from '../command-help/command-help'

interface MetricCard {
  title: string
  value: string | number
  change: number
  timeframe: string
}

interface AlertItem {
  id: string
  type: 'warning' | 'error' | 'success'
  message: string
  timestamp: Date
}

interface AIActivity {
  id: string
  agentName: string
  action: string
  timestamp: string
  impact: string
  status: 'completed' | 'in-progress' | 'scheduled'
}

interface WarehouseStatus {
  id: string
  name: string
  utilization: number
  temperature: number
  humidity: number
  activeRobots: number
  pendingTasks: number
}

interface VehicleStatus {
  id: string
  type: string
  status: string
  currentTask?: string
  battery: number
  location: string
}

interface Agent {
  action: any
  updatedAt: string | number | Date
  impact: any
  id: string
  name: string
  type: string
  status: string
  performance: number
  lastAction: string
  nextAction: string
  assignedArea: string
  decisions: number
  successRate: number
  learningProgress: number
}

function MetricCardComponent({ title, value, change, timeframe }: MetricCard) {
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-desc flex items-center gap-1 ${
          change > 0 ? 'text-success' : change < 0 ? 'text-error' : 'text-info'
        }`}>
          {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
          <span className="text-base-content/60"> {timeframe}</span>
        </div>
      </div>
    </div>
  )
}

function AIActivityFeed({ activities = [] }: { activities?: AIActivity[] }) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium">{activity.agentName}</p>
            <p className="text-sm opacity-70">{activity.action}</p>
            <p className="text-xs opacity-50" suppressHydrationWarning>
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
          <div className={`badge ${
            activity.status === 'completed' ? 'badge-success' : 
            activity.status === 'in-progress' ? 'badge-warning' : 
            'badge-info'
          }`}>
            {activity.status}
          </div>
        </div>
      ))}
    </div>
  )
}

function AlertsFeed({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Active Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert ${
                alert.type === 'warning' ? 'alert-warning' :
                alert.type === 'error' ? 'alert-error' :
                'alert-success'
              }`}
            >
              <span>{alert.message}</span>
              <span className="text-xs opacity-70">
                {alert.timestamp.toISOString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WarehouseUtilization() {
  const [warehouses] = useState<WarehouseStatus[]>([
    {
      id: '1',
      name: 'Warehouse A',
      utilization: 78,
      temperature: 22,
      humidity: 45,
      activeRobots: 12,
      pendingTasks: 34,
    },
    {
      id: '2',
      name: 'Warehouse B',
      utilization: 65,
      temperature: 21,
      humidity: 42,
      activeRobots: 8,
      pendingTasks: 27,
    },
  ])

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Warehouse Status</h2>
        <div className="space-y-4">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{warehouse.name}</span>
                <span className="text-sm">
                  {warehouse.activeRobots} robots • {warehouse.pendingTasks} tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <progress
                  className="progress progress-primary w-full"
                  value={warehouse.utilization}
                  max="100"
                ></progress>
                <span className="text-sm">{warehouse.utilization}%</span>
              </div>
              <div className="text-sm opacity-70">
                {warehouse.temperature}°C • {warehouse.humidity}% humidity
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FleetStatus() {
  const [vehicles] = useState<VehicleStatus[]>([
    {
      id: '1',
      type: 'truck',
      status: 'active',
      currentTask: 'Delivery to Customer A',
      battery: 85,
      location: 'Route 27',
    },
    {
      id: '2',
      type: 'drone',
      status: 'charging',
      battery: 30,
      location: 'Warehouse A',
    },
  ])

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Fleet Status</h2>
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex justify-between items-center">
              <div>
                <div className="font-semibold capitalize">{vehicle.type}</div>
                <div className="text-sm opacity-70">{vehicle.location}</div>
                {vehicle.currentTask && (
                  <div className="text-sm">{vehicle.currentTask}</div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <progress
                    className={`progress w-20 ${
                      vehicle.battery > 60 ? 'progress-success' :
                      vehicle.battery > 30 ? 'progress-warning' :
                      'progress-error'
                    }`}
                    value={vehicle.battery}
                    max="100"
                  ></progress>
                  <span className="text-sm">{vehicle.battery}%</span>
                </div>
                <div className={`badge ${
                  vehicle.status === 'active' ? 'badge-success' :
                  vehicle.status === 'charging' ? 'badge-warning' :
                  'badge-ghost'
                }`}>
                  {vehicle.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardFeature() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showDeployModal, setShowDeployModal] = useState(false)
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
      learningProgress: 85,
      action: 'optimize',
      updatedAt: new Date(),
      impact: 'high'
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
      learningProgress: 78,
      action: 'recalculate',
      updatedAt: new Date(),
      impact: 'medium'
    }
  ])

  const [metrics] = useState<MetricCard[]>([
    {
      title: 'Total Orders',
      value: '1,234',
      change: 12.5,
      timeframe: 'vs last month'
    },
    {
      title: 'Fleet Utilization',
      value: '85%',
      change: 3.2,
      timeframe: 'vs last week'
    },
    {
      title: 'Warehouse Capacity',
      value: '72%',
      change: -5.1,
      timeframe: 'vs last month'
    },
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      change: 1.5,
      timeframe: 'vs last week'
    }
  ])

  const [alerts] = useState<AlertItem[]>([
    {
      id: '1',
      type: 'warning',
      message: 'Low inventory alert for SKU-123',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'error',
      message: 'Vehicle maintenance required',
      timestamp: new Date()
    }
  ])

  const [activities] = useState<AIActivity[]>([
    {
      id: 'a1',
      agentName: 'InventoryBot-Alpha',
      action: 'Optimized stock levels for high-demand items',
      timestamp: new Date().toISOString(),
      impact: 'Improved inventory turnover',
      status: 'completed'
    },
    {
      id: 'a2',
      agentName: 'RouteOptimizer-1',
      action: 'Recalculated delivery routes for efficiency',
      timestamp: new Date().toISOString(),
      impact: 'Reduced delivery time by 15%',
      status: 'in-progress'
    }
  ])

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <MetricCardComponent key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIActivityFeed activities={activities} />
            <AlertsFeed alerts={alerts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WarehouseUtilization />
            <FleetStatus />
          </div>
        </div>
      ),
    },
    {
      id: 'inventory',
      label: 'Inventory',
      content: <InventoryView />,
    },
    {
      id: 'orders',
      label: 'Orders',
      content: <OrdersView />,
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      content: <WarehousesView />,
    },
    {
      id: 'fleet',
      label: 'Fleet',
      content: <FleetView />,
    },
    {
      id: 'agents',
      label: 'AI Agents',
      content: <AgentsView />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: <AnalyticsView />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="w-full max-w-6xl mx-auto flex gap-6">
        <div className="w-1/2">
          <AgentInterface 
            onDeployAgent={() => setShowDeployModal(true)}
            onConfigureAgent={(agentId) => {
              console.log('Configure agent:', agentId)
            }}
            onViewLogs={(agentId) => {
              console.log('View logs:', agentId)
            }}
            metrics={metrics}
            agents={agents}
            alerts={alerts}
          />
        </div>
        <div className="w-1/2">
          <CommandHelp />
        </div>
      </div>
      <TabView tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
