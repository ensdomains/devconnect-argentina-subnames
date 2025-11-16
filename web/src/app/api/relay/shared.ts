import { Hex, publicActions, walletActions } from 'viem'
import { getClient } from 'wagmi/actions'
import { base } from 'wagmi/chains'

import { wagmiConfig } from '@/lib/wagmi'

export const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as Hex

export const relayClient = getClient(wagmiConfig, {
  chainId: base.id,
})
  .extend(publicActions)
  .extend(walletActions)
