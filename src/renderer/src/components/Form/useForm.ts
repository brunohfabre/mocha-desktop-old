import { FormEventHandler, RefObject, useRef } from 'react'

import dot from 'dot-object'
import { z } from 'zod'

import { FormHandles } from './types'

function getChildNodes(
  ref: any,
  add: (ref: RefObject<HTMLInputElement>) => void,
) {
  add(ref)

  if (ref.childNodes) {
    Array.from(ref.childNodes).forEach((item) => {
      getChildNodes(item, add)
    })
  }
}

function getMessages(ref: any) {
  const nodes: any[] = []

  getChildNodes(ref, (node) => nodes.push(node))

  return nodes.filter(
    (item) => item.dataset && 'isFieldMessage' in item.dataset,
  )
}

function getFields(ref: any) {
  const nodes: any[] = []

  getChildNodes(ref, (node) => nodes.push(node))

  return nodes.filter((item) => item.dataset && 'isFormField' in item.dataset)
}

interface UseFormProps {
  resolver: z.ZodSchema
}

interface UseFormResponse<T> extends FormHandles {
  formRef: RefObject<HTMLFormElement>

  handleSubmit: (handle: (data: T) => void) => FormEventHandler<HTMLFormElement>
}

export function useForm<T>(props?: UseFormProps): UseFormResponse<T> {
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(handle: (data: T) => void) {
    return (event: any) => {
      event.preventDefault()

      try {
        getMessages(formRef.current).forEach((item) => {
          item.innerText = ''
        })

        const formData = getData()

        if (props?.resolver) {
          const parsedData = props.resolver.parse(formData)

          handle(parsedData ?? ({} as T))

          return
        }

        handle(formData ?? ({} as T))
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {}

          error.issues.forEach((issue) => {
            errors[issue.path[0]] = issue.message
          })

          getMessages(formRef.current).forEach((item) => {
            item.innerText = errors[item.dataset.name] ?? ''
          })
        }
      }
    }
  }

  function getFieldValue(fieldName: string) {
    if (!formRef.current) {
      return
    }

    const findField = getFields(formRef.current).find(
      (field: any) => field.name === fieldName,
    ) as any

    if (!findField) {
      throw new Error('Field does not exists.')
    }

    return findField.getFieldValue()
  }

  function setFieldValue(fieldName: string, value: any) {
    if (!formRef.current) {
      return
    }

    const findField = getFields(formRef.current).find(
      (item: any) => item.name === fieldName,
    ) as any

    if (!findField) {
      throw new Error('Field does not exists.')
    }

    findField.setFieldValue(value)
  }

  function resetField(fieldName: string) {
    if (!formRef.current) {
      return
    }

    const findField = getFields(formRef.current).find(
      (field: any) => field.name === fieldName,
    ) as any

    if (!findField) {
      throw new Error('Field does not exists.')
    }

    findField.resetField()
  }

  function focus(fieldName: string) {
    if (!formRef.current) {
      return
    }

    const findField = getFields(formRef.current).find(
      (field: any) => field.name === fieldName,
    ) as any

    if (!findField) {
      throw new Error('Field does not exists.')
    }

    findField.focus()
  }

  function getData(): T | void {
    if (!formRef.current) {
      return
    }

    const data = {} as T

    getFields(formRef.current).forEach((field: any) => {
      dot.set(
        field.name,
        field.isDirty ? field.getFieldValue() : undefined,
        data as {},
      )
    })

    return data
  }

  function setData(data: Record<string, any>) {
    if (!formRef.current) {
      return
    }

    getFields(formRef.current).forEach((field: any) => {
      if (field.name in data) {
        field.setFieldValue(data[field.name])
      }
    })
  }

  function reset() {
    if (!formRef.current) {
      return
    }

    getFields(formRef.current).forEach((field: any) => field.resetField())

    getMessages(formRef.current).forEach((item) => {
      item.innerText = ''
    })
  }

  return {
    handleSubmit,
    getFieldValue,
    setFieldValue,
    resetField,
    focus,
    getData,
    setData,
    reset,
    formRef,
  }
}
