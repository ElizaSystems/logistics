'use client'

import { useState } from 'react'

interface Vehicle {
  id: string
  type: 'truck' | 'van' | 'forklift' | 'drone' | 'robot'
  status: 'active' | 'maintenance' | 'charging' | 'idle'
  battery: number
  location: string
  currentTask?: string
  lastMaintenance: Date
  efficiency: number
  mileage: number
  assignedWarehouse: string
}

export function FleetView() {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: '1',
      type: 'truck',
      status: 'active',
      battery: 85,
      location: 'Route 27 - Delivery',
      currentTask: 'Delivering to Customer XYZ',
      lastMaintenance: new Date('2024-01-15'),
      efficiency: 92,
      mileage: 15000,
      assignedWarehouse: 'Warehouse A'
    },
    {
      id: '2',
      type: 'drone',
      status: 'charging',
      battery: 30,
      location: 'Charging Station 3',
      lastMaintenance: new Date('2024-02-01'),
      efficiency: 95,
      mileage: 500,
      assignedWarehouse: 'Warehouse B'
    },
    {
      id: '3',
      type: 'robot',
      status: 'active',
      battery: 75,
      location: 'Zone A1 - Picking',
      currentTask: 'Order Picking #1234',
      lastMaintenance: new Date('2024-01-28'),
      efficiency: 88,
      mileage: 300,
      assignedWarehouse: 'Warehouse A'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fleet Management</h2>
        <div className="space-x-2">
          <button className="btn btn-primary">Add Vehicle</button>
          <button className="btn btn-outline">Schedule Maintenance</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Active Vehicles</div>
            <div className="stat-value">
              {vehicles.filter(v => v.status === 'active').length}
            </div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Average Efficiency</div>
            <div className="stat-value">
              {Math.round(vehicles.reduce((acc, v) => acc + v.efficiency, 0) / vehicles.length)}%
            </div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Charging</div>
            <div className="stat-value">
              {vehicles.filter(v => v.status === 'charging').length}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Battery</th>
              <th>Location</th>
              <th>Efficiency</th>
              <th>Last Maintenance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{vehicle.type}</span>
                    {vehicle.currentTask && (
                      <span className="text-xs opacity-70">{vehicle.currentTask}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`badge ${
                    vehicle.status === 'active' ? 'badge-success' :
                    vehicle.status === 'maintenance' ? 'badge-warning' :
                    vehicle.status === 'charging' ? 'badge-info' :
                    'badge-ghost'
                  }`}>
                    {vehicle.status}
                  </div>
                </td>
                <td>
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
                    <span className="text-xs">{vehicle.battery}%</span>
                  </div>
                </td>
                <td className="text-sm">{vehicle.location}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <progress 
                      className="progress progress-success w-20"
                      value={vehicle.efficiency}
                      max="100"
                    ></progress>
                    <span className="text-xs">{vehicle.efficiency}%</span>
                  </div>
                </td>
                <td className="text-sm">
                  {vehicle.lastMaintenance.toLocaleDateString()}
                </td>
                <td>
                  <div className="space-x-2">
                    <button className="btn btn-xs">Details</button>
                    <button className="btn btn-xs btn-outline">Route</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 