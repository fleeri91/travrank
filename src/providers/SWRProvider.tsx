'use client'

import { SWRConfig } from 'swr'

import { fetcher } from '@/api'

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  )
}
