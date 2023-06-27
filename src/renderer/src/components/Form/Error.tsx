import { useFormContext } from 'react-hook-form'

interface ErrorProps {
  name: string
}

export function Error({ name }: ErrorProps) {
  const { formState } = useFormContext()

  const error = formState.errors[name]?.message

  if (!error) {
    return <></>
  }

  return <span className="text-red-500 text-sm">{String(error)}</span>
}
