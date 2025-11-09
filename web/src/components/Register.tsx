'use client'

import { Zapp, connect } from '@parcnet-js/app-connector'
import { ticketProofRequest } from '@parcnet-js/ticket-spec'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import superjson from 'superjson'
import { useDebounce } from 'use-debounce'

import {
  ZUPASS_EVENT_ID,
  ZUPASS_NULLIFIER,
  ZUPASS_PROOF_REQUEST,
  ZUPASS_SIGNER,
} from '@/app/api/auth/constants'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAvailable } from '@/hooks/useAvailable'

const zapp: Zapp = {
  name: 'ENS',
  permissions: {
    REQUEST_PROOF: { collections: ['Tickets'] },
    READ_POD: { collections: ['Tickets'] },
    READ_PUBLIC_IDENTIFIERS: {},
  },
}

export function Register() {
  const [label, setLabel] = useState('')
  const [debouncedLabel] = useDebounce(label, 500)
  const isAvailable = useAvailable(debouncedLabel)

  const isAuthed = false

  if (!isAuthed) {
    return (
      <div>
        <Button
          size="large"
          onClick={async () => {
            // This is a client component and the element is defined in layout.tsx so it will always be present
            const connector = document.getElementById('zupass-app-connector')!
            const zupassRes = await connect(
              zapp,
              connector,
              'https://zupass.org'
            )

            const identityCommitment =
              await zupassRes.identity.getSemaphoreV4Commitment()

            const proveRes = await zupassRes.gpc.prove({
              request: ZUPASS_PROOF_REQUEST.schema,
              collectionIds: ['Tickets'],
            })

            // Pass relevant details from zupassRes to the backend which verifies things and creates a cookie
            await fetch('/api/auth', {
              method: 'POST',
              body: superjson.stringify(proveRes),
            })
          }}
        >
          Connect Zupass
        </Button>
        <Label>A Devconnect exclusive!</Label>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <Input
          suffix={
            <span className="text-brand-grey font-medium">.worldfair.eth</span>
          }
          placeholder="nick"
          onChange={(e) => setLabel(e.target.value)}
        />
        <Button size="small" className="uppercase" asChild>
          <a href={`/greg`}>Claim</a>
        </Button>
      </div>

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
