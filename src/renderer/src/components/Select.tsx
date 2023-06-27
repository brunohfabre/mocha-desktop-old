import { SelectHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

import { Error } from './Form/Error'
import { FormControl } from './Form/FormControl'
import { Label } from './Form/Label'

type OptionType = {
  value: any
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  options: OptionType[]
  label?: string
}

export function Select({ name, label, options, ...props }: SelectProps) {
  const { register } = useFormContext()

  return (
    <FormControl>
      {label && <Label name={name} label={label} />}

      <select
        className="bg-red-200 h-10 px-4 text-sm"
        {...props}
        {...register(name)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Error name={name} />
    </FormControl>
  )
}
