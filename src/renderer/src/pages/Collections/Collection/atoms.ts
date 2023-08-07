import { atom } from 'jotai'

export type RequestType = {
  id: string
  name: string
  type: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  route: string
  parentId: string | null

  body: string | null
  bodyType: string

  auth: { [key: string]: any } | null
  authType: string

  headers: string | null
  query: string | null

  createdAt: string
}

export type CollectionType = {
  id: string
  name: string
  requests: RequestType[]
  requestId: null
}

export const collectionLoadingAtom = atom(false)

export const collectionAtom = atom({} as CollectionType)

// export const requestsAtom = atom((get) => get(collectionAtom)?.requests ?? [])
