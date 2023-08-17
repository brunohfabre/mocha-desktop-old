import { ReactNode } from 'react'

interface FormControlProps {
  children: ReactNode
}

export function FormControl({ children }: FormControlProps) {
  return <div className="flex flex-col gap-1">{children}</div>
}
