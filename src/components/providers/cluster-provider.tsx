'use client'

import { ReactNode } from 'react'
import { ClusterProvider as BaseClusterProvider } from '../cluster/cluster-data-access'

export function ClusterProvider({ children }: { children: ReactNode }) {
  return <BaseClusterProvider>{children}</BaseClusterProvider>
} 