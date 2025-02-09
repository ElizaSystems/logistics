'use client'

import { useState, useRef } from 'react'
import { AppHero, AppModal } from '../ui/ui-layout'
import { toast } from 'react-hot-toast'

interface InventoryItem {
  id: string
  sku: string
  name: string
  quantity: number
  location: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  lastUpdated: Date
}

function parseCSV(text: string): Partial<InventoryItem>[] {
  const rows = text.split('\n')
  const headers = rows[0].split(',').map(h => h.trim().toLowerCase())
  
  return rows.slice(1)
    .filter(row => row.trim())
    .map(row => {
      const values = row.split(',').map(v => v.trim())
      const item: Partial<InventoryItem> = {}
      
      headers.forEach((header, index) => {
        if (header === 'quantity') {
          item[header] = parseInt(values[index])
        } else if (header === 'status') {
          if (['in-stock', 'low-stock', 'out-of-stock'].includes(values[index])) {
            item[header] = values[index] as InventoryItem['status']
          }
        } else if (header === 'lastUpdated') {
          item['lastUpdated'] = new Date(values[index])
        } else if (['id', 'sku', 'name', 'location'].includes(header)) {
          item[header as keyof Pick<InventoryItem, 'id' | 'sku' | 'name' | 'location'>] = values[index]
        }
      })
      
      return item
    })
}

function parseXML(text: string): Partial<InventoryItem>[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(text, 'text/xml')
  const items = xmlDoc.getElementsByTagName('item')
  
  return Array.from(items).map(item => {
    const getElementText = (tag: string) => 
      item.getElementsByTagName(tag)[0]?.textContent || ''
      
    return {
      sku: getElementText('sku'),
      name: getElementText('name'),
      quantity: parseInt(getElementText('quantity')),
      location: getElementText('location'),
      status: getElementText('status') as InventoryItem['status'],
    }
  })
}

function AddItemModal({ show, hide, onAdd }: {
  show: boolean
  hide: () => void
  onAdd: (item: Partial<InventoryItem> | Partial<InventoryItem>[]) => void
}) {
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual')
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<InventoryItem['status']>('in-stock')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileUpload triggered")
    const file = e.target.files?.[0]
    if (!file) {
      console.error("No file selected")
      return
    }
    console.log("File selected:", file.name)

    try {
      const text = await file.text()
      let items: Partial<InventoryItem>[] = []

      if (file.name.endsWith('.csv')) {
        items = parseCSV(text)
      } else if (file.name.endsWith('.xml')) {
        items = parseXML(text)
      } else {
        throw new Error('Unsupported file format')
      }

      if (items.length === 0) {
        throw new Error('No valid items found in file')
      }

      console.log("Parsed items:", items)
      onAdd(items)
      hide()
      toast.success(`Successfully imported ${items.length} items`)
    } catch (error) {
      console.error('Error parsing file:', error)
      toast.error('Error importing file: ' + (error as Error).message)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = () => {
    console.log("handleSubmit triggered with values:", { sku, name, quantity, location, status })
    // Validate required fields
    if (!sku || !name || !quantity || !location) {
      console.error("Validation failed: Missing required fields")
      toast.error('Please fill in all required fields')
      return
    }

    // Create new inventory item
    const newItem: Partial<InventoryItem> = {
      sku,
      name,
      quantity: parseInt(quantity),
      location,
      status,
      lastUpdated: new Date()
    }

    console.log("Manual item created:", newItem)
    onAdd(newItem)
    hide()
    toast.success('Item added successfully')

    // Reset form
    setSku('')
    setName('')
    setQuantity('')
    setLocation('')
    setStatus('in-stock')
  }

  return (
    <AppModal
      title="Add Inventory Item"
      hide={() => { console.log("AppModal hide triggered"); hide() }}
      show={show}
      submit={activeTab === 'manual' ? () => { 
        console.log("Manual submit button clicked")
        handleSubmit()
      } : undefined}
      submitLabel={activeTab === 'manual' ? 'Add Item' : undefined}
    >
      <div className="space-y-4">
        <div className="tabs tabs-boxed">
          <button 
            className={`tab ${activeTab === 'manual' ? 'tab-active' : ''}`}
            onClick={() => { 
              console.log("Switching to manual tab")
              setActiveTab('manual')
            }}
          >
            Manual Entry
          </button>
          <button 
            className={`tab ${activeTab === 'import' ? 'tab-active' : ''}`}
            onClick={() => { 
              console.log("Switching to import tab")
              setActiveTab('import')
            }}
          >
            File Import
          </button>
        </div>

        {activeTab === 'import' ? (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Import File (CSV or XML)</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept=".csv,.xml"
              onChange={(e) => {
                console.log("File input onChange event")
                handleFileUpload(e)
              }}
              ref={fileInputRef}
            />
            <label className="label">
              <span className="label-text-alt">
                CSV Format: sku,name,quantity,location,status
              </span>
            </label>
          </div>
        ) : (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text">SKU</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={sku}
                onChange={(e) => {
                  console.log("SKU input changed to:", e.target.value)
                  setSku(e.target.value)
                }}
                placeholder="Enter SKU"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => {
                  console.log("Name input changed to:", e.target.value)
                  setName(e.target.value)
                }}
                placeholder="Enter item name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={quantity}
                onChange={(e) => {
                  console.log("Quantity input changed to:", e.target.value)
                  setQuantity(e.target.value)
                }}
                placeholder="Enter quantity"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={location}
                onChange={(e) => {
                  console.log("Location input changed to:", e.target.value)
                  setLocation(e.target.value)
                }}
                placeholder="Enter location"
              />
            </div>
          </>
        )}
      </div>
    </AppModal>
  )
}

export default function InventoryFeature() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      sku: 'SKU-123',
      name: 'Widget A',
      quantity: 150,
      location: 'Warehouse A - Zone 1',
      status: 'in-stock',
      lastUpdated: new Date(),
    }
  ])

  const handleAddItem = (newItem: Partial<InventoryItem> | Partial<InventoryItem>[]) => {
    if (Array.isArray(newItem)) {
      // Handle bulk import
      const itemsWithIds = newItem.map(item => ({
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        lastUpdated: new Date()
      } as InventoryItem))
      
      setInventory(prev => [...prev, ...itemsWithIds])
    } else {
      // Handle single item
      const itemWithId = {
        ...newItem,
        id: `item-${Date.now()}`,
        lastUpdated: new Date()
      } as InventoryItem
      
      setInventory(prev => [...prev, itemWithId])
    }
  }

  const handleModalOpen = () => {
    console.log('Opening modal...')
    setShowAddModal(true)
  }

  const handleModalClose = () => {
    console.log('Hiding modal...')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => { 
            console.log("Add Item button clicked")
            handleModalOpen()
          }}
        >
          Add Item
        </button>
      </div>

      <AddItemModal
        show={showAddModal}
        hide={handleModalClose}
        onAdd={handleAddItem}
      />

      {/* Add the inventory table */}
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
                    <button 
                      className="btn btn-xs btn-outline"
                      onClick={() => {
                        console.log("Edit clicked for item", item.id)
                        // Add your edit logic here
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() => {
                        console.log("Delete clicked for item", item.id)
                        // Add your delete logic here
                      }}
                    >
                      Delete
                    </button>
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