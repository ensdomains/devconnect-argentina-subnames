'use client'

import { useQuery } from '@tanstack/react-query'
import { base } from 'viem/chains'
import { getPublicClient } from 'wagmi/actions'

import { wagmiConfig } from '@/lib/wagmi'

export function useAvailable(label: string) {
  return useQuery({
    enabled: !!label,
    queryKey: ['available', label],
    queryFn: async () => {
      getPublicClient(wagmiConfig, { chainId: base.id })

      // Simulate RPC request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    },
  })
}
