import { useNavigate } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import { Button } from '../../components/Button'
import { Rectangle } from '../../components/Shimmer/Rectangle'
import { api } from '../../lib/api'
import { useProjectStore } from '../../stores/projectStore'
import { CollectionCard } from './CollectionCard'

type CollectionType = {
  id: string
  name: string
}

export function Collections() {
  const navigate = useNavigate()

  const project = useProjectStore((state) => state.project)

  const { data: collections, isLoading: isCollectionsLoading } = useQuery<
    CollectionType[]
  >(['collections'], async () => {
    const response = await api.get(`/projects/${project?.id}/collections`)

    return response.data.collections
  })

  if (!collections && isCollectionsLoading) {
    return (
      <div className="flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center">
          <div className="bg-zinc-200 h-6 w-32 animate-pulse" />

          <div className="bg-zinc-200 h-10 w-32 animate-pulse" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {new Array(7).fill('').map((_, index) => (
            <div
              key={String(index)}
              className="bg-zinc-200 h-16 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h1 className="font-semibold">Collections</h1>

        <Button type="button" onClick={() => navigate('/collections/create')}>
          + New collection
        </Button>
      </div>

      <div className="grid grid-cols-4 px-4 pb-4 gap-2">
        {collections?.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  )
}
