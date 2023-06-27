import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'

import clsx from 'clsx'

import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, variant, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'h-10 bg-emerald-200 px-4 flex items-center justify-center text-sm font-medium hover:enabled:bg-emerald-300',
          variant === 'secondary' && 'bg-zinc-200 hover:enabled:bg-zinc-300',
          variant === 'danger' && 'bg-red-200 hover:enabled:bg-red-300',
          (disabled || isLoading) && 'cursor-not-allowed opacity-60',
          className,
        )}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    )
  },
)
