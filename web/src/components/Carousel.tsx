import { cn } from '@/lib/utils'

export function Carousel() {
  return (
    <div className="flex flex-col gap-y-4">
      <CarouselCard
        color="blue"
        title="Consistent across the internet."
        description="Keep your identity consistent across all services and platforms effortlessly. Say goodbye to juggling multiple usernames."
      >
        Yooo
      </CarouselCard>

      <CarouselCard
        color="green"
        title="True ownership."
        description="Your ENS name is 100% yours. No intermediaries, no bureaucracy. It’s your property—uncensored and irrevocable."
      />

      <CarouselCard
        color="magenta"
        title="Farewell to complexity."
        description="No more confusing hex addresses. Your ENS name is easy to remember, easy to share."
      />
    </div>
  )
}

type CarouselCardProps = {
  title: string
  color: 'blue' | 'green' | 'magenta'
  description: string
}

function CarouselCard({
  title,
  color,
  description,
  children,
}: React.PropsWithChildren<CarouselCardProps>) {
  return (
    <div className={`bg-brand-${color}-light text-brand-${color} rounded`}>
      <div className="p-1.5">
        <div className="border-brand-${color}-dark border-t pt-4 pb-6">
          <h3 className="mb-4 text-xl font-semibold">{title}</h3>
          <p className="font-light">{description}</p>
        </div>
      </div>
      <div
        style={{
          backgroundImage: `url(/img/${color}-grid.svg)`,
        }}
        className="p-1.5"
      >
        {children}
      </div>
    </div>
  )
}
