import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

import { Error } from './FormComponents/Error'
import { FormControl } from './FormComponents/FormControl'
import { Label } from './FormComponents/Label'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
}

export function TextInput({ name, label, ...props }: TextInputProps) {
  const { register } = useFormContext()

  return (
    <FormControl>
      {label && <Label name={name} label={label} />}

      <input
        type="text"
        className="bg-red-200 h-10 px-4 text-sm"
        {...props}
        {...register(name)}
      />

      <Error name={name} />
    </FormControl>
  )
}
