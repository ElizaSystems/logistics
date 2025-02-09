'use client'

import { useState } from 'react'

interface Order {
  id: string
  orderNumber: string
  customer: string
  items: { sku: string; quantity: number }[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  estimatedDelivery: Date
}

export function OrdersView() {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'Acme Corp',
      items: [{ sku: 'SKU-123', quantity: 5 }],
      status: 'processing',
      priority: 'high',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'TechStart Inc',
      items: [{ sku: 'SKU-456', quantity: 2 }],
      status: 'pending',
      priority: 'urgent',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button className="btn btn-primary">New Order</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Est. Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customer}</td>
                <td>{order.items.length} items</td>
                <td>
                  <div className={`badge ${
                    order.status === 'delivered' ? 'badge-success' :
                    order.status === 'processing' ? 'badge-warning' :
                    order.status === 'cancelled' ? 'badge-error' :
                    'badge-info'
                  }`}>
                    {order.status}
                  </div>
                </td>
                <td>
                  <div className={`badge ${
                    order.priority === 'urgent' ? 'badge-error' :
                    order.priority === 'high' ? 'badge-warning' :
                    order.priority === 'medium' ? 'badge-info' :
                    'badge-ghost'
                  }`}>
                    {order.priority}
                  </div>
                </td>
                <td>{order.createdAt.toLocaleDateString()}</td>
                <td>{order.estimatedDelivery.toLocaleDateString()}</td>
                <td>
                  <div className="space-x-2">
                    <button className="btn btn-xs btn-outline">View</button>
                    <button className="btn btn-xs btn-outline btn-error">Cancel</button>
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