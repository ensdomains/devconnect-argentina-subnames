import Image from 'next/image'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Register } from '@/components/Register'
import { Slideshow } from '@/components/Slideshow'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-8">
      <Nav />

      <div className="px-4">
        <div className="relative flex items-end gap-x-8 pr-6">
          <h1 className="text-brand-blue-dark text-3xl leading-7 font-light tracking-tight">
            The most human layer of Ethereum
          </h1>
          <span className="text-brand-grey font-mono leading-4 tracking-tight">
            Claim your worldfair name
          </span>
          <a href="#register" className="absolute right-0 bottom-2">
            <Image
              src="/img/arrow.svg"
              alt="Arrow"
              width={22.5}
              height={55}
              // className="absolute right-0 bottom-2"
            />
          </a>
        </div>

        <Slideshow className="mt-4" />
      </div>

      <div className="space-y-4 px-4">
        <div className="flex items-end gap-x-8" id="register">
          <h2 className="text-brand-blue-dark text-3xl leading-7 font-light tracking-tight">
            The fair starts with your name.
          </h2>
          <span className="text-brand-grey font-mono leading-4 tracking-tight">
            Claim your worldfair name
          </span>
        </div>

        <Register />
      </div>

      <Footer />
    </div>
  )
}
