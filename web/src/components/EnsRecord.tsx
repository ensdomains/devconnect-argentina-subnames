'use client'

import { CheckIcon } from 'lucide-react'
import { useState } from 'react'

import { getChainName } from '@/lib/records'
import { cn, truncateAddress } from '@/lib/utils'

type TextRecord = {
  type: 'social' | 'text'
  label: string
  cointype?: undefined
  value: string | undefined
}

type AddressRecord = {
  type: 'address'
  label?: undefined
  cointype: number
  value: string | undefined
}

type EnsRecordProps = (TextRecord | AddressRecord) &
  React.HTMLAttributes<HTMLDivElement>

export function EnsRecord({
  type,
  label,
  cointype,
  value,
  className,
}: EnsRecordProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }
  if (!value) return null

  if (type === 'text') {
    return (
      <div className={cn('flex flex-col', className)}>
        <span className="text-brand-grey text-xs font-medium lowercase">
          {label}
        </span>

        {label === 'Website' ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-lapise-dense w-fit text-sm"
          >
            {value}
          </a>
        ) : (
          <span className="text-brand-lapise-dense w-fit text-sm">{value}</span>
        )}
      </div>
    )
  }

  if (type === 'social') {
    const url = getSocialUrl(label, value)

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-lapise-dense flex items-center gap-x-2 text-sm lowercase"
      >
        <img
          src={`/img/social/${label}.svg`}
          alt={label}
          width={16}
          height={16}
          onError={(e) => {
            // Remove img from the page
            e.currentTarget.remove()
          }}
        />
        @{value}
      </a>
    )
  }

  if (type === 'address') {
    const chainName = getChainName(BigInt(cointype))

    return (
      <>
        <div className="flex items-center gap-x-4">
          <img
            src={`/img/address/${cointype}.svg`}
            alt={chainName}
            width={22}
            height={22}
          />

          <button
            className="text-brand-lapise-dense flex items-center gap-x-2 text-sm"
            onClick={() => handleCopy(value)}
          >
            {isCopied ? truncateAddress(value) : chainName}
            {isCopied && (
              <div className="flex items-center gap-x-1">
                <span
                  className="text-brand-lapise-dense font-mono uppercase"
                  style={{ WebkitTextSizeAdjust: 'none' }}
                >
                  Copied
                </span>
                <CheckIcon className="h-4 w-4" />
              </div>
            )}
          </button>
        </div>
      </>
    )
  }

  return null
}

function getSocialUrl(key: string, value: string) {
  switch (key) {
    case 'com.twitter':
      return `https://x.com/${value}`
    case 'com.github':
      return `https://github.com/${value}`
    case 'org.telegram':
      return `https://t.me/${value}`
    case 'eth.farcaster':
      return `https://farcaster.xyz/${value}`
    default:
      return value
  }
}
