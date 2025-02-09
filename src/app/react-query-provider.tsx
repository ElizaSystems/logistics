'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Added global click listener for debugging purposes
function useGlobalClickLogger() {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      console.log('Global click event:', e.target)
    }
    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(new QueryClient())
  useGlobalClickLogger()  // Call the hook here

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
