import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserType = {
  id: string
  name: string
  email: string
}

type CredentialsType = {
  token: string
  user: UserType | null
}

interface Store {
  token: string
  user: UserType | null
  setCredentials: (data: CredentialsType) => void
}

export const useAuthStore = create(
  persist<Store>(
    (set) => ({
      token: '',
      user: null,
      setCredentials: (data: CredentialsType) =>
        set(() => ({
          token: data.token,
          user: data.user,
        })),
    }),
    {
      name: 'auth',
    },
  ),
)
