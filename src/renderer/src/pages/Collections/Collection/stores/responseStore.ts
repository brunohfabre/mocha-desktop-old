import { create } from 'zustand'

type ResponseDataType = {
  time: number
  response: any
}

type Store = {
  loading: boolean
  data: ResponseDataType | null
  setResponseLoading: (state: boolean) => void
  setResponseData: (data: ResponseDataType | null) => void
}

export const useResponseStore = create<Store>((set) => ({
  loading: false,
  data: null,
  setResponseLoading: (state: boolean) =>
    set(() => ({
      loading: state,
    })),
  setResponseData: (data: ResponseDataType | null) =>
    set(() => ({
      data,
    })),
}))
