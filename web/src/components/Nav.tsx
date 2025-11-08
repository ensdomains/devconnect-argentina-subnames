import Image from 'next/image'
import Link from 'next/link'

import { Button } from './Button'

export function Nav() {
  return (
    <nav className="flex items-center justify-between p-4">
      <Link href="/">
        <Image src="/img/ens.svg" alt="ENS" width={100} height={100} />
      </Link>
      <Button>Share</Button>
    </nav>
  )
}
