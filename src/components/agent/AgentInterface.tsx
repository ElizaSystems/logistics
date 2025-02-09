'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'

interface ChatMessage {
  sender: 'bot' | 'user'
  message: string
  timestamp: Date
}

interface AgentCommand {
  command: string
  description: string
  handler: () => string
}

export function AgentInterface({ 
  onDeployAgent, 
  onConfigureAgent, 
  onViewLogs,
  metrics,
  agents,
  alerts
}: { 
  onDeployAgent: () => void
  onConfigureAgent: (agentId: string) => void
  onViewLogs: (agentId: string) => void
  metrics: any[]
  agents: any[]
  alerts: any[]
}) {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [formattedMetrics, setFormattedMetrics] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const formatted = metrics.map(metric => {
        const date = new Date(metric.timestamp)
        const formattedDate = date.toLocaleDateString()
        const formattedTime = date.toLocaleTimeString()
        return `${metric.title}: ${metric.value} (${metric.change > 0 ? '+' : ''}${metric.change}%) ${formattedDate} ${formattedTime}`
      })
      setFormattedMetrics(formatted)
    }
  }, [metrics])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSpeechSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.continuous = false
          recognitionRef.current.interimResults = false
          recognitionRef.current.lang = 'en-US' // Set language explicitly
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInput(transcript)
            handleSend()
          }

          recognitionRef.current.onerror = (event: any) => {
            switch (event.error) {
              case 'network':
                console.error('Network error occurred. Please check your internet connection.')
                break
              case 'not-allowed':
              case 'permission-denied':
                console.error('Microphone permission is required for speech recognition.')
                setIsSpeechSupported(false)
                break
              case 'no-speech':
                // Ignore no-speech error as it's common
                break
              default:
                console.error('Speech recognition error:', event.error)
            }
            setIsListening(false)
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
          }

          // Test the connection
          navigator.permissions.query({ name: 'microphone' as PermissionName })
            .then(result => {
              if (result.state === 'denied') {
                setIsSpeechSupported(false)
              }
            })
            .catch(error => {
              console.error('Permission check failed:', error)
            })

        } catch (error) {
          console.error('Speech recognition initialization error:', error)
          setIsSpeechSupported(false)
        }
      }

      return () => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop()
          } catch (error) {
            // Ignore stop errors during cleanup
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const commands: AgentCommand[] = [
    {
      command: 'deploy agent',
      description: 'Open the agent deployment modal',
      handler: () => {
        onDeployAgent()
        return 'Opening agent deployment interface...'
      }
    },
    {
      command: 'configure agent',
      description: 'Configure an existing agent (usage: configure agent <agent-name>)',
      handler: () => {
        const agentName = input.replace('configure agent', '').trim()
        const agent = agents.find(a => a.name.toLowerCase() === agentName.toLowerCase())
        if (agent) {
          onConfigureAgent(agent.id)
          return `Configuring agent: ${agent.name}`
        }
        return 'Agent not found. Please specify a valid agent name.'
      }
    },
    {
      command: 'view logs',
      description: 'View agent logs (usage: view logs <agent-name>)',
      handler: () => {
        const agentName = input.replace('view logs', '').trim()
        const agent = agents.find(a => a.name.toLowerCase() === agentName.toLowerCase())
        if (agent) {
          onViewLogs(agent.id)
          return `Displaying logs for agent: ${agent.name}`
        }
        return 'Agent not found. Please specify a valid agent name.'
      }
    },
    {
      command: 'list agents',
      description: 'Show all active agents',
      handler: () => {
        return agents.map(agent => 
          `${agent.name} (${agent.type}) - ${agent.status}\n` +
          `Last Action: ${agent.lastAction}\n` +
          `Success Rate: ${agent.successRate}%\n`
        ).join('\n')
      }
    },
    {
      command: 'alerts',
      description: 'Show current system alerts',
      handler: () => {
        return alerts.map(alert => 
          `[${alert.type.toUpperCase()}] ${alert.message}`
        ).join('\n')
      }
    },
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
        // Helper function for consistent formatting
        const formatMetric = (metric: any) => {
          const date = new Date(metric.timestamp)
          const formattedDate = date.toLocaleDateString()
          const formattedTime = date.toLocaleTimeString()
          return `${metric.title}: ${metric.value} (${metric.change > 0 ? '+' : ''}${metric.change}%) ${formattedDate} ${formattedTime}`
        }

        if (typeof window === 'undefined') {
          return metrics.map(formatMetric).join('\n')
        }
        return formattedMetrics.join('\n')
      }
    },
    {
      command: 'create order',
      description: 'Create a new logistics order (usage: create order <product-id> <quantity> <destination>)',
      handler: () => {
        // TODO: Integrate with OrdersContext
        return 'Order creation system coming soon...'
      }
    },
    {
      command: 'track order',
      description: 'Track order status (usage: track order <order-id>)',
      handler: () => {
        // TODO: Integrate with OrdersContext
        return 'Order tracking system coming soon...'
      }
    },
    {
      command: 'stock check',
      description: 'Check stock levels (usage: stock check <product-id>)',
      handler: () => {
        // TODO: Integrate with InventoryContext
        return 'Stock checking system coming soon...'
      }
    },
    {
      command: 'restock',
      description: 'Request restock for low inventory (usage: restock <product-id> <quantity>)',
      handler: () => {
        // TODO: Integrate with InventoryContext
        return 'Restock request system coming soon...'
      }
    },
    {
      command: 'assign vehicle',
      description: 'Assign vehicle to delivery (usage: assign vehicle <vehicle-id> <order-id>)',
      handler: () => {
        // TODO: Integrate with FleetContext
        return 'Vehicle assignment system coming soon...'
      }
    },
    {
      command: 'vehicle status',
      description: 'Check vehicle status (usage: vehicle status <vehicle-id>)',
      handler: () => {
        // TODO: Integrate with FleetContext
        return 'Vehicle status system coming soon...'
      }
    },
    {
      command: 'optimize routes',
      description: 'Optimize delivery routes for active orders',
      handler: () => {
        // TODO: Integrate with RouteOptimizationService
        return 'Route optimization initiated...'
      }
    },
    {
      command: 'warehouse capacity',
      description: 'Check warehouse capacity and utilization',
      handler: () => {
        // TODO: Integrate with WarehouseContext
        return 'Warehouse capacity check system coming soon...'
      }
    }
  ]

  const processCommand = (input: string): string => {
    const lowerInput = input.toLowerCase().trim()
    
    if (lowerInput === 'help') {
      const categories = {
        'Agent Management': commands.filter(cmd => 
          ['deploy agent', 'configure agent', 'view logs', 'list agents'].includes(cmd.command)
        ),
        'System Status': commands.filter(cmd => 
          ['status', 'alerts'].includes(cmd.command)
        ),
        'Navigation': commands.filter(cmd => 
          ['inventory', 'fleet', 'warehouses', 'analytics'].includes(cmd.command)
        ),
        'Order Management': commands.filter(cmd => 
          ['create order', 'track order'].includes(cmd.command)
        ),
        'Inventory Control': commands.filter(cmd => 
          ['stock check', 'restock'].includes(cmd.command)
        ),
        'Fleet Operations': commands.filter(cmd => 
          ['assign vehicle', 'vehicle status', 'optimize routes'].includes(cmd.command)
        ),
        'Warehouse Operations': commands.filter(cmd => 
          ['warehouse capacity'].includes(cmd.command)
        )
      }
  
      return Object.entries(categories)
        .map(([category, cmds]) => 
          `${category}:\n${cmds
            .map(cmd => `  ${cmd.command}${cmd.description ? ` - ${cmd.description}` : ''}`)
            .join('\n')}`
        )
        .join('\n\n')
    }
  
    if (lowerInput === 'status') {
      // Use the same formatting helper as in the command handler
      const formatMetric = (metric: any) => {
        const date = new Date(metric.timestamp)
        const formattedDate = date.toLocaleDateString()
        const formattedTime = date.toLocaleTimeString()
        return `${metric.title}: ${metric.value} (${metric.change > 0 ? '+' : ''}${metric.change}%) ${formattedDate} ${formattedTime}`
      }

      if (typeof window === 'undefined') {
        return metrics.map(formatMetric).join('\n')
      }
      return formattedMetrics.join('\n')
    }
  
    const matchedCommand = commands.find(cmd => {
      const commandLower = cmd.command.toLowerCase()
      // Allow exact matches or matches with additional parameters (a whitespace following the command string)
      return lowerInput === commandLower || lowerInput.startsWith(`${commandLower} `)
    })
  
    if (matchedCommand) {
      return matchedCommand.handler()
    }
  
    return 'Command not recognized. Type "help" to see available commands.'
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = { 
      sender: 'user', 
      message: input,
      timestamp: new Date()
    }
    const botResponse: ChatMessage = { 
      sender: 'bot', 
      message: processCommand(input),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
    setInput('')
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Speech recognition error:', error)
        setIsListening(false)
      }
    }
    setIsListening(!isListening)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const ChatContent = () => (
    <>
      <div className={`flex-grow overflow-y-auto p-2 sm:p-4 bg-base-200 rounded-lg mb-2 sm:mb-4 ${
        isExpanded ? 'h-[calc(100vh-280px)] sm:h-[45vh]' : 'h-[300px] sm:h-[200px]'
      }`}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat ${msg.sender === 'bot' ? 'chat-start' : 'chat-end'} mb-2`}>
            <div className={`chat-bubble ${
              msg.sender === 'bot' ? 'chat-bubble-primary' : 'chat-bubble-secondary'
            } max-w-[75vw] sm:max-w-[400px]`}>
              <pre className="whitespace-pre-wrap text-xs sm:text-sm break-words">{msg.message}</pre>
              <div className="text-[10px] sm:text-xs opacity-50 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={isMobile ? "Command... (try 'help')" : "Type a command... (try 'help')"}
            className="input input-bordered flex-grow text-sm min-h-[2.5rem]"
            autoComplete="off"
          />
          {isSpeechSupported && (
            <button
              onClick={toggleListening}
              className={`btn btn-square ${isListening ? 'btn-error' : 'btn-primary'}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <FaMicrophoneSlash className="h-4 w-4" /> : <FaMicrophone className="h-4 w-4" />}
            </button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button onClick={() => setIsExpanded(!isExpanded)} className="btn btn-ghost btn-sm">
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button onClick={handleSend} className="btn btn-primary btn-sm px-8">
            Send
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-2 sm:p-6">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h2 className="card-title text-lg sm:text-xl">AI Command Interface</h2>
          {!isMobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-ghost btn-sm"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
        <ChatContent />
      </div>
    </div>
  )
}

export default AgentInterface