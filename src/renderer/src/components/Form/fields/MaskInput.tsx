import { ChangeEvent, useRef, useEffect, useCallback } from 'react'

import { toPattern } from 'vanilla-masker'

import { InputRefBase } from '../types'

interface MaskInputProps {
  name?: string
  mask: string
  placeholder?: string
  onChange?: (value: string) => void
}

type InputRef = HTMLInputElement & InputRefBase

export function MaskInput({
  name,
  mask,
  placeholder,
  onChange,
}: MaskInputProps) {
  const ref = useRef<InputRef>(null)

  function getFieldValue() {
    if (!ref.current) {
      return
    }

    return ref.current.value
  }

  const setFieldValue = useCallback(
    (value: string) => {
      if (!ref.current) {
        return
      }

      ref.current.isDirty = true
      ref.current.value = toPattern(value, mask)
    },
    [mask],
  )

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
  }, [setFieldValue])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = toPattern(event.target.value, mask)

    if (ref.current) {
      ref.current.isDirty = true

      ref.current.value = value
    }

    if (onChange) {
      onChange(value)
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
