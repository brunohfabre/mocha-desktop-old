import { Controller, useFormContext } from 'react-hook-form'
import { Label } from './Form/Label'
import { FormControl } from './Form/FormControl'
import { Error } from './Form/Error'
import { InputHTMLAttributes } from 'react'
import { toPattern } from 'vanilla-masker'

function maskValue(value: string = '', mask: string) {
  const originalValue = value.replace(/[^\w\s]/gi, '')

  if (mask === 'phone') {
    return toPattern(originalValue, '(99) 99999-9999')
  }

  return originalValue
}

interface MaskInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  mask: string
  label?: string
}

export function MaskInput({ name, label, mask, ...props }: MaskInputProps) {
  const { control } = useFormContext()

  return (
    <FormControl>
      {label && <Label name={name} label={label} />}

      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <input
            ref={ref}
            value={maskValue(value, mask)}
            onChange={onChange}
            onBlur={onBlur}
            type="text"
            className="bg-red-200 h-10 px-4 text-sm"
            {...props}
          />
        )}
      ></Controller>

      <Error name={name} />
    </FormControl>
  )
}
