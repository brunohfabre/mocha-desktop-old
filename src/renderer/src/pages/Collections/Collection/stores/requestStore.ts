import { create } from 'zustand'

import { RequestType } from '..'

type Store = {
  request: RequestType | null
  selectRequest: (data: RequestType | null) => void
}

export const useRequestStore = create<Store>((set) => ({
  request: null,
  selectRequest: (data: RequestType | null) =>
    set(() => ({
      request: data,
    })),
}))
