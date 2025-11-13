import {
  Address,
  ContractFunctionExecutionError,
  Hex,
  InsufficientFundsError,
  encodeFunctionData,
  getAddress,
  isAddress,
  isHex,
  namehash,
  parseEther,
  publicActions,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sendTransaction, writeContract } from 'viem/actions'
import { normalize } from 'viem/ens'
import { getClient } from 'wagmi/actions'
import { base } from 'wagmi/chains'
import { z } from 'zod'

import { nameFilter } from '@/lib/blocklist'
import { REGISTRAR, RESOLVER_ABI, REVERSE_REGISTRAR } from '@/lib/contracts'
import { EVM_COIN_TYPES } from '@/lib/records'
import { wagmiConfig } from '@/lib/wagmi'

import { getSession } from '../../auth/shared'

const registerSchema = z.object({
  label: z.string().refine((label) => normalize(label)),
  owner: z.string().refine((address) => isAddress(address)),
  sigHash: z
    .string()
    .refine((sigHash) => isHex(sigHash))
    .optional(),
  sigExpiry: z.number().optional(),
  coinTypes: z.array(z.string()).optional(),
})

const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as Hex

// Submit transactions to approved contracts for authorized users (ticket holders)
export async function POST(req: Request) {
  const body = await req.json()
  const {
    label,
    owner: _owner,
    sigHash: _sigHash,
    sigExpiry,
    coinTypes: _coinTypes,
  } = registerSchema.parse(body)
  const owner = getAddress(_owner)
  const sigHash = isHex(_sigHash) ? _sigHash : undefined
  const coinTypes = _coinTypes?.map((coinType) => BigInt(coinType))

  if (nameFilter.isProfane(label)) {
    return Response.json(
      { message: 'That name is not allowed.' },
      { status: 400 }
    )
  }

  const session = await getSession()
  if (!session.nullifierHashV4) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const client = getClient(wagmiConfig, { chainId: base.id }).extend(
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

    // If the user doesn't have any ETH, send a tiny amount to cover the gas on profile configuration
    const ethBalance = await client.getBalance({ address: owner })
    if (ethBalance === BigInt(0)) {
      try {
        const transferTx = await sendTransaction(client, {
          account: privateKeyToAccount(PRIVATE_KEY),
          to: owner,
          value: parseEther('0.000005'),
        })
        console.log(
          'Sent ETH to cover gas on profile configuration',
          transferTx
        )
      } catch (error) {
        // Silently failing is fine here because the main transaction still succeeded
        console.error(error)
      }
    }

    // Set the reverse record
    if (sigHash && sigExpiry && coinTypes) {
      // ok so silently fail as well (but should find a graceful way to notify the frontend)
      try {
        await writeContract(client, {
          ...REVERSE_REGISTRAR,
          account: privateKeyToAccount(PRIVATE_KEY),
          functionName: 'setNameForAddrWithSignature',
          args: [
            owner,
            BigInt(sigExpiry),
            `${label}.worldfair.eth`,
            coinTypes,
            sigHash,
          ],
        })
        console.log('Set reverse record')
      } catch (error) {
        console.error('Failed to set reverse record', error)
      }
    }

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
      let message = 'Failed to register name'

      if (error.message.includes('NullifierAlreadyUsed')) {
        message = 'Your ticket has already been used to register a name.'
      }
      return Response.json({ message }, { status: 500 })
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
  const node = namehash(`${label}.worldfair.eth`)

  return EVM_COIN_TYPES.map((coinType) =>
    encodeFunctionData({
      abi: RESOLVER_ABI,
      functionName: 'setAddr',
      args: [node, BigInt(coinType), owner],
    })
  )
}
