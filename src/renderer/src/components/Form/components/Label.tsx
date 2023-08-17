import { ComponentProps, ReactNode } from 'react'

export interface LabelProps extends ComponentProps<'label'> {
  name?: string
  children: ReactNode
}

export function Label({ name, ...props }: LabelProps) {
  if (!name) {
    throw new Error('Does not have the name property.')
  }

  return <label data-name={name} htmlFor={name} {...props} />
}
