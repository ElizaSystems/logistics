import './globals.css'
import { ReactQueryProvider } from '@/components/providers/react-query-provider'
import { ClusterProvider } from '@/components/providers/cluster-provider'
import { SolanaProvider } from '@/components/providers/solana-provider'
import { UiLayout } from '@/components/ui/ui-layout'

export const metadata = {
  title: 'AI Logistics Hub',
  description: 'Autonomous Logistics and Warehousing Management System',
}

const links: { label: string; path: string }[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Orders', path: '/orders' },
  { label: 'Warehouses', path: '/warehouses' },
  { label: 'Fleet', path: '/fleet' },
  { label: 'AI Agents', path: '/agents' },
  { label: 'Analytics', path: '/analytics' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
