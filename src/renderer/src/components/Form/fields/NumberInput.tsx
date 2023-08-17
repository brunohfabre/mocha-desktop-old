import { ChangeEvent, useRef, useEffect } from 'react'

import { InputRefBase } from '../types'

interface NumberInputProps {
  name?: string
  placeholder?: string
  onChange?: (value: number) => void

  min?: number
  max?: number
}

type InputRef = HTMLInputElement & InputRefBase

export function NumberInput({
  name,
  placeholder,
  onChange,
  min,
  max,
}: NumberInputProps) {
  const ref = useRef<InputRef>(null)

  function getFieldValue() {
    if (!ref.current) {
      return
    }

    return Number(ref.current.value)
  }

  function setFieldValue(value: number) {
    if (!ref.current) {
      return
    }

    ref.current.isDirty = true
    ref.current.value = String(value)
  }

  function resetField() {
    if (!ref.current) {
      return
    }

    ref.current.isDirty = false
    ref.current.value = ''
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.getFieldValue = getFieldValue
      ref.current.setFieldValue = setFieldValue
      ref.current.resetField = resetField
    }
  }, [])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/[^\d-]+/g, '')

    if (ref.current) {
      ref.current.isDirty = true

      if (typeof min === 'number' && typeof max === 'number') {
        if (Number(value) < min) {
          ref.current.value = String(min)
        } else if (Number(value) > max) {
          ref.current.value = String(max)
        } else {
          ref.current.value = value
        }
      } else {
        ref.current.value = value
      }
    }

    if (onChange) {
      onChange(Number(value))
    }
  }

  if (!name) {
    throw new Error('Does not have the name property.')
  }

  return (
    <input
      ref={ref}
      name={name}
      placeholder={placeholder}
      onChange={handleChange}
      type="text"
      data-is-form-field
    />
  )
}
