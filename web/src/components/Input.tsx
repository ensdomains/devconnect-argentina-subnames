import * as React from 'react'

import { cn } from '@/lib/utils'

type InputProps = {
  suffix?: React.ReactNode
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

// TODO: Make the suffix a static element so that the input can't overlap with it
function Input({
  className,
  type = 'text',
  suffix,
  label,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {label && (
        <label className="text-brand-grey text-xs font-medium lowercase">
          {label}
        </label>
      )}
      <input
        type={type}
        data-slot="input"
        autoComplete="off"
        data-1p-ignore="true"
        className={cn(
          'border-brand-grey/50 h-10 w-full min-w-0 rounded border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
          'aria-invalid:ring-ring/20 aria-invalid:border-ring',
          className
        )}
        {...props}
      />

      {suffix && (
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex items-center px-3">
          {suffix}
        </div>
      )}
    </div>
  )
}

export { Input }
