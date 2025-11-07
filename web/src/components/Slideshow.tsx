import Image from 'next/image'

import { cn } from '@/lib/utils'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

export function Slideshow({ className }: { className?: string }) {
  return (
    <Carousel
      className={className}
      opts={{
        loop: true,
        align: 'center',
        containScroll: false,
      }}
    >
      <CarouselContent className="-ml-4">
        <Card
          color="blue"
          title="True ownership."
          description="Your ENS name is 100% yours. No intermediaries, no bureaucracy. It's your property—uncensored and irrevocable."
        >
          <Image
            src="/img/carousel/blue/chat.svg"
            alt="Chat"
            width={300}
            height={245}
          />
        </Card>

        <Card
          color="magenta"
          title="Consistent across the internet."
          description="Keep your identity consistent across all services and platforms effortlessly. Say goodbye to juggling multiple usernames."
        >
          <div className="grid w-[270px] grid-cols-2 items-center justify-center gap-1 *:w-full">
            <Image
              className="col-span-2"
              src="/img/carousel/magenta/horizontal.svg"
              alt="Profile page mockup"
              width={270}
              height={165}
            />

            <Image
              src="/img/carousel/magenta/vertical-1.svg"
              alt="Vertical"
              width={132}
              height={175}
            />

            <Image
              src="/img/carousel/magenta/vertical-2.svg"
              alt="Vertical"
              width={132}
              height={175}
            />
          </div>
        </Card>

        <Card
          color="green"
          title="Farewell to complexity."
          description="No more confusing hex addresses. Your ENS name is easy to remember, easy to share."
        >
          <Image
            src="/img/carousel/green/vertical.svg"
            alt="Ownership"
            width={150}
            height={320}
          />
        </Card>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

type CardProps = {
  title: string
  color: 'blue' | 'green' | 'magenta'
  description: string
}

function Card({
  title,
  color,
  description,
  children,
}: React.PropsWithChildren<CardProps>) {
  return (
    <CarouselItem className="flex basis-[85%] pl-4 md:basis-[70%]">
      <div
        className={cn(
          'flex h-full w-full flex-col rounded',
          color === 'blue' && 'bg-brand-blue-light text-brand-blue',
          color === 'green' && 'bg-brand-green-light text-brand-green',
          color === 'magenta' && 'bg-brand-magenta-light text-brand-magenta'
        )}
      >
        <div className="flex-none p-1.5">
          <div className="border-brand-${color}-dark border-t pt-4 pb-6 tracking-tight">
            <h3 className="mb-4 text-xl font-medium">{title}</h3>
            <p className="font-serif">{description}</p>
          </div>
        </div>
        <div
          style={{
            backgroundImage: `url(/img/${color}-grid.svg)`,
          }}
          className="flex flex-1 items-center justify-center px-4 py-8"
        >
          {children}
        </div>
      </div>
    </CarouselItem>
  )
}
