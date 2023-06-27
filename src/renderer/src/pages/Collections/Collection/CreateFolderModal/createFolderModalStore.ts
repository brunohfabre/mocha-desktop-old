import { create } from 'zustand'

type Store = {
  visible: string
  changeVisibility: (value: string) => void
}

export const useCreateFolderModalStore = create<Store>((set) => ({
  visible: '',
  changeVisibility: (value: string) =>
    set(() => ({
      visible: value,
    })),
}))
