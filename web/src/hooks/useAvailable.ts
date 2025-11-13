'use client'

import { useQuery } from '@tanstack/react-query'
import { base } from 'viem/chains'
import { normalize } from 'viem/ens'
import { getPublicClient } from 'wagmi/actions'

import { nameFilter } from '@/lib/blocklist'
import { REGISTRAR } from '@/lib/contracts'
import { wagmiConfig } from '@/lib/wagmi'

export function useAvailable(label: string) {
  return useQuery({
    enabled: !!label,
    queryKey: ['available', label],
    queryFn: async () => {
      if (nameFilter.isProfane(label)) {
        return false
      }

      const client = getPublicClient(wagmiConfig, { chainId: base.id })

      return client.readContract({
        ...REGISTRAR,
        functionName: 'available',
        args: [normalize(label)],
      })
    },
  })
}
