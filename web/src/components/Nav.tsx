'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

import { Button } from './Button'

export function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'

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
    </nav>
  )
}
