import { AxiosError, AxiosResponse } from 'axios'
import { atom } from 'jotai'

type ResponseType = {
  response: AxiosResponse | AxiosError
  time: string
  status: string
  code: string
  size: string
}

export const responseAtom = atom<ResponseType | null>(null)

export const responseLoadingAtom = atom(false)
