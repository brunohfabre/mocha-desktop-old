import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAtom } from 'jotai'

import { api } from '@/lib/api'

import { collectionAtom, CollectionType } from './atoms'
import { Request } from './Request'
import { requestSelectedAtom } from './Request/atoms'
import { Response } from './Response'
import { Sidebar } from './Sidebar'

export function Collection() {
  const { collectionId } = useParams<{
    collectionId: string
  }>()

  const [collection, setCollection] = useAtom(collectionAtom)
  const [requestSelected, setRequestSelected] = useAtom(requestSelectedAtom)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadCollection() {
      try {
        setLoading(true)

        const response = await api.get(`/collections/${collectionId}`)

        setCollection(response.data.collection)
      } finally {
        setLoading(false)
      }
    }

    loadCollection()

    return () => {
      setCollection({} as CollectionType)
      setRequestSelected(null)
    }
  }, [collectionId, setCollection, setRequestSelected])

  if (!collection.id && loading) {
    return <div>loading...</div>
  }

  return (
    <div className="flex-1 flex overflow-auto">
      <Sidebar />

      {requestSelected ? (
        <>
          <Request />

          <Response />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm">To start, select a request.</span>
        </div>
      )}
    </div>
  )
}
