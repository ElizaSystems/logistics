'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ChatMessage {
  sender: 'bot' | 'user'
  message: string
}

interface AgentCommand {
  command: string
  description: string
  handler: () => string
}

export function AgentInterface() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const commands: AgentCommand[] = [
    {
      command: 'inventory',
      description: 'Check inventory status and manage stock levels',
      handler: () => {
        router.push('/inventory')
        return 'Navigating to Inventory management...'
      }
    },
    {
      command: 'fleet',
      description: 'Monitor and manage fleet vehicles',
      handler: () => {
        router.push('/fleet')
        return 'Opening Fleet management dashboard...'
      }
    },
    {
      command: 'warehouses',
      description: 'Access warehouse information and controls',
      handler: () => {
        router.push('/warehouses')
        return 'Loading Warehouse management system...'
      }
    },
    {
      command: 'deploy agent',
      description: 'Deploy a new AI agent',
      handler: () => {
        // TODO: Integrate with DeployAgentModal from agents-feature.tsx
        return 'Initiating agent deployment process...'
      }
    },
    {
      command: 'analytics',
      description: 'View system analytics and insights',
      handler: () => {
        router.push('/analytics')
        return 'Loading Analytics dashboard...'
      }
    },
    {
      command: 'status',
      description: 'Get current system status',
      handler: () => {
        return `System Status:
- Active Agents: 3
- Fleet Utilization: 85%
- Warehouse Capacity: 72%
- On-Time Delivery: 94.2%`
      }
    }
  ]

  const processCommand = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput === 'help') {
      return commands
        .map(cmd => `${cmd.command}: ${cmd.description}`)
        .join('\n')
    }

    const matchedCommand = commands.find(cmd => 
      lowerInput.includes(cmd.command.toLowerCase())
    )

    if (matchedCommand) {
      return matchedCommand.handler()
    }

    return 'Command not recognized. Type "help" to see available commands.'
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = { sender: 'user', message: input }
    const botResponse: ChatMessage = { 
      sender: 'bot', 
      message: processCommand(input)
    }

    setMessages(prev => [...prev, userMessage, botResponse])
    setInput('')
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">AI Command Interface</h2>
        <div className="flex flex-col h-[200px] max-h-[200px]">
          <div className="flex-grow overflow-y-auto p-4 bg-base-200 rounded-lg mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`chat ${msg.sender === 'bot' ? 'chat-start' : 'chat-end'} mb-2`}>
                <div className={`chat-bubble ${msg.sender === 'bot' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                  <pre className="whitespace-pre-wrap">{msg.message}</pre>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a command... (try 'help')"
              className="input input-bordered flex-grow"
            />
            <button onClick={handleSend} className="btn btn-primary">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentInterface