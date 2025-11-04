import Image from 'next/image'

import { Button } from './Button'

export function Nav() {
  return (
    <nav className="flex items-center justify-between p-4">
      <Image src="/img/ens.svg" alt="ENS" width={100} height={100} />
      <Button>Share</Button>
    </nav>
  )
}
