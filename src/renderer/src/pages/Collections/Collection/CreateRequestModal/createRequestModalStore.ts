import { create } from 'zustand'

type Store = {
  visible: string
  changeVisibility: (value: string) => void
}

export const useCreateRequestModalStore = create<Store>((set) => ({
  visible: '',
  changeVisibility: (value: string) =>
    set(() => ({
      visible: value,
    })),
}))
