import {
  Address,
  ContractFunctionExecutionError,
  Hex,
  InsufficientFundsError,
  encodeFunctionData,
  getAddress,
  isHex,
  namehash,
  parseEther,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { normalize } from 'viem/ens'
import { z } from 'zod'

import { nameFilter } from '@/lib/blocklist'
import { REGISTRAR, RESOLVER_ABI, REVERSE_REGISTRAR } from '@/lib/contracts'
import { EVM_COIN_TYPES } from '@/lib/records'

import { getSession } from '../../auth/shared'
import { PRIVATE_KEY, relayClient } from '../shared'

const registerSchema = z.object({
  label: z.string().transform((label) => normalize(label)),
  owner: z.string().transform((address) => getAddress(address)),
  sigHash: z
    .string()
    .refine((sigHash) => isHex(sigHash))
    .optional(),
  sigExpiry: z.number().optional(),
  coinTypes: z
    .array(z.string())
    .transform((coinTypes) => coinTypes.map((coinType) => BigInt(coinType)))
    .optional(),
})

// Submit transactions to approved contracts for authorized users (ticket holders)
export async function POST(req: Request) {
  const body = await req.json()
  const { label, owner, sigHash, sigExpiry, coinTypes } =
    registerSchema.parse(body)

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

  const account = privateKeyToAccount(PRIVATE_KEY)
  let startingNonce = await relayClient.getTransactionCount({
    address: account.address,
  })

  try {
    const tx = await relayClient.writeContract({
      ...REGISTRAR,
      account,
      functionName: 'register',
      args: [
        label,
        owner,
        getResolverCalls(label, owner),
        BigInt(session.nullifierHashV4),
      ],
      nonce: startingNonce++,
    })

    const receipt = await relayClient.waitForTransactionReceipt({ hash: tx })

    // If the user doesn't have any ETH, send a tiny amount to cover the gas on profile configuration
    const ethBalance = await relayClient.getBalance({ address: owner })
    if (ethBalance === BigInt(0)) {
      try {
        const transferTx = await relayClient.sendTransaction({
          account,
          to: owner,
          value: parseEther('0.000005'),
          nonce: startingNonce++,
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
      // ok to silently fail as well (but should find a graceful way to notify the frontend)
      try {
        await relayClient.writeContract({
          ...REVERSE_REGISTRAR,
          account,
          functionName: 'setNameForAddrWithSignature',
          args: [
            owner,
            BigInt(sigExpiry),
            `${label}.worldfair.eth`,
            coinTypes,
            sigHash as Hex,
          ],
          nonce: startingNonce++,
        })
        console.log('Set reverse record')
      } catch (error) {
        console.error('Failed to set reverse record', error)
      }
    }

    if (receipt.status === 'reverted') {
      console.error('Transaction failed', receipt)
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

      console.error(error, session.nullifierHashV4)
      return Response.json({ message }, { status: 500 })
    }

    if (error instanceof InsufficientFundsError) {
      console.error('Insufficient funds', error)
      return Response.json({ message: 'Insufficient funds' }, { status: 500 })
    }

    console.error('Failed to register name', error)
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
