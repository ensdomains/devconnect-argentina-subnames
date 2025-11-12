'use client'

import { useModal } from '@getpara/react-sdk'
import { connect } from '@parcnet-js/app-connector'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import superjson from 'superjson'
import { useDebounce } from 'use-debounce'

import { ZAPP, ZUPASS_PROOF_REQUEST } from '@/app/api/auth/constants'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAccount } from '@/hooks/useAccount'
import { useAuth } from '@/hooks/useAuth'
import { useAvailable } from '@/hooks/useAvailable'
import { useNullifier } from '@/hooks/useNullifier'

export function Register() {
  // Local state
  const [label, setLabel] = useState('')
  const [debouncedLabel] = useDebounce(label, 500)
  const isAvailable = useAvailable(debouncedLabel)

  // Zupass
  const auth = useAuth()
  const registeredLabel = useNullifier(auth.data?.nullifier)
  const [isZupassLoading, setIsZupassLoading] = useState(false)

  // Wallet
  const { openModal } = useModal()
  const { address } = useAccount()

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async ({ label, owner }: { label: string; owner: string }) => {
      const res = await fetch('/api/relay/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label,
          owner,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        // Get the error message from the response
        throw new Error(json.message)
      }

      return json
    },
    onSuccess: () => {
      toast.success('Name registered')
      registeredLabel.refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  if (!auth.data?.authed) {
    return (
      <div>
        <Button
          size="large"
          onClick={async () => {
            setIsZupassLoading(true)

            // This is a client component and the element is defined in layout.tsx so it will always be present
            const connector = document.getElementById('zupass-app-connector')!
            const zupassRes = await connect(
              ZAPP,
              connector,
              'https://zupass.org'
            )

            const proveRes = await zupassRes.gpc.prove({
              request: ZUPASS_PROOF_REQUEST.schema,
              collectionIds: ['Tickets'],
            })

            // Pass relevant details from zupassRes to the backend which verifies things and creates a cookie
            await fetch('/api/auth', {
              method: 'POST',
              body: superjson.stringify(proveRes),
            })

            setIsZupassLoading(false)
            await auth.refetch()
          }}
        >
          {isZupassLoading && <Loader2 className="animate-spin" size={16} />}
          Connect Zupass
        </Button>
        <Label>A Devconnect exclusive!</Label>
      </div>
    )
  }

  if (registeredLabel.data) {
    return (
      <Button size="large" asChild>
        <Link href={`/${registeredLabel.data}`}>Go to Your Name</Link>
      </Button>
    )
  }

  return (
    <div>
      <form className="flex items-center gap-x-2">
        <Input
          suffix={
            <span className="text-brand-grey font-medium">.worldfair.eth</span>
          }
          placeholder="nick"
          onChange={(e) => setLabel(e.target.value)}
        />

        {(() => {
          if (address) {
            return (
              <Button
                size="small"
                type="submit"
                className="uppercase"
                disabled={
                  !isAvailable.data === true || registerMutation.isPending
                }
                onClick={async (e) => {
                  e.preventDefault()

                  if (!auth.data?.nullifier) {
                    alert('This should be unreachable')
                    return
                  }

                  registerMutation.mutate({
                    label: debouncedLabel,
                    owner: address,
                  })
                }}
              >
                {registerMutation.isPending && (
                  <Loader2 className="animate-spin" size={16} />
                )}
                Claim
              </Button>
            )
          }

          return (
            <Button
              size="small"
              type="button"
              className="uppercase"
              onClick={() => openModal()}
            >
              Connect
            </Button>
          )
        })()}
      </form>

      <Label>
        {isAvailable.isLoading && (
          <Loader2 className="animate-spin" size={16} />
        )}
        {isAvailable.isError && 'Error checking availability'}
        {isAvailable.data === true && 'Available'}
        {isAvailable.data === false && 'Not available'}
        {debouncedLabel === '' && 'Enter a name to register'}
      </Label>
    </div>
  )
}

function Label({ children }: React.PropsWithChildren) {
  return (
    <span className="text-brand-lapise-dense mt-1 ml-3 block font-mono text-xs uppercase">
      {children}
    </span>
  )
}
