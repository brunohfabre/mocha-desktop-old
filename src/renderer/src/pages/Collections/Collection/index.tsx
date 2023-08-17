import { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { useAtom } from 'jotai'

import { api } from '@/lib/api'

import { collectionAtom, CollectionType } from './atoms'
import { Sidebar } from './Sidebar'

export function Collection() {
  const { collectionId } = useParams<{
    collectionId: string
  }>()

  const [collection, setCollection] = useAtom(collectionAtom)

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
    }
  }, [collectionId, setCollection])

  if (!collection.id && loading) {
    return <div>loading...</div>
  }

  return (
    <div className="flex-1 flex overflow-auto">
      <Sidebar />

      <Outlet />
    </div>
  )
}
