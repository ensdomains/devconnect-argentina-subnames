import { getCoderByCoinType } from '@ensdomains/address-encoder'

import { cn } from '@/lib/utils'

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
  if (!value) return null

  if (type === 'text') {
    return (
      <div className={cn('flex flex-col gap-y-1', className)}>
        <span className="text-brand-grey text-xs font-medium lowercase">
          {label}
        </span>

        <span className="text-brand-lapise-dense">{value}</span>
      </div>
    )
  }

  if (type === 'social') {
    const { url, image } = getSocialData(label, value)

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-lapise-dense text-sm lowercase"
      >
        @{value}
      </a>
    )
  }

  if (type === 'address') {
    const coder = getCoderByCoinType(cointype)

    return (
      <>
        <div className="flex items-center gap-x-4">
          <span className="text-brand-grey text-xs font-medium uppercase">
            {coder.name}
          </span>

          <span>{value.slice(0, 10)}...</span>
        </div>
      </>
    )
  }

  return null
}

function getSocialData(
  key: string,
  value: string
): { url: string; image?: string } {
  if (key === 'com.twitter') {
    return { url: `https://x.com/${value}` }
  }

  if (key === 'com.github') {
    return { url: `https://github.com/${value}` }
  }

  return { url: value }
}
