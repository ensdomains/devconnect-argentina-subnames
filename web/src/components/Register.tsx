'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAvailable } from '@/hooks/useAvailable'

export function Register() {
  const [label, setLabel] = useState('')
  const [debouncedLabel] = useDebounce(label, 500)
  const isAvailable = useAvailable(debouncedLabel)

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

      <span className="text-brand-lapise-dense mt-1 ml-3 block font-mono text-xs uppercase">
        {isAvailable.isLoading && (
          <Loader2 className="animate-spin" size={16} />
        )}
        {isAvailable.isError && 'Error checking availability'}
        {isAvailable.data === true && 'Available'}
        {isAvailable.data === false && 'Not available'}
        {debouncedLabel === '' && 'Enter a name to register'}
      </span>
    </div>
  )
}
