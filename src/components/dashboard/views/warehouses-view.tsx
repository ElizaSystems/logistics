'use client'

import { useState } from 'react'

interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  utilized: number
  temperature: number
  humidity: number
  activeRobots: number
  zones: {
    id: string
    name: string
    type: 'storage' | 'picking' | 'packing' | 'shipping'
    utilization: number
  }[]
}

export function WarehousesView() {
  const [warehouses] = useState<Warehouse[]>([
    {
      id: '1',
      name: 'Warehouse A',
      location: '123 Logistics Way',
      capacity: 10000,
      utilized: 7800,
      temperature: 22,
      humidity: 45,
      activeRobots: 12,
      zones: [
        { id: '1', name: 'Zone A1', type: 'storage', utilization: 85 },
        { id: '2', name: 'Zone A2', type: 'picking', utilization: 65 },
      ],
    },
    {
      id: '2',
      name: 'Warehouse B',
      location: '456 Supply Chain Rd',
      capacity: 15000,
      utilized: 9000,
      temperature: 21,
      humidity: 42,
      activeRobots: 15,
      zones: [
        { id: '3', name: 'Zone B1', type: 'storage', utilization: 75 },
        { id: '4', name: 'Zone B2', type: 'shipping', utilization: 45 },
      ],
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Warehouse Management</h2>
        <button className="btn btn-primary">Add Warehouse</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{warehouse.name}</h3>
              <p className="text-sm">{warehouse.location}</p>
              
              <div className="grid grid-cols-2 gap-4 my-4">
                <div>
                  <div className="text-sm opacity-70">Capacity Utilization</div>
                  <div className="flex items-center gap-2">
                    <progress 
                      className="progress w-full" 
                      value={(warehouse.utilized / warehouse.capacity) * 100} 
                      max="100"
                    ></progress>
                    <span className="text-sm">{Math.round((warehouse.utilized / warehouse.capacity) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Active Robots</div>
                  <div className="text-xl">{warehouse.activeRobots}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Temperature</div>
                  <div className="text-xl">{warehouse.temperature}°C</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Humidity</div>
                  <div className="text-xl">{warehouse.humidity}%</div>
                </div>
              </div>

              <div className="divider">Zones</div>
              <div className="space-y-2">
                {warehouse.zones.map((zone) => (
                  <div key={zone.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{zone.name}</div>
                      <div className="text-sm opacity-70">{zone.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <progress 
                        className="progress w-20" 
                        value={zone.utilization} 
                        max="100"
                      ></progress>
                      <span className="text-sm">{zone.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm">View Details</button>
                <button className="btn btn-sm btn-outline">Manage Zones</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 