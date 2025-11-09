'use client'

import { useQuery } from '@tanstack/react-query'
import { baseSepolia } from 'viem/chains'
import { getPublicClient } from 'wagmi/actions'

import { REGISTRAR } from '@/lib/contracts'
import { wagmiConfig } from '@/lib/wagmi'

export function useAvailable(label: string) {
  return useQuery({
    enabled: !!label,
    queryKey: ['available', label],
    queryFn: async () => {
      const client = getPublicClient(wagmiConfig, { chainId: baseSepolia.id })

      const available = await client.readContract({
        ...REGISTRAR,
        functionName: 'available',
        args: [label],
      })

      return available
    },
  })
}
