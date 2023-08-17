import { ComponentProps } from 'react'

interface MessageProps extends ComponentProps<'span'> {
  name?: string
}

export function Message({ name, ...props }: MessageProps) {
  if (!name) {
    throw new Error('Does not have the name property.')
  }

  return <span data-name={name} data-is-field-message {...props} />
}
