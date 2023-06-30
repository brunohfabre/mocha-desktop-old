import { useNavigate } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import { Button } from '../../components/Button'
import { api } from '../../lib/api'
import { useOrganizationStore } from '../../stores/organizationStore'
import { CollectionCard } from './CollectionCard'

type CollectionType = {
  id: string
  name: string
}

export function Collections() {
  const navigate = useNavigate()

  const organization = useOrganizationStore((state) => state.organization)

  const { data: collections, isLoading: isCollectionsLoading } = useQuery<
    CollectionType[]
  >(['collections'], async () => {
    const response = await api.get(
      `/organizations/${organization?.id}/collections`,
    )

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
    <div className="flex-1 flex overflow-auto">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto p-4 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">Collections</h1>

          <Button type="button" onClick={() => navigate('/collections/create')}>
            + New collection
          </Button>
        </div>

        {!collections?.length && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-base font-semibold">No collections</p>
          </div>
        )}

        {!!collections?.length && (
          <div className="grid grid-cols-4 gap-4">
            {collections?.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
