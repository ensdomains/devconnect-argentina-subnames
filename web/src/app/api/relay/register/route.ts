import {
  Address,
  ContractFunctionExecutionError,
  Hex,
  InsufficientFundsError,
  encodeFunctionData,
  getAddress,
  isAddress,
  namehash,
  publicActions,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { writeContract } from 'viem/actions'
import { normalize } from 'viem/ens'
import { getClient } from 'wagmi/actions'
import { baseSepolia } from 'wagmi/chains'
import { z } from 'zod'

import { REGISTRAR, REGISTRY, RESOLVER_ABI } from '@/lib/contracts'
import { EVM_COIN_TYPES } from '@/lib/records'
import { wagmiConfig } from '@/lib/wagmi'

import { getSession } from '../../auth/shared'

const registerSchema = z.object({
  label: z.string(),
  owner: z.string().refine((address) => isAddress(address)),
})

const approvedContracts: Address[] = [
  REGISTRAR.address,
  REGISTRY.address,
  '0x0000000000D8e504002cC26E3Ec46D81971C1664', // L2 Reverse Registrar
  '0x00000BeEF055f7934784D6d81b6BC86665630dbA', // L2 Reverse Registrar (testnet)
]

const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as Hex

// Submit transactions to approved contracts for authorized users (ticket holders)
export async function POST(req: Request) {
  const body = await req.json()
  const { label, owner: _owner } = registerSchema.parse(body)
  const owner = getAddress(_owner)

  const session = await getSession()
  if (!session.nullifierHashV4) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const client = getClient(wagmiConfig, { chainId: baseSepolia.id }).extend(
    publicActions
  )

  try {
    const tx = await writeContract(client, {
      ...REGISTRAR,
      account: privateKeyToAccount(PRIVATE_KEY),
      functionName: 'register',
      args: [
        label,
        owner,
        getResolverCalls(label, owner),
        BigInt(session.nullifierHashV4),
      ],
    })

    const receipt = await client.waitForTransactionReceipt({ hash: tx })

    if (receipt.status === 'reverted') {
      return Response.json(
        {
          message: 'Transaction failed',
          hash: tx,
        },
        { status: 500 }
      )
    }

    return Response.json({
      message: 'Name registered',
      hash: tx,
    })
  } catch (error) {
    if (error instanceof ContractFunctionExecutionError) {
      return Response.json({ message: error.message }, { status: 500 })
    }

    if (error instanceof InsufficientFundsError) {
      return Response.json({ message: 'Insufficient funds' }, { status: 500 })
    }

    return Response.json(
      { message: 'Failed to register name' },
      { status: 500 }
    )
  }
}

// Set the address for a bunch of chains
function getResolverCalls(label: string, owner: Address) {
  const node = namehash(normalize(`${label}.worldsfair.eth`))

  return EVM_COIN_TYPES.map((coinType) =>
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [node, BigInt(coinType), owner],
    })
  )
}
