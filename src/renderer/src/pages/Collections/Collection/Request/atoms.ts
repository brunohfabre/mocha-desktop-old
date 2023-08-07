import { atom } from 'jotai'

import { RequestType } from '../atoms'

export const requestSelectedAtom = atom<RequestType | null>(null)
