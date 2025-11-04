import { cn } from '@/lib/utils'

type ButtonProps = {
  size?: 'small' | 'medium' | 'large'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ size = 'medium', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'bg-brand-blue text-brand-grey-2 hover:bg-brand-blue-hover rounded-md py-2.5 text-sm font-medium',
        size === 'small' && 'w-fit px-4',
        size === 'medium' && 'w-fit px-10',
        size === 'large' && 'w-full px-10',
        props.className
      )}
      {...props}
    >
      {props.children}
    </button>
  )
}
