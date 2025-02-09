import { useState } from 'react'

interface CommandSection {
  id: string
  label: string
  commands: {
    command: string
    description: string
  }[]
}

export function CommandHelp() {
  const [activeSection, setActiveSection] = useState('agent')
  
  const sections: CommandSection[] = [
    {
      id: 'agent',
      label: 'Agents',
      commands: [
        {
          command: 'deploy agent',
          description: 'Deploy a new AI agent'
        },
        {
          command: 'configure agent [name]',
          description: 'Configure an existing agent'
        },
        {
          command: 'view logs [name]',
          description: 'View agent activity logs'
        },
        {
          command: 'list agents',
          description: 'Show all active agents'
        }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      commands: [
        {
          command: 'create order',
          description: 'Create new logistics order'
        },
        {
          command: 'track order [id]',
          description: 'Track order status'
        }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      commands: [
        {
          command: 'stock check [id]',
          description: 'Check stock levels'
        },
        {
          command: 'restock [id] [qty]',
          description: 'Request inventory restock'
        }
      ]
    },
    {
      id: 'fleet',
      label: 'Fleet',
      commands: [
        {
          command: 'assign vehicle',
          description: 'Assign vehicle to delivery'
        },
        {
          command: 'vehicle status [id]',
          description: 'Check vehicle status'
        },
        {
          command: 'optimize routes',
          description: 'Optimize delivery routes'
        }
      ]
    },
    {
      id: 'system',
      label: 'System',
      commands: [
        {
          command: 'status',
          description: 'Get system status'
        },
        {
          command: 'alerts',
          description: 'Show system alerts'
        }
      ]
    }
  ]

  return (
    <div className="card bg-base-200">
      <div className="card-body p-4">
        <h3 className="card-title text-lg mb-4">Available Commands</h3>
        
        <div className="tabs tabs-boxed bg-base-300 mb-4 flex">
          {sections.map(section => (
            <button
              key={section.id}
              className={`tab flex-1 ${activeSection === section.id ? 'tab-active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {sections
            .find(s => s.id === activeSection)
            ?.commands.map((cmd, i) => (
              <div key={i} className="command-item">
                <code className="text-sm bg-base-300 px-2 py-1 rounded">{cmd.command}</code>
                <p className="text-sm mt-1 opacity-70">{cmd.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
} 