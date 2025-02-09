'use client'

import { useState } from 'react'

interface AnalyticMetric {
  id: string
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  timeframe: string
  category: 'operations' | 'efficiency' | 'financial' | 'sustainability'
}

interface PerformanceData {
  label: string
  value: number
  target: number
}

export function AnalyticsView() {
  const [metrics] = useState<AnalyticMetric[]>([
    {
      id: '1',
      name: 'Order Fulfillment Rate',
      value: 96.5,
      change: 2.3,
      trend: 'up',
      timeframe: 'vs last month',
      category: 'operations'
    },
    {
      id: '2',
      name: 'Fleet Utilization',
      value: 88.2,
      change: -1.5,
      trend: 'down',
      timeframe: 'vs last month',
      category: 'efficiency'
    },
    {
      id: '3',
      name: 'Operating Costs',
      value: 15234,
      change: -5.2,
      trend: 'down',
      timeframe: 'vs last month',
      category: 'financial'
    }
  ])

  const [performanceData] = useState<PerformanceData[]>([
    { label: 'Warehouse Efficiency', value: 92, target: 95 },
    { label: 'Order Accuracy', value: 99.2, target: 99 },
    { label: 'On-Time Delivery', value: 94.5, target: 96 },
    { label: 'Fleet Uptime', value: 97.8, target: 98 }
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="space-x-2">
          <button className="btn btn-outline">Export Report</button>
          <button className="btn btn-primary">Configure Alerts</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="stats shadow">
            <div className="stat">
              <div className="stat-title">{metric.name}</div>
              <div className="stat-value">
                {typeof metric.value === 'number' && metric.value % 1 !== 0
                  ? metric.value.toFixed(1)
                  : metric.value}
                {metric.category === 'financial' ? '$' : '%'}
              </div>
              <div className={`stat-desc flex items-center gap-1 ${
                metric.trend === 'up' ? 'text-success' : 
                metric.trend === 'down' ? 'text-error' : 
                'text-info'
              }`}>
                {metric.change > 0 ? '↗' : '↘'} {Math.abs(metric.change)}%
                <span className="text-base-content/60"> {metric.timeframe}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Performance Metrics</h3>
            <div className="space-y-4">
              {performanceData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-sm font-semibold">
                      {item.value}% / {item.target}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <progress
                      className={`progress w-full ${
                        item.value >= item.target ? 'progress-success' : 'progress-warning'
                      }`}
                      value={item.value}
                      max="100"
                    ></progress>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">AI Insights</h3>
            <div className="space-y-4">
              <div className="alert alert-info">
                <span>Warehouse A utilization could be optimized by 12% by adjusting picking routes.</span>
              </div>
              <div className="alert alert-warning">
                <span>Predicted maintenance required for 3 fleet vehicles within next 7 days.</span>
              </div>
              <div className="alert alert-success">
                <span>New route optimization saved 15% fuel consumption this month.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 