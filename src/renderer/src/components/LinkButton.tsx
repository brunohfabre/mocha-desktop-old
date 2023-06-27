import clsx from 'clsx'
import { Link, LinkProps } from 'react-router-dom'

export function LinkButton({ className, ...props }: LinkProps) {
  return (
    <Link
      className={clsx('text-emerald-400 hover:text-emerald-500', className)}
      {...props}
    />
  )
}
