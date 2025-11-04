export function Carousel() {
  return (
    <div className="flex flex-col gap-y-4">
      <CarouselCard title="Title" color="blue" description="Description" />
      <CarouselCard title="Title" color="green" description="Description" />
      <CarouselCard title="Title" color="magenta" description="Description" />
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
    <div
      className={`flex flex-col gap-y-4 bg-brand-${color}-light text-brand-${color}`}
    >
      <h3>{title}</h3>
      <p>{description}</p>

      {children}
    </div>
  )
}
