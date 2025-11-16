'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

import { useAccount } from '@/hooks/useAccount'
import { useDisconnect } from '@/hooks/useDisconnect'

import { Button } from './Button'

export function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const disconnect = useDisconnect()
  const { isConnected } = useAccount()

  return (
    <nav className="flex items-center justify-between p-4">
      <Link href="/">
        <Image src="/img/ens.svg" alt="ENS" width={100} height={100} />
      </Link>
      {!isHome && (
        <Button
          onClick={async () => {
            const url = new URL(window.location.href)
            await navigator.clipboard.writeText(url.toString())
            toast.success('Copied to clipboard')
          }}
        >
          Share
        </Button>
      )}

      {isHome && isConnected && (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      )}
    </nav>
  )
}
