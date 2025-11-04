import { Button } from '@/components/Button'
import { Carousel } from '@/components/Carousel'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-32">
      <Nav />

      <div>
        <div className="flex gap-x-4">
          <h1>The most human layer of Ethereum</h1>
          <span>Claim your worldfair name</span>
          <Image src="/img/arrow.svg" alt="Arrow" width={100} height={100} />
        </div>

        <Carousel />
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
