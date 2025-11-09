'use client'

import { useQuery } from '@tanstack/react-query'
import { baseSepolia } from 'viem/chains'
import { getPublicClient } from 'wagmi/actions'

import { REGISTRAR } from '@/lib/contracts'
import { wagmiConfig } from '@/lib/wagmi'

// Check if a user has alreayd registered a name by checking the nullifier from their auth session against the registrar
export function useNullifier(nullifier?: bigint) {
  return useQuery({
    enabled: !!nullifier,
    queryKey: ['nullifier', nullifier?.toString()],
    queryFn: async () => {
      if (!nullifier) return null

      const client = getPublicClient(wagmiConfig, { chainId: baseSepolia.id })

      const label = await client.readContract({
        ...REGISTRAR,
        functionName: 'nullifiers',
        args: [nullifier],
      })

      return label ?? null
    },
  })
}
