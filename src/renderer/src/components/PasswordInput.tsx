import { InputHTMLAttributes, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Eye, EyeSlash } from '@phosphor-icons/react'

import { Error } from './FormComponents/Error'
import { FormControl } from './FormComponents/FormControl'
import { Label } from './FormComponents/Label'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
}

export function PasswordInput({ name, label, ...props }: PasswordInputProps) {
  const { register } = useFormContext()

  const [visible, setVisible] = useState(false)

  function changeVisibility() {
    setVisible((prevState) => !prevState)
  }

  return (
    <FormControl>
      {label && <Label name={name} label={label} />}

      <div className="flex bg-red-200">
        <input
          className="flex-1 h-10 bg-transparent px-4 text-sm"
          type={visible ? 'text' : 'password'}
          {...props}
          {...register(name)}
        />

        <button
          type="button"
          className="h-10 w-10 flex items-center justify-center"
          onClick={changeVisibility}
          tabIndex={-1}
        >
          {visible ? (
            <EyeSlash size={16} weight="fill" />
          ) : (
            <Eye size={16} weight="fill" />
          )}
        </button>
      </div>

      <Error name={name} />
    </FormControl>
  )
}
