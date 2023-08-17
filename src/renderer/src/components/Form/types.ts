export interface InputRefBase {
  isDirty: boolean

  getFieldValue: () => any
  setFieldValue: (value: any) => void
  resetField: () => void
}

export interface FormHandles {
  getFieldValue: (fieldName: string) => void
  setFieldValue: (fieldName: string, value: any) => void
  resetField: (fieldName: string) => void
  focus: (fieldName: string) => void

  getData: () => void
  setData: (data: Record<string, any>) => void

  reset: () => void
}
