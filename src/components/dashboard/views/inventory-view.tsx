'use client'

import { useState } from 'react'

interface InventoryItem {
  id: string
  sku: string
  name: string
  quantity: number
  location: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  lastUpdated: Date
}

export function InventoryView() {
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      sku: 'SKU-123',
      name: 'Widget A',
      quantity: 150,
      location: 'Warehouse A - Zone 1',
      status: 'in-stock',
      lastUpdated: new Date(),
    },
    {
      id: '2',
      sku: 'SKU-456',
      name: 'Widget B',
      quantity: 25,
      location: 'Warehouse B - Zone 3',
      status: 'low-stock',
      lastUpdated: new Date(),
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <button className="btn btn-primary">Add Item</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.location}</td>
                <td>
                  <div className={`badge ${
                    item.status === 'in-stock' ? 'badge-success' :
                    item.status === 'low-stock' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {item.status}
                  </div>
                </td>
                <td>{item.lastUpdated.toLocaleString()}</td>
                <td>
                  <div className="space-x-2">
                    <button className="btn btn-xs btn-outline">Edit</button>
                    <button className="btn btn-xs btn-outline btn-error">Delete</button>
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