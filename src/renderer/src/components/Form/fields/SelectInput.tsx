import { useRef, useEffect, useState, useCallback } from 'react'

import * as PopoverPrimitive from '@radix-ui/react-popover'

import { Check } from '../assets/icons/Check'
import { ChevronDown } from '../assets/icons/ChevronDown'

type Option = {
  value: string | number
  label: string
}

interface SelectInputProps {
  name?: string
  options: Option[]
  placeholder?: string
  onChange?: (option: Option) => void
  className?: string
}

interface InputRef extends HTMLButtonElement {
  isDirty: boolean

  getFieldValue: () => any
  setFieldValue: (value: string) => void
  resetField: () => void
}

export function SelectInput({
  name,
  options,
  placeholder,
  onChange,
  className,
}: SelectInputProps) {
  const ref = useRef<InputRef>(null)

  const [contentWidth, setContentWidth] = useState(0)
  const [open, setOpen] = useState(false)
  const [optionSelected, setOptionSelected] = useState<Option | null>(null)

  const getFieldValue = useCallback(() => {
    if (!ref.current) {
      return
    }

    return optionSelected?.value
  }, [optionSelected?.value])

  const setFieldValue = useCallback(
    (value: string | number | Option) => {
      if (!ref.current) {
        return
      }

      ref.current.isDirty = true

      if (typeof value === 'object') {
        setOptionSelected(value)
      } else {
        const findOption = options.find((option) => option.value === value)

        if (findOption) {
          setOptionSelected(findOption)
        }
      }
    },
    [options],
  )

  function resetField() {
    if (!ref.current) {
      return
    }

    ref.current.isDirty = false
    ref.current.value = ''
    setOptionSelected(null)
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.getFieldValue = getFieldValue
      ref.current.setFieldValue = setFieldValue
      ref.current.resetField = resetField

      setContentWidth(ref.current.offsetWidth)
    }
  }, [getFieldValue, setFieldValue])

  function handleChange(option: Option) {
    setOptionSelected(option)
    setOpen(false)

    if (ref.current) {
      ref.current.isDirty = true
    }

    if (onChange) {
      onChange(option)
    }
  }

  if (!name) {
    throw new Error('Does not have the name property.')
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          name={name}
          className={className}
          type="button"
          data-is-form-field
        >
          {optionSelected?.label ?? placeholder}
          <ChevronDown />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="bg-violet-200 flex flex-col py-2"
          style={{ width: contentWidth }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange(option)}
              className="h-8 px-3 flex items-center justify-between text-sm hover:bg-violet-300 cursor-pointer"
            >
              {option.label}{' '}
              {optionSelected?.value === option.value && <Check />}
            </button>
          ))}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
