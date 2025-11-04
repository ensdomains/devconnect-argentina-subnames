import { cn } from '@/lib/utils'

type ButtonProps = {
  size?: 'small' | 'medium' | 'large'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ size = 'medium', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'bg-brand-blue text-sm text-brand-grey-2 py-2.5 rounded-md hover:bg-brand-blue-hover',
        size === 'small' && 'px-4 w-fit',
        size === 'medium' && 'px-10 w-fit',
        size === 'large' && 'px-10 w-full',
        props.className
      )}
      {...props}
    >
      {props.children}
    </button>
  )
}
