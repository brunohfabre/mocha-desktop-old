import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'

import clsx from 'clsx'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: 'sm' | 'md'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size, className, ...props }, ref) => {
    return (
      <button
        {...props}
        className={clsx(
          'w-10 h-10 flex items-center justify-center bg-emerald-200 hover:enabled:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60',
          size === 'sm' && 'w-8 h-8',
          className,
        )}
      >
        {children}
      </button>
    )
  },
)
