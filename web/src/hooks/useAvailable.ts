'use client'

import { useQuery } from '@tanstack/react-query'
import { baseSepolia } from 'viem/chains'
import { getPublicClient } from 'wagmi/actions'

import { BLOCKLIST } from '@/lib/blocklist'
import { REGISTRAR } from '@/lib/contracts'
import { wagmiConfig } from '@/lib/wagmi'

export function useAvailable(label: string) {
  return useQuery({
    enabled: !!label,
    queryKey: ['available', label],
    queryFn: async () => {
      if (BLOCKLIST.has(label)) {
        return false
      }

      const client = getPublicClient(wagmiConfig, { chainId: baseSepolia.id })

      return client.readContract({
        ...REGISTRAR,
        functionName: 'available',
        args: [label],
      })
    },
  })
}
