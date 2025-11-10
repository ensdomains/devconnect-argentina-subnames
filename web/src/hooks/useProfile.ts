import { sepolia } from 'viem/chains'
import { normalize } from 'viem/ens'
import { getPublicClient } from 'wagmi/actions'

import {
  ALL_COIN_TYPES,
  GENERIC_TEXT_KEYS,
  SOCIAL_TEXT_KEYS,
} from '@/lib/records'
import { wagmiConfig } from '@/lib/wagmi'

export async function getProfile(_label: string) {
  const label = normalize(_label)

  const client = getPublicClient(wagmiConfig, { chainId: sepolia.id })

  const addresses: Record<string, string> = {}
  await Promise.all(
    ALL_COIN_TYPES.map(async (coinType) => {
      const address = await client.getEnsAddress({
        name: `${label}.worldsfair.eth`,
        coinType,
      })
      addresses[coinType.toString()] = address as string
    })
  )

  const texts: Record<string, string> = {}
  await Promise.all(
    [...GENERIC_TEXT_KEYS, ...SOCIAL_TEXT_KEYS].map(async (key) => {
      const value = await client.getEnsText({
        name: `${label}.worldsfair.eth`,
        key,
      })
      texts[key] = value as string
    })
  )

  return {
    label,
    name: `${label}.worldsfair.eth`,
    texts,
    addresses,
  }
}
