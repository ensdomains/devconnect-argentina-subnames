import Image from 'next/image'

import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Slideshow } from '@/components/Slideshow'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-32">
      <Nav />

      <div className="px-4">
        <div className="relative flex items-end gap-x-4 pr-8">
          <h1 className="text-brand-blue-dark text-3xl font-light">
            The most human layer of Ethereum
          </h1>
          <span className="text-brand-grey">Claim your worldfair name</span>
          <Image
            src="/img/arrow.svg"
            alt="Arrow"
            width={22.5}
            height={55}
            className="absolute right-0 bottom-2"
          />
        </div>

        <Slideshow className="mt-4" />
      </div>

      <div>
        <div className="flex gap-x-4">
          <h2>The fair starts with your name.</h2>
          <span>Claim your worldfair name</span>
        </div>
        <div>
          <input />
          <Button size="small">Claim</Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
