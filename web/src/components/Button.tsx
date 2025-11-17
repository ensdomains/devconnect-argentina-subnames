import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

type ButtonProps = {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary'
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  size = 'medium',
  variant = 'primary',
  children,
  className,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'flex items-center justify-center gap-2 rounded-md py-2.5 text-center font-mono text-sm leading-tight font-medium text-white disabled:cursor-not-allowed',
        'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none focus-visible:ring-2',
        size === 'small' && 'w-fit px-4',
        size === 'medium' && 'w-fit px-8',
        size === 'large' && 'w-full px-8',
        variant === 'primary' &&
          'bg-brand-blue hover:bg-brand-blue-hover disabled:bg-brand-blue/50',
        variant === 'secondary' &&
          'bg-brand-lapise-surface hover:bg-brand-lapise-surface/90 text-brand-lapise-dense disabled:bg-brand-lapise-dense/50',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
