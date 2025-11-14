'use client'

import { useModal } from '@getpara/react-sdk'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  useBalance,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { base } from 'wagmi/chains'

import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { useAccount } from '@/hooks/useAccount'
import { useAuth } from '@/hooks/useAuth'
import { useDisconnect } from '@/hooks/useDisconnect'
import { useNullifier } from '@/hooks/useNullifier'
import { REVERSE_REGISTRAR } from '@/lib/contracts'

export default function ToolsPage() {
  const auth = useAuth()
  const { openModal } = useModal()
  const disconnect = useDisconnect()
  const { address, isEmbedded } = useAccount()
  const { data: balance } = useBalance({ address, chainId: base.id })
  const { data: registeredLabel } = useNullifier(auth.data?.nullifier)
  const nameRegistered = registeredLabel
    ? `${registeredLabel}.worldfair.eth`
    : null

  const { switchChain } = useSwitchChain()
  const tx = useWriteContract()
  const receipt = useWaitForTransactionReceipt({
    hash: tx.data,
    chainId: base.id,
  })

  const { data: baseReverseRecord } = useReadContract({
    ...REVERSE_REGISTRAR,
    functionName: 'nameForAddr',
    args: [address!],
    chainId: base.id,
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    if (tx.isError) {
      toast.error('Failed to submit transaction')
      console.error(tx.error)
    } else if (receipt.isSuccess) {
      toast.success('Reverse record set')
    } else if (receipt.isError) {
      toast.error('Failed to set reverse record')
    }
  }, [tx.status, receipt.status])

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="flex flex-1 flex-col gap-y-10 px-4 py-6">
        <div>
          <h1 className="text-brand-blue-dark mb-2 text-4xl">Tools</h1>
          {address ? (
            <Button onClick={() => disconnect()}>Disconnect</Button>
          ) : (
            <Button onClick={() => openModal()}>Connect wallet</Button>
          )}
        </div>

        <div>
          <h2 className="text-brand-blue-dark text-2xl">Debugging info</h2>
          <pre>Address: {address}</pre>
          <pre>
            Balance: {balance?.value} {balance?.symbol}
          </pre>
          <pre>Embedded wallet: {isEmbedded ? 'true' : 'false'}</pre>
          <pre>Name registered: {nameRegistered}</pre>
          <pre>Reverse record: {baseReverseRecord}</pre>
        </div>

        <div className="">
          <h2 className="text-brand-blue-dark text-2xl">Reverse record</h2>
          <p className="text-brand-grey mb-2 text-sm">
            Set the reverse record for your connected address if it didn't work
            during registration.
          </p>
          <Button
            disabled={!address || !nameRegistered}
            onClick={() => {
              switchChain({ chainId: base.id })
              tx.writeContract({
                ...REVERSE_REGISTRAR,
                functionName: 'setName',
                args: [nameRegistered!],
              })
            }}
          >
            {tx.isPending ? <Loader2 className="animate-spin" size={16} /> : ''}
            Set reverse record
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
