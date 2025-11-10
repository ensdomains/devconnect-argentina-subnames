'use client'

import { getCoderByCoinType } from '@ensdomains/address-encoder'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'

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

        <span className="text-brand-lapise-dense text-sm">{value}</span>
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
        />
        @{value}
      </a>
    )
  }

  if (type === 'address') {
    const coder = getCoderByCoinType(cointype)

    return (
      <>
        <div className="flex items-center gap-x-4">
          {/* <span className="text-brand-grey w-12 text-xs font-medium uppercase">
            {/* <span className="text-brand-grey w-12 text-xs font-medium uppercase">
              {coder.name}
            </span> */}
          <img
            src={`/img/address/${cointype}.svg`}
            alt={coder.name}
            width={22}
            height={22}
          />

          <button
            className="text-brand-lapise-dense flex items-center gap-x-2 text-sm lowercase"
            onClick={() => handleCopy(value)}
          >
            {truncateAddress(value)}
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
  }

  return value
}
