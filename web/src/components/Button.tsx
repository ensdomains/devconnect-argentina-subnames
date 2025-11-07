import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

type ButtonProps = {
  size?: 'small' | 'medium' | 'large'
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  size = 'medium',
  children,
  className,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'bg-brand-blue text-brand-grey-2 hover:bg-brand-blue-hover rounded-md py-2.5 font-mono text-sm font-medium',
        'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none focus-visible:ring-2',
        size === 'small' && 'w-fit px-4',
        size === 'medium' && 'w-fit px-10',
        size === 'large' && 'w-full px-10',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
