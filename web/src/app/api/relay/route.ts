import { cookies } from 'next/headers'
import {
  Address,
  Hex,
  createPublicClient,
  getAddress,
  isAddress,
  isHex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getPublicClient, getWalletClient } from 'wagmi/actions'
import { base } from 'wagmi/chains'
import { z } from 'zod'

import { wagmiConfig } from '@/lib/wagmi'

import { checkAuth, getSession } from '../auth/shared'

const relaySchema = z.object({
  address: z.string().refine((address) => isAddress(address)),
  data: z.string().refine((data) => isHex(data)),
})

const approvedContracts: Address[] = []

const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as Hex

if (!PRIVATE_KEY) {
  throw new Error('RELAYER_PRIVATE_KEY is not set')
}

const walletClient = getWalletClient(
  { ...wagmiConfig, account: privateKeyToAccount(PRIVATE_KEY) },
  { chainId: base.id }
)

// Submit transactions to approved contracts for authorized users (ticket holders)
export async function POST(req: Request) {
  const body = await req.json()
  const { address: _addr, data } = relaySchema.parse(body)
  const address = getAddress(_addr)

  const isAuthed = checkAuth(await getSession())

  if (!isAuthed || !approvedContracts.includes(address)) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({ message: 'Hello, world!' })
}
