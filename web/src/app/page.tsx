import Image from 'next/image'

import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Input } from '@/components/Input'
import { Nav } from '@/components/Nav'
import { Slideshow } from '@/components/Slideshow'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-32">
      <Nav />

      <div className="px-4">
        <div className="relative flex items-end gap-x-8 pr-6">
          <h1 className="text-brand-blue-dark text-3xl font-light">
            The most human layer of Ethereum
          </h1>
          <span className="text-brand-grey font-mono">
            Claim your worldfair name
          </span>
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

      <div className="space-y-4 px-4">
        <div className="flex items-end gap-x-8">
          <h2 className="text-brand-blue-dark text-3xl font-light">
            The fair starts with your name.
          </h2>
          <span className="text-brand-grey font-mono">
            Claim your worldfair name
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <Input
            suffix={
              <span className="text-brand-grey font-medium">
                .worldfair.eth
              </span>
            }
            aria-invalid={true}
          />
          <Button size="small" className="uppercase">
            Claim
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
