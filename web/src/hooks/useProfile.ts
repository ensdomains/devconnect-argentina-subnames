import { erc721Abi, namehash } from 'viem'
import { baseSepolia, sepolia } from 'viem/chains'
import { normalize } from 'viem/ens'
import { getClient, getPublicClient } from 'wagmi/actions'

import { REGISTRY } from '@/lib/contracts'
import {
  ALL_COIN_TYPES,
  GENERIC_TEXT_KEYS,
  SOCIAL_TEXT_KEYS,
} from '@/lib/records'
import { wagmiConfig } from '@/lib/wagmi'

export async function getProfile(_label: string) {
  const label = normalize(_label)
  const name = `${label}.worldfair.eth`

  const l1Client = getPublicClient(wagmiConfig, { chainId: sepolia.id })
  const l2Client = getPublicClient(wagmiConfig, { chainId: baseSepolia.id })

  const owner = await l2Client.readContract({
    ...REGISTRY,
    abi: erc721Abi,
    functionName: 'ownerOf',
    args: [BigInt(namehash(name))],
  })

  const addresses: Record<string, string> = {}
  await Promise.all(
    ALL_COIN_TYPES.map(async (coinType) => {
      const address = await l1Client.getEnsAddress({
        name,
        coinType,
      })
      addresses[coinType.toString()] = address as string
    })
  )

  const texts: Record<string, string> = {}
  await Promise.all(
    [...GENERIC_TEXT_KEYS, ...SOCIAL_TEXT_KEYS].map(async (key) => {
      const value = await l1Client.getEnsText({
        name,
        key,
      })
      texts[key] = value as string
    })
  )

  return {
    label,
    name,
    owner,
    texts,
    addresses,
  }
}

export type Profile = Awaited<ReturnType<typeof getProfile>>
